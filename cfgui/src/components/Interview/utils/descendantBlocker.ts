import { Str } from "../defs/types/Str";

export const fnBlockUnselectedChildren = (
  sidCursor: string,
  answer: number[] | number
): { error: Str } => {
  console.log(`Blocking unselected children for sidCursor: ${sidCursor}`);
  console.log(`Selected children: ${answer}`);

  return { error: null };
};
