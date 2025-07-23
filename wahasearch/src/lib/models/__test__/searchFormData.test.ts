import { describe, expect, it } from 'vitest';
import { SearchFormData } from '../searchFormData';
import { CURRENT_DATASHEETS, FILTERS_KEYWORDS, LEGENDS_DATASHEETS } from '@/lib/constants';


describe('SearchFormData', () => {
    it('should create a SearchFormData instance', () => {
        const card = new SearchFormData(new Map<string, string>());
        expect(card).toBeInstanceOf(SearchFormData);
    });

    it('should process keywords', () => {
        const requestMap = new Map<string, string>();
        requestMap.set(FILTERS_KEYWORDS, "ork");

        const card = new SearchFormData(requestMap);
        expect(card).toBeInstanceOf(SearchFormData);
        expect(card.keywords()).toEqual(["ork"]);
    });

    describe('handling current and legends datasheets', () => {
        it('should default to current datasheets', () => {
            const requestMap = new Map<string, string>();

            const card = new SearchFormData(requestMap);
            expect(card).toBeInstanceOf(SearchFormData);
            expect(card.includeCurrent).toBeTruthy();
        });

        it('should include legends datasheets when requested', () => {
            const requestMap = new Map<string, string>();
            requestMap.set(LEGENDS_DATASHEETS, "true");

            const card = new SearchFormData(requestMap);
            expect(card).toBeInstanceOf(SearchFormData);
            expect(card.includeLegends).toBeTruthy();
            expect(card.includeCurrent).toBeTruthy();
        });

        it('should exclude legends datasheets when requested', () => {
            const requestMap = new Map<string, string>();
            requestMap.set(LEGENDS_DATASHEETS, "false");

            const card = new SearchFormData(requestMap);
            expect(card).toBeInstanceOf(SearchFormData);
            expect(card.includeLegends).toBeFalsy();
            expect(card.includeCurrent).toBeTruthy();
        });

        it('should exclude current datasheets when requested', () => {
            const requestMap = new Map<string, string>();
            requestMap.set(LEGENDS_DATASHEETS, "true");
            requestMap.set(CURRENT_DATASHEETS, "false");

            const card = new SearchFormData(requestMap);
            expect(card).toBeInstanceOf(SearchFormData);
            expect(card.includeLegends).toBeTruthy();
            expect(card.includeCurrent).toBeFalsy();
        });
    });
});
