import {
  KEY_BLOCKED,
  KEY_OVERRIDE,
} from "../../../../../shared/defs/constants";
import { Str } from "../../defs/types/Str";
import { fnSplitCursor } from "../../misc/strings";
import { fnGetAllPreOrderCursors } from "../cursor/cursor";
import { fnGetQueryAttribute } from "./loLevelAccess";

export const fnGetAllPreOrderAnswers = (
  key: string
): {
  error: Str;
  answers: string[] | null;
} => {
  const answers: string[] = [];
  for (const cursor of fnGetAllPreOrderCursors()) {
    if (cursor !== null) {
      const { sidCursor } = fnSplitCursor(cursor);

      const { error: errorBlocked, value: blocked } = fnGetQueryAttribute(
        sidCursor,
        KEY_BLOCKED
      );
      if (errorBlocked) {
        return { error: errorBlocked, answers: null };
      }

      const { error: errorOverride, value: override } = fnGetQueryAttribute(
        sidCursor,
        KEY_OVERRIDE
      );

      if (errorOverride) {
        return { error: errorOverride, answers: null };
      }

      if (!override && !blocked) {
        const { error, value } = fnGetQueryAttribute(sidCursor, key);
        if (error) {
          return { error, answers: null };
        }
        answers.push(value as string);
      }
    }
  }

  return { error: null, answers };
};
