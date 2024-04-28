import { KIND_FINISH } from "../defs/constants/ComponentNames";
import { fnGetQueryAttributeString } from "../state-mgt/dataAccess/loLevelAccess";
import { KEY_KIND } from "../../../shared/defs/constants";
import {
  fnCursorMoveForward,
  fnCursorMoveBackward,
} from "../state-mgt/cursor/cursor";
import { Str } from "../defs/types/Str";
import { fnSplitCursor } from "../state-mgt/dataAccess/hiLevelAccess";
import { fnBypassForward as fnBypassBackward } from "./interviewBypass";

export const fnMoveToNext = (): { error: Str; newKind: Str } => {
  const { cursor } = fnCursorMoveForward();

  if (!cursor) {
    return {
      error: null,
      newKind: KIND_FINISH,
    };
  }

  const { sidCursor } = fnSplitCursor(cursor);

  const { error, newSidCursor } = fnBypassBackward(sidCursor);
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
  const { cursor } = fnCursorMoveBackward();

  if (!cursor) {
    return {
      error: null,
      newKind: KIND_FINISH,
    };
  }

  const { sidCursor } = fnSplitCursor(cursor);

  const { error, newSidCursor } = fnBypassBackward(sidCursor);
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
  // const { cursor } = fnMoveToPrevious();
  // if (cursor === null) {
  //   return { error: null, newKind: KIND_ERROR };
  // }
  // const { sidCursor } = fnSplitCursor(cursor);

  // const { error: errorGettingKind, value: kind } = fnGetQueryAttributeString(
  //   sidCursor,
  //   KEY_KIND
  // );
  // if (errorGettingKind) {
  //   return { error: errorGettingKind, newKind: KIND_ERROR };
  // }

  // return { error: null, newKind: kind as Str };
};
