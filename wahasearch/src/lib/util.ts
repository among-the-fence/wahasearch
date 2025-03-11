
export function ensureArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}


export function stringifywithoutraw(obj: any) {
    return JSON.stringify(obj, (key, value) => {
      if (key === '_raw') {
        return undefined;
      }
      return value;
    });
  }
