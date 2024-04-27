import { OP_ZSYS } from "../../../../../shared/defs/constants";
import { Str } from "../../../defs/types/Str";

import { fnBypassForward } from "../../../misc/interviewBypass";

const name = OP_ZSYS;
export const opsClient = () => {
  const fnPreProcess = (
    sidCursor: string
  ): {
    error: Str;
  } => {
    // console.log(`opsClient::${name}:pre sidCursor: ${sidCursor}`);

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
