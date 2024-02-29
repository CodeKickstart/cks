import { JsonObjectType } from "../../../../../shared/defs/types";
import { FnNodeProcessor } from "./FnNodeProcessor";

export const fnRetrieveQueryFragment: FnNodeProcessor<JsonObjectType> = (
  queryFragment: JsonObjectType
) => {
  return { error: null, returnObj: queryFragment };
};

export const fnUpsertQueryFragment: FnNodeProcessor<JsonObjectType> = (
  queryFragment: JsonObjectType,
  updateInfo: JsonObjectType
) => {
  console.log("fnUpsertQueryFragment: updateInfo", updateInfo);
  console.log("fnUpsertQueryFragment: queryFragment", queryFragment);
  return { error: null };
};
