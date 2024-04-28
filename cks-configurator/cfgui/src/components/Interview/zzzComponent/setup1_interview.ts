import {
  ASIS_pre,
  ASIS_post,
  ASIS_postfixOrderList,
  ASIS_prefixOrderList,
} from "../../../shared/defs/constants";
import { JsonObjectType } from "../../../shared/defs/types";

import {
  fnCursorInitForInterview,
  fnGetAllPreOrderCursors,
  fnGetCurrentCursor,
} from "../state-mgt/cursor/cursor";
import { valtioStore } from "../defs/types/ValtioTypes";
import { fnPostfixTraversal } from "../state-mgt/treeTraversal/postTraversal";
import { fnGatherOrderSequences } from "../state-mgt/treeWorkers/orderList";
import { fnSplitCursor } from "../state-mgt/dataAccess/hiLevelAccess";
import { fnDispatchOp } from "../utils/opsDispatcher";
import { ZZZ_STATE_1 } from "../defs/constants/ComponentNames";
 
export const fnSetupForInterview = () => {

  const _fnPreProcessIterator = () => {
    for (const cursor of fnGetAllPreOrderCursors()) {
      if (!cursor) {
        return { error: "_fnPreProcessIterator: cursor is null" };
      }
      const { error } = fnDispatchOp(cursor);
      if (error) {
        return { error };
      }
    }
    return { error: null };
  };

  const { error: errOrderSequences, retList: orderList } =
    fnPostfixTraversal<string>(
      fnGatherOrderSequences,
      valtioStore.queryContext as JsonObjectType,
      {
        matchingKeys: [ASIS_postfixOrderList, ASIS_prefixOrderList],
      }
    );
  if (errOrderSequences) {
    throw new Error(`fnSetupForInterview: ${errOrderSequences}`);
  }
  // valtioStore.preOrderList
  valtioStore.preOrderList = orderList.filter((item) =>
    item.startsWith(ASIS_pre)
  );
  // _fnLogArrayInfo(orderList, ASIS_pre);

  valtioStore.postOrderList = orderList.filter((item) =>
    item.startsWith(ASIS_post)
  );
  // _fnLogArrayInfo(orderList, ASIS_post);

  // run it through every cursor ***
  const { error: errPreProcess } = _fnPreProcessIterator();
  if (errPreProcess) {
    return { error: errPreProcess };
  }

  fnCursorInitForInterview();
  const cursor = fnGetCurrentCursor();
  if (cursor === null || cursor === undefined) {
    return { error: null, sidCursor: cursor };
  }
  const { sidCursor } = fnSplitCursor(cursor);

  fnInitZZZState();

  return { error: null, sidCursor };
};

function fnInitZZZState() {
  valtioStore.zzzState = ZZZ_STATE_1;
}

