import { describe, expect, it } from 'vitest';
import orkboyz from '@/lib/__test__/resources/orkboyz.json';
import { DataCard } from '../datacard';


describe('Datacard', () => {
    it('should create a Datacard instance', () => {
        const card = new DataCard({});
        expect(card).toBeInstanceOf(DataCard);
    });

    describe('should get weapon profiles for', () => {
        it('ork boyz', () => {
            const boyz = new DataCard(orkboyz);
            expect(boyz).toBeInstanceOf(DataCard);
            console.log(boyz);
        });
    });
});
