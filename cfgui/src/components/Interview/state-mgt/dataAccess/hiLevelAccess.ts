import { KEY_BLOCKED, KEY_OVERRIDE } from "../../../../shared/defs/constants";
import { Str } from "../../defs/types/Str";
import { fnSplitCursor } from "../../misc/strings";
import { fnGetAllPreOrderCursors, fnGetCurrentCursor } from "../cursor/cursor";
import { fnGetQueryAttribute, fnGetQueryObject } from "./loLevelAccess";

export const fnGetAllPreOrderAnswers = <T>(
  key: string
): {
  error: Str;
  results: T[] | null;
} => {
  const results: T[] = [];
  for (const cursor of fnGetAllPreOrderCursors()) {
    if (cursor !== null) {
      const { sidCursor } = fnSplitCursor(cursor);

      const { error: errorBlocked, value: blocked } = fnGetQueryAttribute(
        sidCursor,
        KEY_BLOCKED
      );
      if (errorBlocked) {
        return { error: errorBlocked, results: null };
      }

      const { error: errorOverride, value: override } = fnGetQueryAttribute(
        sidCursor,
        KEY_OVERRIDE
      );

      if (errorOverride) {
        return { error: errorOverride, results: null };
      }

      if (!override && !blocked) {
        const { error, value } = fnGetQueryAttribute(sidCursor, key);
        if (error) {
          return { error, results: null };
        }
        if (value) {
          results.push(value as T);
        }
      }
    }
  }

  return { error: null, results: results };
};

export const fnRetrieveQueryObject = () => {
  const cursor = fnGetCurrentCursor();
  if (!cursor) {
    return null;
  }
  const { sidCursor } = fnSplitCursor(cursor);
  const { error, queryObject } = fnGetQueryObject(sidCursor);
  if (error) {
    console.log(error);
    return null;
  }
  if (!queryObject) {
    return null;
  }
  return queryObject;
};

export const fnGetSidCursor = () => {
  const cursor = fnGetCurrentCursor();
  if (!cursor) {
    return null;
  }
  const { sidCursor } = fnSplitCursor(cursor);
  return sidCursor;
};
