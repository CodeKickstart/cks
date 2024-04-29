
import { Str } from "../../../defs/types/Str";

import { fnBypassForward } from "../../../misc/interviewBypass";


export const opsClient = () => {
  const fnPreProcess = (
    sidCursor: string
  ): {
    error: Str;
  } => {

    const { error } = fnBypassForward(sidCursor);

    return {
      error,
    };
  };

  const fnPostProcess = (
  ): {
    error: Str;
  } => {
    return { error: null };
  };

  return { fnPreProcess, fnPostProcess };
};
