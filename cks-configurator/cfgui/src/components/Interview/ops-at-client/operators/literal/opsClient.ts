import {
  KEY_OVERRIDE,
  KEY_VAL,
  OP_LITERAL,
} from "../../../../../shared/defs/constants";
import { Str } from "../../../defs/types/Str";

import { fnBypassForward } from "../../../misc/interviewBypass";
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
  } => {
    console.log(`opsClient::${name}:pre sidCursor: ${sidCursor}`);

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
    const { error: errorOverride, value: override } = fnGetQueryAttribute(
      sidCursor,
      KEY_OVERRIDE
    );
    if (errorOverride) {
      return { error: errorOverride };
    }
    const { error: errorSetValue } = fnSetQueryAttribute(
      sidCursor,
      KEY_VAL,
      override
    );
    if (errorSetValue) {
      return { error: errorSetValue };
    }
    return { error: null };
  };

  return { fnPreProcess, fnPostProcess };
};
