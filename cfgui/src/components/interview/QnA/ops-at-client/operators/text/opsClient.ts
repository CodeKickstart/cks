import { OP_TEXT } from "../../../../../../shared/defs/constants";
import { Str } from "../../../defs/types/Str";

import { fnBypassUserResponses } from "../../../misc/interviewBypass";

const name = OP_TEXT;
export const opsClient = () => {
  const fnPreProcess = (
    sidCursor: string
  ): {
    error: Str;
    nextSidCursor: Str;
  } => {
    console.log(`opsClient::${name}:pre sidCursor: ${sidCursor}`);

    const { error, nextSidCursor } = fnBypassUserResponses(sidCursor);

    return {
      error,
      nextSidCursor,
    };
  };

  const fnPostProcess = (
    sidCursor: string
  ): {
    error: Str;
    nextSidCursor: Str;
  } => {
    console.log(`opsClient::${name}:post sidCursor: ${sidCursor}`);
    return { error: null, nextSidCursor: null }; // Provide a default value for queryObject if necessary
  };

  return { fnPreProcess, fnPostProcess };
};
