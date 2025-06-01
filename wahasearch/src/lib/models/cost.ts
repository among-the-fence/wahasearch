import { deepClone, ensureArray } from "@/lib/util";

const COST_TYPE_ID = "51b2-306e-1021-d207";

export class Cost {
    name: string;
    value: number;
    _raw: Object;
    data: Object;
    constructor(data: any) {
        this._raw = deepClone(data);
        this.name = data['@_name'] ?? "";
        delete data['@_name'];
        this.value = parseInt(data['@_value'] ?? "0");
        delete data['@_value'];
        this.data = data;
    }

    static extractCosts(costs: any) {
        if (!costs) {
            return [];
        }
        try {
            const pointlist: Cost[] = [];
            ensureArray(costs?.cost).filter((c: any) => c['@_name']?.includes("pts"))
                .forEach((c: any) => {
                    pointlist.push(new Cost(c));
                });
            return pointlist;
        } catch (error) {
            console.error("Error extracting costs:", costs, error);
            return [];
        }
    }

    static extractFromModifiers(modifierGroups: any) {
        if (!modifierGroups) {
            return [];
        }
        try {
            const pointlist: Cost[] = [];
            ensureArray(modifierGroups?.modifierGroup?.modifiers?.modifier)
                .filter((c: any) => c && Object.keys(c).includes("@_field") && c['@_field']?.includes(COST_TYPE_ID))
                .forEach((c: any) => {
                    pointlist.push(new Cost(c));
                });
            return pointlist;
        } catch (error) {
            console.error("Error extracting costs:", modifierGroups, error);
            return [];
        }
    }
}