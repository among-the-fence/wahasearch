import { FILTERS_KEYWORDS, FILTERS_TOUGHNESS, KOTC_DATASHEETS } from "../constants";

export class SearchFormData {
    formData: Map<string, string>;
    processedKeywords: string[];
    processedToughness: string[];

    constructor(formData: Map<string, string>) {
        // console.log("Initializing SearchFormData with:", formData);
        this.formData = formData;
        this.processedKeywords = this.formData.get(FILTERS_KEYWORDS)?.toLowerCase().split(',').map(s => s.trim()).filter(Boolean).filter(s => s.length > 0) || [];
        this.processedToughness = this.formData.get(FILTERS_TOUGHNESS)?.toLowerCase().split(',').map(s => s.trim()).filter(Boolean).filter(s => s.length > 0) || [];
        if (this.formData.get(KOTC_DATASHEETS) == "true") {
            this.processedKeywords.push("!epic hero");
            this.processedToughness.push("<10");
        }
        console.log(this);
    }

    clear() {
        this.formData.clear();
    }

    set(key: string, value: string) {
        this.formData.set(key, value);
    }

    get(key: string) {
        return this.formData.get(key);
    }

    delete(key: string) {
        this.formData.delete(key);
    }

    keywords(): string[] {
        return this.processedKeywords;
    }

}

export const formData = new SearchFormData(new Map<string, string>());