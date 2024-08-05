import { Datasheet } from '@/models/faction';

// const searchTypeRe = /(<|>|=|!)+/;

export class SearchItem {
    __raw: string;
    propName: string;
    minFilter: string | undefined;
    maxFilter: string | undefined;
    searchType: ((unit: any) => boolean) | undefined;
    searchValue: string | number;
    searchFunction: ((unit:Datasheet) => boolean) | undefined;

    constructor(propName:string, itemStr:string) {
        this.__raw = `${propName}:${itemStr}`;
        this.propName = propName;
        this.searchValue = -1; 

        if (itemStr.length > 0) {
            if (itemStr.includes("min")) {
                this.minFilter = propName;
            } else if (itemStr.includes("max")) {
                this.maxFilter = propName;
            } else if (["keywords"].includes(propName)) {
                if (itemStr.includes("!=")) {
                    itemStr = itemStr.replace("!=", "");
                    this.searchFunction = (unit) => !this.digForProp(unit, propName).includes(itemStr);
                } else {
                    itemStr = itemStr.replace("=", "");
                    this.searchFunction = (unit) => this.digForProp(unit, propName).includes(itemStr);
                }
            } else {
                if (itemStr.includes(">=")) {
                    this.searchValue = itemStr.replace(">=", "");
                    this.searchType = (x) => x >= this.searchValue;
                }
                else if (itemStr.includes("<=")) {
                    this.searchValue = itemStr.replace("<=", "");
                    this.searchType = (x) => x <= this.searchValue;
                }
                else if (itemStr.includes(">")) {
                    this.searchValue = itemStr.replace(">", "");
                    this.searchType = (x) => x > this.searchValue;
                }
                else if (itemStr.includes("<")) {
                    this.searchValue = itemStr.replace("<", "");
                    this.searchType = (x) => x < this.searchValue;
                } 
                else if (itemStr.includes("!=")) {
                    this.searchValue = itemStr.replace("!=", "");
                    this.searchType = (x) => x != this.searchValue;
                }
                else {
                    this.searchValue = itemStr.replace("=", "");
                    this.searchType = (x) => x == this.searchValue;
                }
            }
        }
    }

    toString() {
        return this.__raw;
    }

    apply(unit: Datasheet) {
        if (this.searchFunction) {
            return this.searchFunction(unit);
        }
        else if (this.searchType && this.propName) {
            const foundProps = this.digForProp(unit, this.propName).map(x=> parseInt(x) || x)
            const res = foundProps?.some(x => this.searchType && this.searchType(x))
            // console.log(`searching ${foundProps} : ${this.searchValue} : ${this.__raw} : ${res}` )

           return res;
        }
        return false;
    }

    static flatten(lst: any[]) {
        const out = [];
        for (const i of lst) {
            if (i) {
                out.push(...i);
            }
        }
        return out;
    }

    filter(units: Datasheet[]) {
        let extremeValue = -1;
        if (this.maxFilter) {
            const propName = this.maxFilter;
            const flattenValues = SearchItem.flatten(units.map(x => this.digForProp(x, propName)));
            const filteredValues = flattenValues.filter(x => typeof x === 'number');
            extremeValue = Math.max(...filteredValues);
        }
        if (this.minFilter) {
            const propName = this.minFilter;
            const flattenValues = SearchItem.flatten(units.map(x => this.digForProp(x, propName)));
            extremeValue = Math.min(...flattenValues);
        }
        const out = [];
        if (this.propName) {
            if (Array.isArray(extremeValue)) {
                extremeValue = extremeValue[0];
            }
            for (const u of units) {
                const gotProp = this.digForProp(u, this.propName);
                if (gotProp && gotProp.includes(extremeValue)) {
                    out.push(u);
                }
            }
        }
        return out;
    }

    digForProp(unit: Datasheet, propName: string): any[] {
        if (propName == "faction")
            return unit.factions
        else if (propName == "compiledKeywords") {
            return unit.indexedFields?.compiledKeywords || [];
        }
        else if (propName == "movement") {
            return unit.indexedFields?.stats.map(s => s.m.replace("\"", "")) || [];
        }
        else if (propName == "toughness") {
            return unit.indexedFields?.stats.map(s => s.t) || [];
        }
        else if (propName == "save") {
            return unit.indexedFields?.stats.map(s => s.sv.replace("+", "")) || [];
        }
        else if (propName == "wounds") {
            return unit.indexedFields?.stats.map(s => s.w) || [];
        }
        else if (propName == "oc") {
            return unit.indexedFields?.stats.map(s => s.oc) || [];
        }
        else if (propName == "ld") {
            return unit.indexedFields?.stats.map(s => s.ld.replace("+", "")) || [];
        }
        else if (propName == "strength") {
            return unit.indexedFields?.weaponProfiles.flatMap(pp => pp.strength) || [];
        }
        else if (propName == "attacks") {
            return unit.indexedFields?.weaponProfiles.flatMap(pp => pp.attacks) || [];
        }
        else if (propName == "armor penetration") {
            return unit.indexedFields?.weaponProfiles.flatMap(pp => pp.ap) || [];
        }
        else if (propName == "damage") {
            return unit.indexedFields?.weaponProfiles.flatMap(pp => pp.damage) || [];
        }
        else if (propName == "skill") {
            return unit.indexedFields?.weaponProfiles.flatMap(pp => pp.skill) || [];
        }
        return [];
    }
}

