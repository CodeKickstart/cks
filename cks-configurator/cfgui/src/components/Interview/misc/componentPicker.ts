import { KIND_ERROR, KIND_FINISH } from "../defs/constants/ComponentNames";
import {
  fnGetQueryAttributeString,
  fnSetBackSid,
} from "../state-mgt/dataAccess/loLevelAccess";
import { KEY_KIND } from "../../../shared/defs/constants";
import { fnCursorMove, fnCursorMoveBack } from "../state-mgt/cursor/cursor";
import { Str } from "../defs/types/Str";
import { fnSplitCursor } from "../state-mgt/dataAccess/hiLevelAccess";
import { fnBypassUserResponses } from "./interviewBypass";

export const fnMoveToNext = (): { error: Str; nextKind: Str } => {
  const { cursor } = fnCursorMove();

  if (!cursor) {
    return {
      error: null,
      nextKind: KIND_FINISH,
    };
  }

  const { sidCursor } = fnSplitCursor(cursor);

  const { error, nextSidCursor } = fnBypassUserResponses(sidCursor);
  if (error) {
    return { error, nextKind: KIND_ERROR };
  }

  const errSetBackPointer = fnSetBackSid(nextSidCursor as string);
  if (errSetBackPointer) {
    return { error: errSetBackPointer, nextKind: KIND_ERROR };
  }

  if (!nextSidCursor || nextSidCursor === null) {
    //end of the interview
    return { error: null, nextKind: null };
  }
  const { error: errorGettingKind, value: kind } = fnGetQueryAttributeString(
    nextSidCursor,
    KEY_KIND
  );
  if (errorGettingKind) {
    return { error: errorGettingKind, nextKind: KIND_ERROR };
  }

  return { error: null, nextKind: kind as Str };
};

export const fnMoveBack = (): { error: Str; nextKind: Str } => {
  const { cursor } = fnCursorMoveBack();
  if (cursor === null) {
    return { error: null, nextKind: KIND_ERROR };
  }
  const { sidCursor } = fnSplitCursor(cursor);

  const { error: errorGettingKind, value: kind } = fnGetQueryAttributeString(
    sidCursor,
    KEY_KIND
  );
  if (errorGettingKind) {
    return { error: errorGettingKind, nextKind: KIND_ERROR };
  }

  return { error: null, nextKind: kind as Str };
};
