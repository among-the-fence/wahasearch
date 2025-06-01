import { collectSelectionEntries, deepClone, ensureArray } from "@/lib/util";
import { Cost } from "./cost";
import { IndexedData } from "./indexedData";
import { collectSelectionProfiles } from "../collectProfiles";

export class DataCard {
    _raw: Object;
    data: Object;
    name: string;
    legends: boolean;
    costs: Array<Cost>;
    profiles: Array<any>;

    constructor(data: any) {
        this._raw = deepClone(data);
        const d = deepClone(data);
        const n = d['@_name'] ?? "";
        this.legends = n.includes("[Legends]");
        this.costs = Cost.extractCosts(d['costs']);
        this.name = n.replace("[Legends]", "").trim();
        delete d['@_name'];
        this.costs.push(...Cost.extractFromModifiers(d['modifierGroups']));
        delete d['costs'];
        this.data = d;
        this.profiles = collectSelectionProfiles(d);
    }

    static extractDataCards(sharedSelectionEntries: any) {
        if (!sharedSelectionEntries) {
            return [];
        }
        try {
            const cardList: DataCard[] = [];
            ensureArray(sharedSelectionEntries?.selectionEntry)
                .filter((dc: any) => !dc['@_type']?.includes("upgrade"))
                .forEach((dc: any) => {
                    cardList.push(new DataCard(dc));
                });
            return cardList.sort((a, b) => (a.legends ? 1 : 0) - (b.legends ? 1 : 0) || a.name.localeCompare(b.name));
        } catch (error) {
            console.error("Error extracting data cards:", sharedSelectionEntries, error);
            return [];
        }
    }
}
