import { JsonObjectType } from "../../../../shared/defs/types";
import { Str } from "../../defs/types/Str";

import { FnNodeProcessor } from "./FnNodeProcessor";

export const fnGatherOrderSequences: FnNodeProcessor<string[] | null> = (
  _queryFragment: JsonObjectType,
  _key: string,
  value: JsonObjectType | null
): { error: Str; returnObj: string[] | null } => {
  if (value === null || !Array.isArray(value)) {
    return { error: "Value is null or not an array", returnObj: null };
  }
  const transformed: string[] = Object.values(value) as string[];
  return { error: null, returnObj: transformed };
};
