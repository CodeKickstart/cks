import { JsonObjectType } from "../../../../shared/defs/types";
import { FnNodeProcessor } from "./FnNodeProcessor";

export const fnPrintNode: FnNodeProcessor<null> = (
  _queryFragment: JsonObjectType,
  key: string,
  value: JsonObjectType,
  indent: number = 0
) => {
  const spacing = "  ".repeat(indent);
  console.log(`${spacing}${key}: ${JSON.stringify(value)}`);
  return { error: null };
};
