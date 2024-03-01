import { Str } from "../../../defs/types/Str";

export const fnPostProcessObj = (sid: string): { error: Str } => {
  console.log(`fnPostProcess: sid: ${sid}`);

  return { error: null };
};
