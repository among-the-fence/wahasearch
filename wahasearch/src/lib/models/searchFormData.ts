import { FILTERS_LEGENDS, LEGENDS_NONE } from "../constants";

export class SearchFormData {
    formData: Map<string, string>;

    constructor(formData: Map<string, string>) {
        this.formData = formData;
        this.formData.set(FILTERS_LEGENDS, LEGENDS_NONE);
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
}

export const formData = new SearchFormData(new Map<string, string>());