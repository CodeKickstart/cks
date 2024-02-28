import { JsonObjectType } from "../../../../../shared/defs/types";
import { FnNodeProcessor } from "./FnNodeProcessor";

export const fnRetrieveQueryFragment: FnNodeProcessor<JsonObjectType> = (
  queryFragment: JsonObjectType
) => {
  return { error: null, returnObj: queryFragment };
};

export const fnUpsertQueryFragment: FnNodeProcessor<JsonObjectType> = (
  queryFragment: JsonObjectType
) => {
  console.log("fnUpsertQueryFragment: ", queryFragment);
  return { error: null };
};
