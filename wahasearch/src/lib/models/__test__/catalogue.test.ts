import { describe, expect, it } from 'vitest';
import { Catalogue } from '@/lib/models/catalogue';
import debugDataAeldari from '@/lib/data/wh40k-10eAeldari - Aeldari Library.cat.json';
import { DataCard } from '../datacard';
import { Cost } from '../cost';

describe('Catalogue', () => {
    it('should create a Catalogue instance', () => {
        const catalogue = new Catalogue({});
        expect(catalogue).toBeInstanceOf(Catalogue);
    });

    it('should extract name', () => {
        const catalogue = new Catalogue(debugDataAeldari);
        expect(catalogue.name).toBe("Aeldari - Aeldari Library");
    });

    it('should extract rules', () => {
        const catalogue = new Catalogue(debugDataAeldari);
        expect(catalogue.rules).toBeInstanceOf(Map);
        expect(catalogue.rules.size).toBeGreaterThan(0);
    });

    it('should extract upgrades', () => {
        const catalogue = new Catalogue(debugDataAeldari);
        expect(catalogue.upgrades).toBeInstanceOf(Map);
        expect(catalogue.upgrades.size).toBeGreaterThan(0);
    });
    describe('when extracting detachment data', () => {
        it('should extract detachment data', () => {
            const catalogue = new Catalogue(debugDataAeldari);
            expect(catalogue.detachments).toBeInstanceOf(Map);
            expect(catalogue.detachments.size).toBeGreaterThan(0);

            //  TODO: check data
        });
    });


    describe('when extracting datacards', () => {
        it('should extract datacards', () => {
            const catalogue = new Catalogue(debugDataAeldari);
            expect(catalogue.datacards).toBeInstanceOf(Array<DataCard>);
            expect(catalogue.datacards.length).toBeGreaterThan(0);
        });

        it('should collect cost data', () => {
            const catalogue = new Catalogue(debugDataAeldari);
            let card = catalogue.datacards.filter((dc: DataCard) => dc.name === "Troupe")[0];
            expect(card.costs).toBeInstanceOf(Array<Cost>);
            expect(card.costs.length).toBeGreaterThan(1);
            const values = card.costs.map((c: Cost) => c.value);
            const allInB = values.every(element => [85, 100, 190, 205].includes(element));
            expect(allInB).toBe(true);
        });
    });
});
