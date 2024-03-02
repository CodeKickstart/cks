import {
  KEY_DEFVAL,
  KEY_VAL,
  OP_LITERAL,
} from "../../../../../shared/defs/constants";
import { Str } from "../../../defs/types/Str";

import { fnBypassUserResponses } from "../../../misc/interviewBypass";
import {
  fnGetQueryAttribute,
  fnSetQueryAttribute,
} from "../../../state-mgt/dataAccess/loLevelAccess";

const name = OP_LITERAL;
export const opsClient = () => {
  const fnPreProcess = (
    sidCursor: string
  ): {
    error: Str;
    nextSidCursor: Str;
  } => {
    console.log(`opsClient::${name}:pre sidCursor: ${sidCursor}`);
    const { error: errorDefval, value: defval } = fnGetQueryAttribute(
      sidCursor,
      KEY_DEFVAL
    );
    if (errorDefval) {
      return { error: errorDefval, nextSidCursor: null };
    }

    if (defval !== undefined) {
      const error = `fnPreProcess: defval is not undefined in {name} with sidCursor: ${sidCursor}`;
      return { error, nextSidCursor: null };
    }

    const { error: errorSetValue } = fnSetQueryAttribute(
      sidCursor,
      KEY_VAL,
      defval
    );
    if (errorSetValue) {
      return { error: errorSetValue, nextSidCursor: null };
    }

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
    return { error: null, nextSidCursor: null };
  };

  return { fnPreProcess, fnPostProcess };
};
