import { JsonObjectType } from "../../../../../shared/defs/types";
import { FnNodeProcessor } from "./FnNodeProcessor";

export const fnRetrieveQueryFragment: FnNodeProcessor<JsonObjectType> = (
  queryFragment: JsonObjectType
) => {
  return { error: null, returnObj: queryFragment };
};

export const fnUpsertQueryFragment: FnNodeProcessor<JsonObjectType> = (
  queryFragment: JsonObjectType,
  _key: string,
  _value: JsonObjectType,
  _indent?: number, // Add optional parameter
  updateInfo?: unknown
) => {
  // console.log("fnUpsertQueryFragment: updateInfo", updateInfo);
  console.log("fnUpsertQueryFragment: queryFragment", queryFragment);
  const castedUpdateInfo = updateInfo as { [key: string]: string[] };
  if (castedUpdateInfo) {
    const key = Object.keys(castedUpdateInfo)[0]; // Get the first key
    const value = castedUpdateInfo[key];
    if (
      !queryFragment ||
      typeof queryFragment !== "object" ||
      Array.isArray(queryFragment)
    ) {
      return { error: "queryFragment is null" };
    }
    queryFragment[key] = value;
  }
  return { error: null };
};
