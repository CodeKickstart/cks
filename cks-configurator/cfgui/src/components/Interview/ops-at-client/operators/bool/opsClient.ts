import { OP_BOOL } from "../../../../../shared/defs/constants";
import { Str } from "../../../defs/types/Str";

import { fnBypassForward } from "../../../misc/interviewBypass";

const name = OP_BOOL;
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
    sidCursor: string
  ): {
    error: Str;
  } => {
    console.log(`opsClient::${name}:post sidCursor: ${sidCursor}`);
    return { error: null };
  };

  return { fnPreProcess, fnPostProcess };
};
