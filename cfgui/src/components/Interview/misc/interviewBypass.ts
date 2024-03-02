import { fnSplitCursor } from "./strings";
import { fnCursorMove } from "../state-mgt/cursor/cursor";

import { Str } from "../defs/types/Str";
import { fnShouldSkipQuestion } from "../state-mgt/helper/shouldSkipQuestion";

export const fnBypassUserResponses = (
  sidCursor: string
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
      const { cursor: newCursor } = fnCursorMove();
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
  let currentSidCursor: Str = sidCursor;
  const error = null;
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
  return { error, nextSidCursor: currentSidCursor };
};
