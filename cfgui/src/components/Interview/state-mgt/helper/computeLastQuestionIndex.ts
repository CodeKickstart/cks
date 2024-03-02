import { Str } from "../../defs/types/Str";
import { fnSplitCursor } from "../../misc/strings";
import {
  fnGetAllPreOrderCursors,
  fnSetLastQuestionIndex,
} from "../cursor/cursor";
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
      const { error: errorSkipQuestion, skipQuestion } = fnShouldSkipQuestion(
        sidCursor,
        true
      );
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
