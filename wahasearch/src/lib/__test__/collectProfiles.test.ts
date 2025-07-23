import { describe, it, expect } from 'vitest';
import { collectSelectionProfiles } from '../collectProfiles';
import eldarSimple from '@/lib/__test__/resources/eldarSimple.json';
import eldarNested from '@/lib/__test__/resources/eldarNested.json';

describe('collectSelectionProfiles', () => {
  describe('base cases', () => {
    it('should return an empty array for undefined input', () => {
      expect(collectSelectionProfiles(undefined, new Map<string, any>())).toEqual([]);
    });
    it('should return an empty array for null input', () => {
      expect(collectSelectionProfiles(null, new Map<string, any>())).toEqual([]);
    });
    it('should return an empty array for empty object', () => {
      expect(collectSelectionProfiles({}, new Map<string, any>())).toEqual([]);
    });
    it('should return an empty array for non-empty object without any profiles', () => {
      expect(collectSelectionProfiles({ foo: 'bar' }, new Map<string, any>())).toEqual([]);
    });
  });

  describe('with simple valid input', () => {
    describe('when there is a single profile', () => {
      it('should return an array containing that profile', () => {
        const r = collectSelectionProfiles({ profile: { '@_name': 'foo' } }, new Map<string, any>());
        expect(r.length).toBe(1);
        expect(r[0].name).toEqual("foo");
      });
    });

    describe('when given a real profile', () => {
      it('should extract profiles with movement, wounds, toughness, oc, and save', () => {
        const res = collectSelectionProfiles(eldarSimple, new Map<string, any>());
        expect(res.length).toBeGreaterThan(0);

        const found = res.find(profile => {
          const characteristicNames = Array.from(profile.characteristics.keys());
          return (
            characteristicNames.includes('M') &&
            characteristicNames.includes('W') &&
            characteristicNames.includes('T') &&
            characteristicNames.includes('OC') &&
            characteristicNames.includes('SV')
          );
        });
        expect(found).toBeTruthy();
      });

      it('should extract profiles with range, strength, ap, and damage', () => {
        const res = collectSelectionProfiles(eldarSimple, new Map<string, any>());
        expect(res.length).toBeGreaterThan(0);

        const found = res.filter(profile => {
          const characteristicNames = Array.from(profile.characteristics.keys());
          return (
            characteristicNames.includes('Range') &&
            characteristicNames.includes('S') &&
            characteristicNames.includes('AP') &&
            characteristicNames.includes('D')
          );
        });

        expect(found.length).toBeGreaterThan(0);
      });

    });
  });

  describe('with nested valid input', () => {
    it('should extract profiles from nested data', () => {
      const res = collectSelectionProfiles(eldarNested, new Map<string, any>());
      console.log(res);
      const found = res.filter(profile => {
        const characteristicNames = Array.from(profile.characteristics.keys());
        return (
          characteristicNames.includes('M') &&
          characteristicNames.includes('W') &&
          characteristicNames.includes('T') &&
          characteristicNames.includes('OC') &&
          characteristicNames.includes('SV')
        );
      });
      expect(found.length).toBeGreaterThan(0);
    });
  });
});
