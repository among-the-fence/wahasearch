
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


export function deepClone<T>(obj: T): T {
  return typeof structuredClone === 'function' ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));
}

export function cleanName2(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function cleanName1(name: string): string {
  return name
    .replace('‘', '')
    .replace("'", '').toLowerCase();
}