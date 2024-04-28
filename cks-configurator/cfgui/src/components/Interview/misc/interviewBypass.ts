import {
  fnCursorMoveBackward,
  fnCursorMoveForward,
} from "../state-mgt/cursor/cursor";

import { Str } from "../defs/types/Str";
import { fnShouldSkipQuestion } from "./shouldSkipQuestion";
import { fnSplitCursor } from "../state-mgt/dataAccess/hiLevelAccess";

const _fnBypass = (
  sidCursor: string,
  fnCursorMoveForward: () => { cursor: string | null }
): {
  error: Str;
  newSidCursor: Str;
} => {
  const _fnBypassUserResponse = (
    sidCursor: string
  ): {
    error: Str;
    newSidCursor: Str;
  } => {
    const { error: errorSkipQuestion, skipQuestion } =
      fnShouldSkipQuestion(sidCursor);
    if (errorSkipQuestion) {
      return { error: errorSkipQuestion, newSidCursor: null };
    }

    let nextSidCursor = sidCursor;
    if (skipQuestion) {
      const { cursor: newCursor } = fnCursorMoveForward();
      if (newCursor === null) {
        return { error: null, newSidCursor: null };
      }

      const { sidCursor: newSidCursor } = fnSplitCursor(newCursor);
      nextSidCursor = newSidCursor;
    }

    return {
      error: null,
      newSidCursor: nextSidCursor,
    };
  };

  let currentSidCursor: string | null = sidCursor;
  do {
    const { error: err, newSidCursor: newSidCursor } =
      _fnBypassUserResponse(currentSidCursor);
    if (err) {
      return { error: err, newSidCursor: null };
    }
    if (newSidCursor === currentSidCursor) {
      break;
    }

    currentSidCursor = newSidCursor;
  } while (currentSidCursor !== null);

  return { error: null, newSidCursor: currentSidCursor };
};

export const fnBypassForward = (
  sidCursor: string
): {
  error: Str;
  newSidCursor: Str;
} => {
  return _fnBypass(sidCursor, fnCursorMoveForward);
};

export const fnBypassBackward = (
  sidCursor: string
): {
  error: Str;
  newSidCursor: Str;
} => {
  return _fnBypass(sidCursor, fnCursorMoveBackward);
};
