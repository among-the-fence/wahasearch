import { cleanName } from "@/lib/util";
import { DataCard } from "./datacard";
import { FILTERS_FACTION, FILTERS_KEYWORDS, FILTERS_LEGENDS, FILTERS_POINTS, LEGENDS_NONE, LEGENDS_ONLY, FACTION_NICKNAME_MAP, KEYWORD_NICKNAME_MAP } from "../constants";

export class IndexedData {
    sortingName: string;
    names: string[];
    keywords: string[];
    factions: string[];
    legends: boolean;
    points: number[];

    constructor(data: DataCard) {
        const names = [data.name.toLowerCase()];
        this.sortingName = cleanName(data.name);
        names.push(this.sortingName.toLowerCase());
        this.names = Array.from(new Set(names.filter(Boolean)));

        const keywords = data.keywords.map(x => x.toLowerCase());
        keywords.push(...data.profiles.flatMap(profile => profile.keywords?.map(x => x.toLowerCase())));
        const additional = keywords.filter(Boolean).flatMap(x => KEYWORD_NICKNAME_MAP[x.toLowerCase() as keyof typeof KEYWORD_NICKNAME_MAP]);
        this.keywords = Array.from(new Set([...keywords, ...additional].filter(Boolean)));

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
    }

    matches(filters: Map<String, String>): boolean {
        // console.log(filters);
        const keywordFilter = filters.get(FILTERS_KEYWORDS)?.toLowerCase() || "";
        if (keywordFilter.length > 0 && !this.keywords.some(x => x.includes(keywordFilter)))
            return false;

        const factionFilter = filters.get(FILTERS_FACTION)?.toLowerCase() || "";
        if (factionFilter.length > 0) {
            const factionNames = factionFilter.split(',').map(s => s.trim()).filter(Boolean);
            const matches = factionNames.some(filt =>
                this.factions.some(fac => fac.includes(filt))
            );
            if (!matches) return false;
        }

        // Points filter
        const pointsFilter = filters.get(FILTERS_POINTS)?.trim() || "";
        if (pointsFilter.length > 0) {
            const filtersArr = pointsFilter.split(',').map(s => s.trim()).filter(Boolean);
            // For each point value, check if ANY filter matches it
            const matches = this.points.some(cardPoints => {
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
            if (!matches) return false;
        }

        if (filters.get(FILTERS_LEGENDS) == LEGENDS_ONLY && !this.legends)
            return false;
        if (filters.get(FILTERS_LEGENDS) == LEGENDS_NONE && this.legends)
            return false;
        return true;
    }
}
