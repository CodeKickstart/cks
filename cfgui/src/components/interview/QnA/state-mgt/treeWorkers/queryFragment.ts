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
  console.log("fnUpsertQueryFragment: updateInfo", updateInfo);
  console.log("fnUpsertQueryFragment: queryFragment", queryFragment);
  return { error: null };
};
