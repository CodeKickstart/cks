import { fnCursorMoveBackward, fnCursorMoveForward } from "../state-mgt/cursor/cursor";

import { Str } from "../defs/types/Str";
import { fnShouldSkipQuestion } from "./shouldSkipQuestion";
import { fnSplitCursor } from "../state-mgt/dataAccess/hiLevelAccess";

const _fnBypass = (
  sidCursor: string,
  fnCursorMoveForward: () => { cursor: string | null }
): {
  error: Str;
  nextSidCursor: Str;
} => {
  const _fnBypassUserResponse = (
    sidCursor: string
  ): {
    error: Str;
    nextSidCursor: Str;
  } => {
    const { error: errorSkipQuestion, skipQuestion } =
      fnShouldSkipQuestion(sidCursor);
    if (errorSkipQuestion) {
      return { error: errorSkipQuestion, nextSidCursor: null };
    }

    let nextSidCursor = sidCursor;
    if (skipQuestion) {
      const { cursor: newCursor } = fnCursorMoveForward();
      if (newCursor === null) {
        return { error: null, nextSidCursor: null };
      }

      const { sidCursor: newSidCursor } = fnSplitCursor(newCursor);
      nextSidCursor = newSidCursor;
    }

    return {
      error: null,
      nextSidCursor,
    };
  };

  let currentSidCursor: string | null = sidCursor;
  do {
    const { error: err, nextSidCursor: newSidCursor } =
      _fnBypassUserResponse(currentSidCursor);
    if (err) {
      return { error: err, nextSidCursor: null };
    }
    if (newSidCursor === currentSidCursor) {
      break;
    }

    currentSidCursor = newSidCursor;
  } while (currentSidCursor !== null);

  return { error: null, nextSidCursor: currentSidCursor };
};

export const fnBypassForward = (
  sidCursor: string
): {
  error: Str;
  nextSidCursor: Str;
} => {
  return _fnBypass(sidCursor, fnCursorMoveForward);
};

export const fnBypassBackward = (
  sidCursor: string
): {
  error: Str;
  nextSidCursor: Str;
} => {
  return _fnBypass(sidCursor, fnCursorMoveBackward);
};