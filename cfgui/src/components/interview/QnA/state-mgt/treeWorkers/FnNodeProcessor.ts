import { JsonObjectType } from "../../../../../shared/defs/types";
import { Str } from "../../defs/types/Str";

export type FnNodeProcessor<W> = (
  queryFragment: JsonObjectType,
  key: string,
  value: JsonObjectType,
  indent?: number
) => { error: Str; returnObj: W };
