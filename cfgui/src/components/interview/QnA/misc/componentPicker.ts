import { fnDispatchOp } from "../utils/opsDispatcher";
import { KIND_ERROR, KIND_FINISH } from "../defs/constants/ComponentNames";
// import { fnCursorMove } from "../storeLogic/cursor/cursor";
import { fnGetQueryAttributeString } from "../state-mgt/dataAccess/loLevelAccess";
import { KEY_KIND } from "../../../../shared/defs/constants";
import {
  // fnCursorInitForResponse,
  fnCursorMove,
} from "../state-mgt/cursor/cursor";
import { Str } from "../defs/types/Str";

export const fnPickNextKind = (
  currentComponent: Str
): { error: Str; nextKind: Str } => {
  console.log("fnPickNextKind: current component", currentComponent);

  const { cursor } = fnCursorMove();

  console.log("fnPickNextKind: cursor", cursor);
  if (cursor === null) {
    console.log(
      "*** fnPickNextKind: cursor is null - returning finish component"
    );

    return {
      error: null,
      nextKind: KIND_FINISH,
    };
  }

  const { error, nextSidCursor } = fnDispatchOp(cursor);
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
