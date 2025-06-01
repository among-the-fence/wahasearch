import { describe, it, expect } from 'vitest';
import { Profile } from '../models/profile';
import singleProfle from './resources/singleProfile.json'

describe('profile', () => {
    it('constructs', () => {
        const x = new Profile(singleProfle);
        expect(x).not.toBeNull();
        expect(x.characteristics.size).toBe(6);
    })
})