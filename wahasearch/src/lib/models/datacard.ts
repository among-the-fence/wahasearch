import { deepClone, ensureArray } from "@/lib/util";
import { Cost } from "./cost";

export class DataCard {
    name: string;
    legends: boolean;
    _raw: Object;
    data: Object;
    costs: Array<Cost>;
    constructor(data: any) {
        this._raw = deepClone(data);
        const d = deepClone(data);
        const n = d['@_name'] ?? "";
        this.legends = n.includes("[Legends]");
        this.name = n.replace("[Legends]", "").trim();
        delete d['@_name'];
        this.costs = Cost.extractCosts(d['costs']);
        this.costs.push(...Cost.extractAdditionalCosts(d['modifierGroups']));
        delete d['costs'];
        this.data = d;
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