import {
  KEY_OVERRIDE,
  KEY_VAL,
  KEY_BLOCKED,
} from "../../../../../shared/defs/constants";
import { Str } from "../../defs/types/Str";
// import { valtioStore } from "../../defs/types/ValtioTypes";
import {
  fnGetQueryAttribute,
  fnGetQueryAttributeBoolean,
  fnSetQueryAttribute,
} from "../dataAccess/loLevelAccess";

export const fnShouldSkipQuestion = (
  sidCursor: string,
  rehersalRound: boolean = false
): { error: Str; skipQuestion: boolean | null } => {
  console.log(`fnShouldSkipQuestion: rehersalRound: ${rehersalRound}`);
  const { error: errorOverride, value: override } = fnGetQueryAttribute(
    sidCursor,
    KEY_OVERRIDE
  );

  if (errorOverride) {
    return { error: errorOverride, skipQuestion: null };
  }

  // a good side effect that is idempotent
  if (override) {
    fnSetQueryAttribute(sidCursor, KEY_VAL, override);
  }

  const { error: errorBlocked, value: blocked } = fnGetQueryAttributeBoolean(
    sidCursor,
    KEY_BLOCKED
  );
  if (errorBlocked) {
    return { error: errorBlocked, skipQuestion: null };
  }

  if (override && !blocked) {
    return { error: null, skipQuestion: true };
  }
  return { error: null, skipQuestion: false };
};
