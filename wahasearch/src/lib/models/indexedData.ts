import { cleanName } from "@/lib/util";
import { DataCard } from "./datacard";

export class IndexedData {
    sortingName: string;
    names: string[];
    keywords: string[];
    factions: string[];

    constructor(data: DataCard) {
        this.names = [];
        this.sortingName = cleanName(data.name);
        this.names.push(data.name.toLowerCase());
        this.names.push(this.sortingName.toLowerCase());
        this.keywords = data.keywords.map(x => x.toLowerCase());
        this.factions = data.factions.map(x => x.toLowerCase());
    }

    matches(filters: Map<String, String>): boolean {
        const keywordFilter = filters.get("keywords")?.toLowerCase() || "";
        if (keywordFilter.length > 0 && !this.keywords.some(x => x.includes(keywordFilter)))
            return false;
        return true;
    }
}
