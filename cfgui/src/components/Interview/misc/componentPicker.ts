import { KIND_ERROR, KIND_FINISH } from "../defs/constants/ComponentNames";
import { fnGetQueryAttributeString } from "../state-mgt/dataAccess/loLevelAccess";
import { KEY_KIND } from "../../../shared/defs/constants";
import { fnCursorMove } from "../state-mgt/cursor/cursor";
import { Str } from "../defs/types/Str";
import { fnSplitCursor } from "../state-mgt/dataAccess/hiLevelAccess";
import { fnBypassUserResponses } from "./interviewBypass";

export const fnPickNextKind = (
  currentComponent: Str
): { error: Str; nextKind: Str } => {
  console.log("fnPickNextKind: current component", currentComponent);

  const { cursor } = fnCursorMove();

  // console.log("fnPickNextKind: cursor", cursor);
  if (cursor === null) {
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
