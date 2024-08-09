import {SearchItem} from "@/lib/SearchItem"
import { Datasheet } from "@/models/faction";

const keywordAbbreviationMap = {
    "devestating wounds": ["dw", "dev wounds"],
    "deadly demise": ["dd"],
    "lethal hits": ["lh", "lethal"],
    "sustained hits": ["sh", "sustain", "sustained", "sus"],
    "re-roll": ["rr", "reroll", "re roll"],
};

export class SearchParams {
    faction: string | undefined;
    filters: any[];

    constructor(params: Map<string, string>) {
        this.faction = params.get('faction');
        this.filters = [];
        this.parseSearchParameter("toughness", params.get('toughness'));
        this.parseSearchParameter("save", params.get('save'));
        this.parseSearchParameter("wounds", params.get('wounds'));
        this.parseSearchParameter("movement", params.get('movement'));
        this.parseSearchParameter("invuln", params.get('invuln'));
        this.parseSearchParameter("feelnopain", params.get('feelnopain'));
        this.parseSearchParameter("attacks", params.get('attacks'));
        this.parseSearchParameter("weaponskill", params.get('weaponskill'));
        this.parseSearchParameter("strength", params.get('strength'));
        this.parseSearchParameter("damage", params.get('damage'));
        this.parseSearchParameter("armorpenetration", params.get('armorpenetration'));
        this.parseSearchParameter("ld", params.get('ld'));
        this.parseSearchParameter("points", params.get('points'));
        // this.parseSearchParameter("compiledKeywords", params.get('compiledKeywords'));
        this.parseSearchParameter("oc", params.get('oc'));
    }

    parseSearchParameter(key:string, item:string|undefined) {
        if (item) {
            if (key === "compiledKeywords") {
                if (item) {
                    item.toLowerCase().split(",").forEach(x => {
                        x = x.trim();
                        let added = false;
                        for (const [k, v] of Object.entries(keywordAbbreviationMap)) {
                            if (v.includes(x)) {
                                this.filters.push(new SearchItem("compiledKeywords", k));
                                added = true;
                                break;
                            }
                        }
                        if (!added) {
                            this.filters.push(new SearchItem("compiledKeywords", x));
                        }
                    });
                }
            } else {
                this.filters.push(...item.split(",").map(x => new SearchItem(key, x.trim())));
            }
        }
    }

    toString() {
        const out = this.faction ? `f:${this.faction}` : null;
        return [out, ...this.filters].filter(x => x).join(", ");
    }

    empty() {
        return this.filters.length === 0 && this.faction === null;
    }

    apply(unit: Datasheet) {
        return this.filters.every(f => f && f.apply(unit));
    }

    filter(unitList: Datasheet[]) {
        if (unitList) {
            for (const f of this.filters) {
                if (f && (f.minFilter || f.maxFilter)) {
                    unitList = f.filter(unitList);
                }
            }
        }
        return unitList;
    }
}

