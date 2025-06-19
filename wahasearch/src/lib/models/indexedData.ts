import { cleanName } from "@/lib/util";
import { DataCard } from "./datacard";
import { FILTERS_KEYWORDS, FILTERS_LEGENDS, LEGENDS_NONE, LEGENDS_ONLY } from "../constants";

export class IndexedData {
    sortingName: string;
    names: string[];
    keywords: string[];
    factions: string[];
    legends: boolean;

    constructor(data: DataCard) {
        this.names = [];
        this.sortingName = cleanName(data.name);
        this.names.push(data.name.toLowerCase());
        this.names.push(this.sortingName.toLowerCase());
        this.keywords = data.keywords.map(x => x.toLowerCase());
        this.factions = data.factions.map(x => x.toLowerCase());
        this.legends = data.legends;
    }

    matches(filters: Map<String, String>): boolean {
        // console.log(filters);
        const keywordFilter = filters.get(FILTERS_KEYWORDS)?.toLowerCase() || "";
        if (keywordFilter.length > 0 && !this.keywords.some(x => x.includes(keywordFilter)))
            return false;
        if (filters.get(FILTERS_LEGENDS) == LEGENDS_ONLY && !this.legends)
            return false;
        if (filters.get(FILTERS_LEGENDS) == LEGENDS_NONE && this.legends)
            return false;
        return true;
    }
}
