import { OP_OBJ } from "../../../../../shared/defs/constants";
import { Str } from "../../../defs/types/Str";

import { fnBypassUserResponses } from "../../../misc/interviewBypass";

import { fnPostProcessObj } from "./postProcess";

const name = OP_OBJ;
export const opsClient = () => {
  const fnPreProcess = (
    sidCursor: string
  ): {
    error: Str;
  } => {
    console.log(`opsClient::${name}:pre sidCursor: ${sidCursor}`);

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

    const { error } = fnPostProcessObj(sidCursor);

    return { error };
  };

  return { fnPreProcess, fnPostProcess };
};
