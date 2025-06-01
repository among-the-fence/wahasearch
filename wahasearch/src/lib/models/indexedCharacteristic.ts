import { collectSelectionEntries, deepClone, ensureArray } from "@/lib/util";

export class indexedCharacteristic {
    _raw: Object;
    data: Object;
    values: Set<any>;

    constructor(data: any) {
        this._raw = deepClone(data);
        const d = deepClone(data);
        this.values = new Set<any>();

        this.data = d;
    }

    push(value: any) {
        this.values.add(value);
    }


}
