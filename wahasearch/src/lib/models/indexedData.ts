import { cleanName1, cleanName2 } from "@/lib/util";
import { DataCard } from "./datacard";
import { FILTERS_FACTION, FILTERS_POINTS, FACTION_NICKNAME_MAP, KEYWORD_NICKNAME_MAP, CURRENT_DATASHEETS, KOTC_DATASHEETS, LEGENDS_DATASHEETS } from "../constants";
import { SearchFormData } from "./searchFormData";
import { UNIT_NICKNAME_MAP } from "../unitNickname";

export class IndexedData {
    sortingName: string;
    names: string[];
    keywords: string[];
    factions: string[];
    legends: boolean;
    points: number[];
    characteristics: Map<string, number[]>;

    constructor(data: DataCard) {
        const names = [data.name.toLowerCase()];
        this.sortingName = cleanName1(data.name);
        names.push(this.sortingName.toLowerCase());
        names.push(cleanName2(this.sortingName));
        names.push(...UNIT_NICKNAME_MAP[data.name.toLowerCase() as keyof typeof UNIT_NICKNAME_MAP] || []);
        this.names = Array.from(new Set(names.filter(Boolean)));

        const keywords = data.keywords.map(x => x.toLowerCase());
        keywords.push(...data.profiles.flatMap(profile => profile.keywords?.map(x => x.toLowerCase())));
        const additional = keywords.filter(Boolean).flatMap(x => KEYWORD_NICKNAME_MAP[x.toLowerCase() as keyof typeof KEYWORD_NICKNAME_MAP]);
        this.keywords = Array.from(new Set([...keywords, ...additional, ...this.names].filter(Boolean).filter((x: string) => x.length > 1)));

        this.factions = data.factions.map(x => x.toLowerCase());
        this.factions.push(
            ...data.factions
                .map(x => FACTION_NICKNAME_MAP[x.toLowerCase() as keyof typeof FACTION_NICKNAME_MAP])
                .filter(Boolean)
                .flat()
        );
        this.factions = Array.from(new Set(this.factions.filter(Boolean)));
        this.legends = data.legends;
        this.points = data.costs.map(x => x.value);

        this.characteristics = new Map<string, number[]>();
        data.profiles.filter(p => p.characteristics.has('M')).forEach(profile => {
            profile.characteristics.forEach((c: any) => {
                const key = c['@_name'].toLowerCase();
                if (!this.characteristics.has(key)) this.characteristics.set(key, []);
                const v = c['#text'];
                if (v === "-")
                    this.characteristics.get(key)!.push(0);
                else {
                    const num = Number(v);
                    if (!this.characteristics.get(key)!.includes(num))
                        this.characteristics.get(key)!.push(num);
                }
            });
        });
    }

    matches(filters: SearchFormData): boolean {

        const keywordFilter = filters.processedKeywords;
        const keywordMatch = keywordFilter.length === 0 || keywordFilter.every(kwExpr => {
            // Support !=, ==, =
            let op = '=';
            let kw = kwExpr;
            if (kwExpr.startsWith("!=") || kwExpr.startsWith("==")) {
                op = kwExpr.substring(0, 2);
                kw = kwExpr.substring(2);
            } else if (kwExpr.startsWith("!") || kwExpr.startsWith("=")) {
                op = kwExpr.substring(0, 1);
                kw = kwExpr.substring(1);
            }
            kw = kw.trim().toLowerCase();
            const present = this.keywords.some(k => k.includes(kw)) || this.factions.some(f => f.includes(kw));
            if (op === '!=' || op === '!') {
                return !present;
            } else if (op === '=' || op === '==') {
                return present;
            }
        });
        if (!keywordMatch)
            return false;

        const factionFilter = filters.get(FILTERS_FACTION)?.toLowerCase() || "";
        let factionMatch = true;
        if (factionFilter.length > 0) {
            const factionNames = factionFilter.split(',').map(s => s.trim()).filter(Boolean);
            factionMatch = factionNames.some(filt =>
                this.factions.some(fac => fac.includes(filt))
            );
        }

        const toughnessFilter = filters.processedToughness;
        let toughnessMatch = true;
        if (toughnessFilter.length > 0) {
            // Support !=, ==, =, <=, >=
            toughnessMatch = toughnessFilter.every(t => {
                let op = '=';
                let toughness = t;
                if (t.startsWith("!=") || t.startsWith("==") || t.startsWith("<=") || t.startsWith(">=")) {
                    op = t.substring(0, 2);
                    toughness = t.substring(2);
                } else if (t.startsWith("!") || t.startsWith("=") || t.startsWith("<") || t.startsWith(">")) {
                    op = t.substring(0, 1);
                    toughness = t.substring(1);
                }
                const toughnessNum = Number(toughness.trim());
                const present = this.characteristics.get('t')?.includes(toughnessNum);
                if (op === '!=' || op === '!') {
                    return !present;
                } else if (op === '=' || op === '==') {
                    return present;
                } else if (op === '<') {
                    return this.characteristics.get('t')?.some(t => t < toughnessNum);
                } else if (op === '<=') {
                    return this.characteristics.get('t')?.some(t => t <= toughnessNum);
                } else if (op === '>') {
                    return this.characteristics.get('t')?.some(t => t > toughnessNum);
                } else if (op === '>=') {
                    return this.characteristics.get('t')?.some(t => t >= toughnessNum);
                }
            });
        }

        // Points filter
        const pointsFilter = filters.get(FILTERS_POINTS)?.trim() || "";
        let pointsMatch = true;
        if (pointsFilter.length > 0) {
            const filtersArr = pointsFilter.split(',').map(s => s.trim()).filter(Boolean);
            // For each point value, check if ANY filter matches it
            pointsMatch = this.points.some(cardPoints => {
                return filtersArr.some(expr => {
                    // Match operators
                    const opMatch = expr.match(/^(<=|>=|<|>|==)?\s*(-?\d+)$/);
                    if (!opMatch) return false;
                    const [, op, numStr] = opMatch;
                    const num = Number(numStr);
                    switch (op) {
                        case '<=': return cardPoints <= num;
                        case '<': return cardPoints < num;
                        case '>=': return cardPoints >= num;
                        case '>': return cardPoints > num;
                        case '==': return cardPoints === num;
                        default: return cardPoints === num;
                    }
                });
            });
        }

        let legendsMatch = true;
        // check the legends state against the card's legends state
        if (filters.get(CURRENT_DATASHEETS) == "true") {
            if (filters.get(LEGENDS_DATASHEETS) != "true" && this.legends)
                legendsMatch = false;
        }
        // console.log("Match:", keywordMatch, factionMatch, pointsMatch, toughnessMatch, legendsMatch);
        return keywordMatch && factionMatch && pointsMatch && toughnessMatch && legendsMatch;
    }
}