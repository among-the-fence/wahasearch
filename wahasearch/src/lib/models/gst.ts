import { XMLParser } from "fast-xml-parser";
import { ensureArray } from "../util";
import { Base, Named, mapBase, mapName } from './baseModels';

// Define interfaces for Warhammer 40K game system
export class GameSystem implements Named {
    _raw: any;
    id: string;
    name: string;
    revision: number;
    profileTypes: ProfileType[];
    categories: CategoryEntry[];
    rules: Map<string, Rule>;
    costTypes: CostType[];

    constructor(gstContent: string, parser: XMLParser) {

        const jsonObj = parser.parse(gstContent);
        this.id = "";
        this.name = "";
        this.revision = 10;
        this.profileTypes = [];
        this.categories = [];
        this.rules = new Map<string, Rule>();
        this.costTypes = [];
        
        this.mapGameSystem(jsonObj.gameSystem);
    }

    private mapGameSystem(data: any): void {
        const namedInterface = mapName(data);
        this._raw = namedInterface._raw;
        this.id = namedInterface.id;
        this.name = namedInterface.name;
        this.revision = parseInt(data["@_revision"], 4);
        this.profileTypes = data.profileTypes?.profileType?.map((p: any) => this.mapProfile(p)) || [];
        this.categories = data.categoryEntries?.categoryEntry?.map((c: any) => this.mapCategoryEntry(c)) || [];
        data.sharedRules?.rule.forEach((r: any) => {
            const x = this.mapRule(r); 
            if (x) {
                this.rules.set(x.id, x); 
            }
        });
        
        this.costTypes = data.costTypes?.costType?.map((c: any) => this.mapCostType(c)) || [];
    }

    private mapRule(data: any): Rule {
        return {
            ...mapBase(data),
            ...mapName(data),
            description: data.description || "",
        };
    }

    private mapCostType(data: any): CostType {
        return {
            ...mapBase(data),
            ...mapName(data),
        };
    }
    private mapProfile(data: any): ProfileType {
        if (!data) { return { id: "", name: "", type: "", characteristics: [], typeId: "", typeName: "", _raw: null }; }
        return {
            ...mapBase(data),
            ...mapName(data),
            characteristics: ensureArray(data.characteristicTypes?.characteristicType)?.map(c => this.mapCharacteristic(c)) || [],
        };
    }

    private mapCharacteristic(data: any): Characteristic {
        if (!data) { return { id: "", name: "", type: "", typeId: "", typeName: "", _raw: null, value: "" }; }
        return {
            ...mapBase(data),
            ...mapName(data),
            value: data["@_value"],
        };
    }

    private mapCategoryEntry(data: any): CategoryEntry {
        if (!data) { return { id: "", name: "", hidden: false, typeId: "", typeName: "", type: "", _raw: null }; }
        return {
            ...mapBase(data),
            ...mapName(data),
            hidden: data["@_hidden"] === "true",
        };
    }
}

export interface ProfileType extends Base, Named {
    characteristics: Characteristic[];
}

export interface Characteristic extends Base, Named {
    value: string;
}

export interface CategoryEntry extends Base, Named {
    hidden: boolean;
}

export interface Rule extends Base, Named {
    description: string;
}

export interface CostType extends Base, Named {
}