import { describe, expect, it } from 'vitest';
import { Catalogue } from '@/lib/models/catalogue';
import eldarSimple from '@/lib/models/__test__/resources/eldarSimple.json';
import { DataCard } from '../datacard';
import { Cost } from '../cost';
import { IndexedData } from '../indexedData';

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

        filterMap.set('keywords', 'epIc hEro');
        expect(indexed.matches(filterMap)).toBeTruthy();
    });

    it('should be able to filter on partial keywords', () => {
        const dc = new DataCard(eldarSimple)
        const indexed = new IndexedData(dc);
        const filterMap = new Map<String, String>();

        filterMap.set('keywords', 'epIc');
        expect(indexed.matches(filterMap)).toBeTruthy();
    });
});
