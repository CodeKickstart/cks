import { JsonObjectType } from "../../../shared/defs/types";
import { Str } from "../defs/types/Str";

export const fnBlockUnselectedChildren = (
  queryObject: JsonObjectType,
  answer: number[] | number
): { error: Str } => {
  console.log(`Query object: ${queryObject}`);
  console.log(`Selected children: ${answer}`);

  return { error: null };
};
