import { KIND_ERROR } from "../defs/constants/ComponentNames";
// import { valtioStore } from "../defs/types/ValtioTypes";
import { fnDispatchOp } from "../utils/opsDispatcher";
import {
  fnCursorInitForResponse,
  fnGetAllPostOrderCursors,
} from "./cursor/cursor";

const REACT_SECOND_RENDER_COUNT = 2;
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

  let count = 0;
  return () => {
    count++;
    if (count === REACT_SECOND_RENDER_COUNT) {
      console.log(`Listing out answers successful: count ${count} `);
      const { error } = _fnSetupForResponse();
      if (error) {
        console.error(`fnSetupForResponse: error: ${error}`);
      }
    }
  };
})();
