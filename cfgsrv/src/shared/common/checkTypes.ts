export function isInteger(num: number): boolean {
  return Number.isInteger(num);
}

export function isFloat(num: number): boolean {
  return !Number.isInteger(num);
}

export function isString(str: string): boolean {
  return typeof str === "string";
}

export function isBoolean(bool: boolean): boolean {
  return typeof bool === "boolean";
}

export function isArrayOfStrings(arr: string[]) {
  return arr.every((item) => typeof item === "string");
}

export function isArrayOfIntegers(arr: number[]) {
  return arr.every(
    (item) => typeof item === "number" && Number.isInteger(item)
  );
}
