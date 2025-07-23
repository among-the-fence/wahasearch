import { describe, it, expect } from 'vitest';
import { ensureArray } from '@/lib/util';

describe('ensureArray', () => {
  it('returns an empty array when given null', () => {
    expect(ensureArray(null)).toEqual([]);
  });

  it('returns an array containing the object when given a single object', () => {
    expect(ensureArray({ a: 1 })).toEqual([{ a: 1 }]);
  });

  it('returns an empty array when given an empty array', () => {
    expect(ensureArray([])).toEqual([]);
  });

  it('returns the same array when given a filled array', () => {
    expect(ensureArray([1, 2, 3])).toEqual([1, 2, 3]);
  });
});
