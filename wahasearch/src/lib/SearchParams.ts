import {SearchItem} from "@/lib/SearchItem"
import { Datasheet } from "@/models/faction";


const keywordAbbreviationMap = {
    "devestating wounds": ["dw", "dev wounds"],
    "deadly demise": ["dd"],
    "lethal hits": ["lh", "lethal"],
    "sustained hits": ["sh", "sustain", "sustained", "sus"],
    "re-roll": ["rr", "reroll", "re roll"],
};


function getDigFunction(propName: string) : ((arg: any) => string[]) {

    if (propName == "faction")
        return (unit: any) => {return unit.factions}
    else if (propName == "compiledKeywords") {
        return (unit: any) => {return unit.indexedFields?.compiledKeywords;};
    }
    else if (propName == "movement") {
        return (unit: any) => {return unit.indexedFields?.stats.map((s: { m: string; }) => s.m);};
    }
    else if (propName == "toughness") {
        return (unit: any) => {
            return unit.indexedFields?.stats.map((s: { t: string; }) => s.t);
        };
    }
    else if (propName == "save") {
        return (unit: any) => {return unit.indexedFields?.stats.map((s: { sv: string; }) => s.sv);};
    }
    else if (propName == "wounds") {
        return (unit: any) => {return unit.indexedFields?.stats.map((s: { w: string; }) => s.w);};
    }
    else if (propName == "oc") {
        return (unit: any) => {return unit.indexedFields?.stats.map((s: { oc: string; }) => s.oc) ;};
    }
    else if (propName == "ld") {
        return (unit: any) => {return unit.indexedFields?.stats.map((s: { ld: string; }) => s.ld);};
    }
    else if (propName == "strength") {
        return (profile: any) => {return profile.strength};
    }
    else if (propName == "attacks") {
        return (profile: any) => {return profile.attacks};
    }
    else if (propName == "armorpenetration") {
        return (profile: any) => {return profile.ap};
    }
    else if (propName == "damage") {
        return (profile: any) => {return profile.damage};
    }
    else if (propName == "skill") {
        return (profile: any) => {return profile.skill};
    }
    else if (propName == "range") {
        return (profile: any) => {return profile.range};
    }
    return (_:any) => [];
}

export class SearchParams {
    faction: string | undefined;
    filters: SearchItem[];
    weaponFilters: SearchItem[];

    constructor(params: Map<string, string>) {
        this.faction = params.get('faction');
        this.filters = [];
        this.weaponFilters = []
        this.filters = this.filters.concat(this.parseSearchParameter("save", params.get('save')));
        this.filters = this.filters.concat(this.parseSearchParameter("wounds", params.get('wounds')));
        this.filters = this.filters.concat(this.parseSearchParameter("movement", params.get('movement')));
        this.filters = this.filters.concat(this.parseSearchParameter("invuln", params.get('invuln')));
        this.filters = this.filters.concat(this.parseSearchParameter("feelnopain", params.get('feelnopain')));
        this.filters = this.filters.concat(this.parseSearchParameter("toughness", params.get('toughness')));
        this.filters = this.filters.concat(this.parseSearchParameter("ld", params.get('ld')));
        this.filters = this.filters.concat(this.parseSearchParameter("points", params.get('points')));
        this.filters = this.filters.concat(this.parseSearchParameter("oc", params.get('oc')));
        this.weaponFilters = this.weaponFilters.concat(this.parseSearchParameter("range", params.get('range')));
        this.weaponFilters = this.weaponFilters.concat(this.parseSearchParameter("attacks", params.get('attacks')));
        this.weaponFilters = this.weaponFilters.concat(this.parseSearchParameter("weaponskill", params.get('weaponskill')));
        this.weaponFilters = this.weaponFilters.concat(this.parseSearchParameter("strength", params.get('strength')));
        this.weaponFilters = this.weaponFilters.concat(this.parseSearchParameter("damage", params.get('damage')));
        this.weaponFilters = this.weaponFilters.concat(this.parseSearchParameter("armorpenetration", params.get('armorpenetration')));
    }

    parseSearchParameter(key:string, item:string|undefined) {
        const newFilters = [];
        if (item) {
            if (key === "compiledKeywords") {
                if (item) {
                    item.toLowerCase().split(",").forEach(x => {
                        x = x.trim();
                        let added = false;
                        for (const [k, v] of Object.entries(keywordAbbreviationMap)) {
                            if (v.includes(x)) {
                                newFilters.push(new SearchItem("compiledKeywords", k, getDigFunction("compiledKeywords")));
                                added = true;
                                break;
                            }
                        }
                        if (!added) {
                            newFilters.push(new SearchItem("compiledKeywords", x, getDigFunction("compiledKeywords")));
                        }
                    });
                }
            } else {
                if ( key == "range" && item.toLowerCase() == "melee")
                    item = "0";
                newFilters.push(...item.toLowerCase().split(",").map(x => new SearchItem(key, x.replace(/\+-\"/g, "").trim(), getDigFunction(key))));
            }
        }
        // newFilters.forEach(f => console.log(f.__raw));
        return newFilters;
    }

    toString() {
        const out = this.faction ? `f:${this.faction}` : null;
        return [out, ...this.filters].filter(x => x).join(", ");
    }

    empty() {
        return this.filters.length === 0 && this.faction === null;
    }

    apply(unit: Datasheet) {
        const match_all_unit_filters = (!this.filters || this.filters.every(f => f && f.apply(unit)));
        const matchAllWeaponFilters = (!this.weaponFilters || unit.indexedFields?.weaponProfiles.some(pp => this.weaponFilters.every(wf => { return wf.apply(pp)})));
        return match_all_unit_filters && matchAllWeaponFilters;
            
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

