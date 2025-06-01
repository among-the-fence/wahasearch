import { deepClone, ensureArray } from "@/lib/util";

export class Profile {
    _raw: Object;
    data: Object;
    name: string;
    characteristics: Map<string, any>;

    constructor(data: any) {
        this._raw = deepClone(data);
        const d = deepClone(data);
        this.name = d['@_name'] ?? "";
        delete d['@_name'];
        this.characteristics = new Map<string, any>();
        try{
            ensureArray(d.characteristics?.characteristic).forEach((c:any) => {
                this.characteristics.set(c['@_name'], c)
            })
        } catch (e){
            console.log(data);
        }
        this.data = d;
    }

    static extractProfile(x: any) {
    }
}
