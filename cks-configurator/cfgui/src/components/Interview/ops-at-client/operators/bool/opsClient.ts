import { OP_BOOL } from "../../../../../shared/defs/constants";
import { Str } from "../../../defs/types/Str";

import { fnBypassUserResponses } from "../../../misc/interviewBypass";

const name = OP_BOOL;
export const opsClient = () => {
  const fnPreProcess = (
    sidCursor: string
  ): {
    error: Str;
  } => {
    // console.log(`opsClient::${name}:pre sidCursor: ${sidCursor}`);

    const { error } = fnBypassUserResponses(sidCursor);

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