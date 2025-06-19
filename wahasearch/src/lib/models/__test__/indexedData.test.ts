import { describe, expect, it } from 'vitest';
import { Catalogue } from '@/lib/models/catalogue';
import eldarSimple from '@/lib/models/__test__/resources/eldarSimple.json';
import { DataCard } from '../datacard';
import { Cost } from '../cost';
import { IndexedData } from '../indexedData';
import { FILTERS_KEYWORDS, FILTERS_LEGENDS, LEGENDS_ALL, LEGENDS_NONE, LEGENDS_ONLY } from '@/lib/constants';

describe('IndexedData', () => {
    it('should create a IndexedData instance from a DataCard', () => {
        const dc = new DataCard(eldarSimple)
        const indexed = new IndexedData(dc);
        const filterMap = new Map<String, String>();
        expect(indexed).toBeInstanceOf(IndexedData);

        filterMap.set('keywords', 'bullet sponge');
        expect(indexed.matches(filterMap)).toBeFalsy();
    });

    it('should be able to filter on keywords regardless of case', () => {
        const dc = new DataCard(eldarSimple)
        const indexed = new IndexedData(dc);
        const filterMap = new Map<String, String>();

        filterMap.set(FILTERS_KEYWORDS, 'epIc hEro');
        expect(indexed.matches(filterMap)).toBeTruthy();
    });

    it('should be able to filter on partial keywords', () => {
        const dc = new DataCard(eldarSimple)
        const indexed = new IndexedData(dc);
        const filterMap = new Map<String, String>();

        filterMap.set(FILTERS_KEYWORDS, 'epIc');
        expect(indexed.matches(filterMap)).toBeTruthy();
    });

    it('should be able to filter on legends status', () => {
        const dc = new DataCard(eldarSimple)
        const indexed = new IndexedData(dc);
        const filterMap = new Map<String, String>();

        filterMap.set(FILTERS_LEGENDS, LEGENDS_ONLY);
        expect(indexed.matches(filterMap)).toBeFalsy();
        filterMap.set(FILTERS_LEGENDS, LEGENDS_ALL);
        expect(indexed.matches(filterMap)).toBeTruthy();
        filterMap.set(FILTERS_LEGENDS, LEGENDS_NONE);
        expect(indexed.matches(filterMap)).toBeTruthy();
    });
});
