import { JsonObjectType } from "../../../../../shared/defs/types";
import { FnNodeProcessor } from "./FnNodeProcessor";

export const fnRetrieveQueryFragment: FnNodeProcessor<JsonObjectType> = (
  queryFragment: JsonObjectType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ..._: unknown[]
) => {
  // const spacing = "  ".repeat(indent);
  // console.log(
  //   `*fnRetrieveQueryFragment ${spacing}${key}: ${JSON.stringify(value)}`
  // );
  return { error: null, returnObj: queryFragment };
};
