import { describe, expect, it } from 'vitest';
import eldarSimple from '@/lib/models/__test__/resources/eldarSimple.json';
import { DataCard } from '../datacard';
import { IndexedData } from '../indexedData';
import * as constants from '@/lib/constants';
import { SearchFormData } from '../searchFormData';
import { CURRENT_DATASHEETS, FILTERS_KEYWORDS, LEGENDS_DATASHEETS } from '@/lib/constants';

describe('IndexedData', () => {
    it('should create a IndexedData instance from a DataCard', () => {
        const dc = new DataCard(eldarSimple)
        const indexed = new IndexedData(dc);
        const filterMap = new Map<string, string>();
        expect(indexed).toBeInstanceOf(IndexedData);

        filterMap.set(FILTERS_KEYWORDS, 'bullet sponge');
        expect(indexed.matches(new SearchFormData(filterMap))).toBeFalsy();
    });

    it('should be able to filter on keywords regardless of case', () => {
        const dc = new DataCard(eldarSimple)
        const indexed = new IndexedData(dc);
        const filterMap = new Map<string, string>();

        filterMap.set(constants.FILTERS_KEYWORDS, 'epIc hEro');
        expect(indexed.matches(new SearchFormData(filterMap))).toBeTruthy();
    });

    it('should be able to filter on partial keywords', () => {
        const dc = new DataCard(eldarSimple)
        const indexed = new IndexedData(dc);
        const filterMap = new Map<string, string>();

        filterMap.set(constants.FILTERS_KEYWORDS, 'epIc');
        expect(indexed.matches(new SearchFormData(filterMap))).toBeTruthy();
    });

    it('should be able to filter on legends status', () => {
        const dc = new DataCard(eldarSimple)
        const indexed = new IndexedData(dc);
        const filterMap = new Map<string, string>();

        filterMap.set(CURRENT_DATASHEETS, "true");
        expect(indexed.matches(new SearchFormData(filterMap))).toBeTruthy();
        filterMap.set(LEGENDS_DATASHEETS, "true");
        expect(indexed.matches(new SearchFormData(filterMap))).toBeTruthy();
        filterMap.set(CURRENT_DATASHEETS, "false");
        expect(indexed.matches(new SearchFormData(filterMap))).toBeFalsy();
    });
});
