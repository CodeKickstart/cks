import { Str } from "../defs/types/Str";

import {
  fnGetAllPreOrderCursors,
  fnSetLastQuestionIndex,
} from "../state-mgt/cursor/cursor";
import { fnSplitCursor } from "../state-mgt/dataAccess/hiLevelAccess";
import { fnShouldSkipQuestion } from "./shouldSkipQuestion";

export function fnComputeAndStoreLastQuestionIndex(): {
  error: Str;
  lastQuestionIndex: number | null;
} {
  let allNotSkippedIndices: null | number[] = null;
  let index = 0;
  for (const cursor of fnGetAllPreOrderCursors()) {
    if (cursor !== null) {
      const { sidCursor } = fnSplitCursor(cursor);
      const { error: errorSkipQuestion, skipQuestion } =
        fnShouldSkipQuestion(sidCursor);
      if (errorSkipQuestion) {
        return { error: errorSkipQuestion, lastQuestionIndex: null };
      }
      if (!skipQuestion) {
        if (allNotSkippedIndices === null) {
          allNotSkippedIndices = [];
        }
        allNotSkippedIndices.push(index);
      }
    }
    index++;
  }

  const lastQuestionIndex = allNotSkippedIndices?.pop() ?? null;
  fnSetLastQuestionIndex(lastQuestionIndex);
  return {
    error: null,
    lastQuestionIndex,
  };
}
