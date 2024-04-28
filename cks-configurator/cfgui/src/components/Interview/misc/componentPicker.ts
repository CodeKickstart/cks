import { KIND_FINISH } from "../defs/constants/ComponentNames";
import { fnGetQueryAttributeString } from "../state-mgt/dataAccess/loLevelAccess";
import { KEY_KIND } from "../../../shared/defs/constants";
import {
  fnCursorMoveBackward,
  fnCursorMoveForward,
} from "../state-mgt/cursor/cursor";
import { Str } from "../defs/types/Str";
import { fnSplitCursor } from "../state-mgt/dataAccess/hiLevelAccess";
import { fnBypassBackward, fnBypassForward } from "./interviewBypass";

export const fnMoveToNext = (): { error: Str; newKind: Str } => {
  const { cursor: cursorForward } = fnCursorMoveForward();

  if (!cursorForward) {
    return {
      error: null,
      newKind: KIND_FINISH,
    };
  }

  const { sidCursor } = fnSplitCursor(cursorForward);

  const { error, newSidCursor } = fnBypassForward(sidCursor);
  if (error) {
    return { error, newKind: KIND_FINISH };
  }

  if (!newSidCursor || newSidCursor === null) {
    //end of the interview
    return { error: null, newKind: null };
  }
  const { error: errorGettingKind, value: kind } = fnGetQueryAttributeString(
    newSidCursor,
    KEY_KIND
  );
  if (errorGettingKind) {
    return { error: errorGettingKind, newKind: KIND_FINISH };
  }

  return { error: null, newKind: kind as Str };
};

export const fnMoveToPrevious = (): { error: Str; newKind: Str } => {
  // const cursor = fnGetCurrentCursor();

  // if (cursor === null) {
  //   return {
  //     error: null,
  //     newKind: KIND_FINISH,
  //   };
  // }

  const { cursor: cursorBackward } = fnCursorMoveBackward();

  if (!cursorBackward) {
    return {
      error: null,
      newKind: KIND_FINISH,
    };
  }

  const { sidCursor: sidCursorCurrent } = fnSplitCursor(cursorBackward);

  const { error, newSidCursor } = fnBypassBackward(sidCursorCurrent);
  if (error || !newSidCursor) {
    return { error, newKind: KIND_FINISH };
  }

  const { error: errorGettingKind, value: kind } = fnGetQueryAttributeString(
    newSidCursor,
    KEY_KIND
  );
  if (errorGettingKind) {
    return { error: errorGettingKind, newKind: KIND_FINISH };
  }

  return { error: null, newKind: kind as Str };
};
