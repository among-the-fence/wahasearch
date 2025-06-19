import { cleanName, deepClone, ensureArray } from "@/lib/util";
import { Cost } from "./cost";
import { collectSelectionProfiles } from "../collectProfiles";
import { Profile } from "./profile";
import { IndexedData } from "./indexedData";

export class DataCard {
    _raw: Object;
    data: Object;
    name: string;
    uniqueKey: string;
    legends: boolean;
    factions: Array<String>;
    keywords: Array<String>;
    costs: Array<Cost>;
    profiles: Array<Profile>;
    costString: String;

    index: IndexedData;

    constructor(data: any) {
        this._raw = deepClone(data);
        const d = deepClone(data);
        const n = d['@_name'] ?? "";
        this.uniqueKey = n + d['@_id'];
        delete d['@_id'];
        this.legends = n.includes("[Legends]");
        this.costs = Cost.extractCosts(d['costs']);
        this.name = n.replace("[Legends]", "").trim();
        delete d['@_name'];
        this.costs.push(...Cost.extractFromModifiers(d['modifierGroups']));
        delete d['costs'];
        this.factions = [];
        this.keywords = [];
        ensureArray(d.categoryLinks?.categoryLink).forEach((value: any) => {
            try {
                if (!value) {
                    // console.error("THIS SHIT SHOULDN:T BE", value);
                    return;
                }
                const name = value['@_name'];
                if (!name) {
                    console.error("TE FUCK", value);
                    return;
                }
                if (name.includes('Faction:'))
                    this.factions.push(name.replace("Faction:", ""));
                else {
                    this.keywords.push(name);
                }
            }
            catch {
                console.error();
            }
        });
        ensureArray(d.infolinks?.infoLink).forEach((value: any) => {
            try {
                if (!value) {
                    // console.error("THIS SHIT SHOULDN:T BE", value);
                    return;
                }
                const name = value['@_name'];
                if (!name) {
                    console.error("TE FUCK", value);
                    return;
                }
                if (name.includes('Faction:'))
                    this.factions.push(name.replace("Faction:", ""));
                else {
                    this.keywords.push(name);
                }
            }
            catch {
                console.error();
            }
        });

        this.costString = this.costs.map((c) => c.value).sort((a, b) => a - b).join(', ');

        this.data = d;

        this.profiles = collectSelectionProfiles(d);
        this.index = new IndexedData(this);
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
            return cardList.sort(DataCard.datacardCompare);
        } catch (error) {
            console.error("Error extracting data cards:", sharedSelectionEntries, error);
            return [];
        }
    }

    static datacardCompare = (a: DataCard, b: DataCard) => a.index.sortingName.localeCompare(b.index.sortingName)
    static datacardCompareLegends = (a: DataCard, b: DataCard) => (a.legends ? 1 : 0) - (b.legends ? 1 : 0) || a.name.localeCompare(b.name);
}
