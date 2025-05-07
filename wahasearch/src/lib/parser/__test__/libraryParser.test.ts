import { describe, it, expect, vi, beforeEach } from 'vitest';
import LibraryParser from '../libraryParser';
import testJsonContent from "@/lib/data/wh40k-10eAeldari - Aeldari Library.cat.json"

let mockUpdater = vi.fn();
describe('LibraryParser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdater = vi.fn();
  });

  it('should return an empty array if rawJson.catalogues is empty', async () => {
    const parser = new LibraryParser();

    let result = await parser.parseLibrary(mockUpdater, []);
    expect(result).toEqual([]);

    result = await parser.parseLibrary(mockUpdater, null);
    expect(result).toEqual([]);
  });

  it('should call messageUpdater and process catalogues', async () => {
    const parser = new LibraryParser();

    const result = await parser.parseLibrary(mockUpdater, testJsonContent);

    expect(result.size).toBeGreaterThan(0);
  });

  it('should return the first entry', async () => {
    const parser = new LibraryParser();

    const result = await parser.parseLibrary(mockUpdater, testJsonContent);

    expect(result.entries().next().value).toBe(null);
  });
});
