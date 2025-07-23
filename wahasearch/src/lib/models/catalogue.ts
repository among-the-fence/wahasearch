import { deepClone, ensureArray } from "@/lib/util";
import { DataCard } from "./datacard";

export class Catalogue {
    _raw: Object;
    data: Object;
    name: string;

    rules: Map<string, Rule>;
    datacards: Array<DataCard>;
    upgrades: Map<string, Upgrade>;
    detachments: Map<string, Detachment>;

    constructor(data: any) {
        // sometimes we accidentally pass a parent element
        if (Array.isArray(data)) {
            data = data[0];
        }
        if (data.catalogue) {
            data = data.catalogue;
        }
        data = deepClone(data);
        this._raw = deepClone(data);
        this.name = (data['@_name'] ?? "") as string;
        delete data['@_name'];

        this.rules = Rule.extractRules(data['sharedRules'] as Array<any>);
        delete data['sharedRules'];
        this.upgrades = Upgrade.extractUpgrade(data['sharedSelectionEntries'] as Array<any>);
        this.datacards = DataCard.extractDataCards(data['sharedSelectionEntries'] as Array<any>, this.upgrades);
        this.detachments = Detachment.extractDetachment(data['sharedSelectionEntries'] as Array<any>);
        delete data['sharedSelectionEntries'];

        // console.log(Array.from(new Set(this.datacards.map(x => x.factions).flat().filter(Boolean))));

        this.data = data;
    }
}

export class Rule {
    name: string;
    description: string;
    _raw: Object;
    constructor(data: any) {
        this._raw = deepClone(data);
        this.name = (data['@_name'] ?? "") as string;
        this.description = (data['description'] ?? "") as string;
    }

    static extractRules(sharedRules: any) {
        const x = new Map<string, Rule>();
        if (!sharedRules) {
            return x;
        }
        try {
            ensureArray(sharedRules?.rule).forEach((r: any) => {
                x.set(r['@_id'], new Rule(r));
            });
            return x;
        } catch (error) {
            console.error("Error extracting rules:", error);
            return x;
        }
    }
}

export class Upgrade {
    name: string;
    legends: boolean;
    _raw: Object;
    data: Object;
    constructor(data: any) {
        data = deepClone(data);
        this._raw = deepClone(data);
        const n = data['@_name'] ?? "";
        this.legends = n.includes("[Legends]");
        this.name = n.replace("[Legends]", "").trim();
        delete data['@_name'];
        this.data = data;
    }

    static extractUpgrade(sharedSelectionEntries: any) {
        const x = new Map<string, Upgrade>();
        if (!sharedSelectionEntries) {
            return x;
        }
        try {
            ensureArray(sharedSelectionEntries?.selectionEntry)
                .filter((dc: any) => dc['@_type']?.includes("upgrade"))
                .forEach((dc: any) => {
                    x.set(dc['@_id'], new Upgrade(deepClone(dc)));
                });
            return x;
        } catch (error) {
            console.error("Error extracting upgrades:", sharedSelectionEntries, error);
            return x;
        }
    }
}

export class Detachment {
    name: string;
    legends: boolean;
    _raw: Object;
    data: Object;
    constructor(data: any) {
        this._raw = deepClone(data);
        const n = data['@_name'] ?? "";
        this.legends = n.includes("[Legends]");
        this.name = n.replace("[Legends]", "").trim();
        delete data['@_name'];
        this.data = data;
    }

    static extractDetachment(sharedSelectionEntries: any) {
        const x = new Map<string, Detachment>();
        if (!sharedSelectionEntries) {
            return x;
        }
        try {
            ensureArray(sharedSelectionEntries?.selectionEntry)
                .filter((dc: any) => dc['@_type']?.includes("upgrade") && dc['@_name']?.includes("Detachment"))
                .forEach((dc: any) => {
                    x.set(dc['@_id'], new Detachment(deepClone(dc)));
                });
            return x;
        } catch (error) {
            console.error("Error extracting detachments:", sharedSelectionEntries, error);
            return x;
        }
    }
}
