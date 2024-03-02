import { JsonObjectType } from "../../../shared/defs/types";

export function fnConvertToArray(data: JsonObjectType): JsonObjectType[] {
  // Convert the input object into an array of JsonObjectType
  return Object.values(data).map((value: unknown) => value as JsonObjectType);
}

export function fnGetObjGivenKeyVal(
  obj: JsonObjectType,
  key: string,
  value: number
): JsonObjectType | null {
  // Base case: If the current object has the key with the specified value, return it
  if (obj[key] === value) {
    return obj; // Correct, as obj is of type JsonObjectType
  }

  // Recursive case: If the current object is not the target, search its children
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "object" && v !== null && k !== key) {
      const result = fnGetObjGivenKeyVal(v, key, value);
      if (result !== null) {
        return result;
      }
    }
  }
  return null; // no match found
}

interface FilterResult {
  error: Str;
  filteredObj: JsonObjectType;
}

export function fnFilterByKeyList(
  obj: JsonObjectType,
  keys: string[]
): FilterResult {
  // Check if all keys in the list exist in the object
  const invalidKeys = keys.filter(
    (key) => !Object.prototype.hasOwnProperty.call(obj, key)
  );

  if (invalidKeys.length > 0) {
    return {
      error: `Keys not found in object: ${invalidKeys.join(", ")}`,
      filteredObj: {},
    };
  }

  // Filter out entries that do not match the list of keys
  const filteredObj: JsonObjectType = {};
  for (const key of keys) {
    filteredObj[key] = obj[key];
  }

  return {
    error: null,
    filteredObj,
  };
}
