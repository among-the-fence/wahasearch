import { FILTERS_KEYWORDS, FILTERS_LEGENDS, LEGENDS_NONE } from "../constants";

export class SearchFormData {
    formData: Map<string, string>;
    processedKeywords: string[];

    constructor(formData: Map<string, string>) {
        console.log("Initializing SearchFormData with:", formData);
        this.formData = formData;
        this.processedKeywords = this.formData.get(FILTERS_KEYWORDS)?.toLowerCase().split(',').map(s => s.trim()).filter(Boolean).filter(s => s.length > 0) || [];
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