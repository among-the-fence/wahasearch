import { collectSelectionEntries, deepClone, ensureArray } from "@/lib/util";
import { Cost } from "./cost";
import { indexedCharacteristic } from "./indexedCharacteristic";

export class IndexedData {
    _raw: Object;
    data: Object;
    profiles: Map<string, indexedCharacteristic>;

    constructor(data: any) {
        this._raw = deepClone(data);
        const d = deepClone(data);
        this.profiles = new Map<string, indexedCharacteristic>();
        this.data = d;
    }
}
