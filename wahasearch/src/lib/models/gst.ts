import { XMLParser } from "fast-xml-parser";
import { ensureArray } from "../util";

// Define interfaces for Warhammer 40K game system
export class GameSystem {
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
        this.id = data["@_id"];
        this.name = data["@_name"];
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
            id: data["@_id"],
            name: data["@_name"],
            description: data.description || "",
        };
    }

    private mapCostType(data: any): CostType {
        return {
            id: data["@_id"],
            name: data["@_name"],
        };
    }
    private mapProfile(data: any): ProfileType {
        if (!data) { return { id: "", name: "", type: "", characteristics: [] }; }
        return {
            id: data["@_id"],
            name: data["@_name"],
            type: data["@_type"],
            characteristics: ensureArray(data.characteristicTypes?.characteristicType)?.map(c => this.mapCharacteristic(c)) || [],
        };
    }

    private mapCharacteristic(data: any): Characteristic {
        if (!data) { return { name: "", value: "" }; }
        return {
            name: data["@_name"],
            value: data["@_value"],
        };
    }

    private mapCategoryEntry(data: any): CategoryEntry {
        if (!data) { return { id: "", name: "", hidden: false }; }
        return {
            id: data["@_id"],
            name: data["@_name"],
            hidden: data["@_hidden"] === "true",
        };
    }
}

export interface ProfileType {
    id: string;
    name: string;
    type: string;
    characteristics: Characteristic[];
}

export interface Characteristic {
    name: string;
    value: string;
}

export interface CategoryEntry {
    id: string;
    name: string;
    hidden: boolean;
}

export interface Rule {
    id: string;
    name: string;
    description: string;
}

export interface CostType {
    id: string;
    name: string;
}