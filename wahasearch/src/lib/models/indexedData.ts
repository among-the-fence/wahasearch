import { cleanName, deepClone } from "@/lib/util";
import { DataCard } from "./datacard";

export class IndexedData {
    _raw: Object;
    data: Object;
    sortingName: string;
    names: string[];

    constructor(data: DataCard) {
        this._raw = deepClone(data);
        const d = deepClone(data);
        this.names = [];
        this.sortingName = cleanName(data.name);
        this.names.push(data.name);
        this.names.push(this.sortingName);
        this.data = d;
    }
}
