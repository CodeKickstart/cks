import { KIND_ERROR } from "../defs/constants/ComponentNames";
// import { valtioStore } from "../defs/types/ValtioTypes";
import { fnDispatchOp } from "../utils/opsDispatcher";
import {
  fnCursorInitForResponse,
  fnGetAllPostOrderCursors,
} from "./cursor/cursor";

export const fnRunPhase2 = (() => {
  const _fnSetupForResponse = () => {
    // valtioStore.preOrderComplete = true;
    fnCursorInitForResponse();

    for (const cursor of fnGetAllPostOrderCursors()) {
      console.log(cursor);
      if (!cursor) {
        return { error: "_fnSetupForResponse: cursor is null" };
      }
      const { error } = fnDispatchOp(cursor);
      if (error) {
        return { error, nextKind: KIND_ERROR };
      }
    }

    return { error: null };
  };

  let _visited = false;
  return () => {
    if (_visited === true) {
      return;
    }
    _visited = true;
    const { error } = _fnSetupForResponse();
    if (error) {
      console.error(`fnSetupForResponse: error: ${error}`);
    }
  };
})();
