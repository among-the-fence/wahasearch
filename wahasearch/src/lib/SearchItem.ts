import { Datasheet } from '@/models/faction';

// const searchTypeRe = /(<|>|=|!)+/;

export class SearchItem {
    __raw: string;
    propName: string;
    minFilter: string | undefined;
    maxFilter: string | undefined;
    searchType: ((unit: any) => boolean) | undefined;
    searchValue: number;
    searchFunction: ((unit:Datasheet) => boolean) | undefined;
    digFunction: ((arg:any) => string[]);

    constructor(propName:string, itemStr:string, dig:((arg:any)=>string[])) {
        
        this.__raw = `${propName}:${itemStr}`;
        this.propName = propName;
        this.searchValue = -1; 
        this.digFunction = dig;

        if (itemStr.length > 0) {
            if (itemStr.toLowerCase().includes("min")) {
                this.minFilter = propName;
            } else if (itemStr.toLowerCase().includes("max")) {
                this.maxFilter = propName;
            } else if (["keywords"].includes(propName)) {
                if (itemStr.includes("!=")) {
                    itemStr = itemStr.replace("!=", "");
                    this.searchFunction = (unit) => !unit.indexedFields?.compiledKeywords?.includes(itemStr) || false;
                } else {
                    itemStr = itemStr.replace("=", "");
                    this.searchFunction = (unit) => unit.indexedFields?.compiledKeywords?.includes(itemStr) || false;
                }
            } else {
                itemStr = itemStr.replace("+", "").replace("\"", "").replace("-", "").trim()
                if (itemStr.includes(">=")) {
                    this.searchValue = Number(itemStr.replace(">=", ""));
                    this.searchType = (x) => x >= this.searchValue;
                }
                else if (itemStr.includes("<=")) {
                    this.searchValue = Number(itemStr.replace("<=", ""));
                    this.searchType = (x) => x <= this.searchValue;
                }
                else if (itemStr.includes(">")) {
                    this.searchValue = Number(itemStr.replace(">", ""));
                    this.searchType = (x) => {
                        return Number(x) > this.searchValue;
                    };
                }
                else if (itemStr.includes("<")) {
                    this.searchValue = Number(itemStr.replace("<", ""));
                    this.searchType = (x) => x <=this.searchValue;
                } 
                else if (itemStr.includes("!=")) {
                    this.searchValue = Number(itemStr.replace("!=", ""));
                    this.searchType = (x) => x != this.searchValue;
                }
                else {
                    this.searchValue = Number(itemStr.replace("=", ""));
                    this.searchType = (x) => x == this.searchValue;
                }
            }
        }
    }

    toString() {
        return this.__raw;
    }

    apply(unit: any) {
        if (this.searchFunction) {
            return this.searchFunction(unit);
        }
        else if (this.searchType && this.propName) {
            const foundProps = this.digFunction(unit);
            const res = foundProps?.some(x => this.searchType && this.searchType(x))
            // console.log(`searching ${foundProps} : ${this.searchValue} : ${this.__raw} : ${res}` )

           return res;
        }
        return true;
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
        let propName = this.maxFilter
        if (this.maxFilter) {;
            const flattenValues = units.flatMap(x => {
                const v = this.digFunction(x);
                // console.log(v);
                return v
            }).map(x => {
                return parseInt(x);
            });
            extremeValue = Math.max(...flattenValues);
        }
        if (this.minFilter) {
            propName = this.minFilter;
            const flattenValues = SearchItem.flatten(units.map(x => this.digFunction(x)));
            extremeValue = Math.min(...flattenValues);
        }
        const out = [];
        // console.log(`extreme: ${extremeValue}`)
        if (propName) {
            if (Array.isArray(extremeValue)) {
                extremeValue = extremeValue[0];
            }
            for (const u of units) {
                const gotProp = this.digFunction(u);
                if (gotProp && gotProp.includes(`${extremeValue}`)) {
                    out.push(u);
                }
            }
        }
        return out;
    }
}

