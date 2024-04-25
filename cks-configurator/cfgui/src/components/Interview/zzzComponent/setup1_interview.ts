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
  

  function _fnLogArrayInfo(orderList: string[], startWith: string) {
    const seqList = orderList.filter((item) => item.startsWith(startWith));
    console.log(`<<< fnSetupForInterview: orderList`, startWith);
    for (const obj of seqList) {
      console.log(obj);
    }
    console.log(`>>> fnSetupForInterview: orderList`, startWith);
  }
  console.log("***************** GatherOrderSequences");

  const _fnPreProcessIterator = () => {
    for (const cursor of fnGetAllPreOrderCursors()) {
      console.log(cursor);
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
    console.log("!!!fnSetupForInterview", errOrderSequences);
    return { error: errOrderSequences };
  }
  // valtioStore.preOrderList
  valtioStore.preOrderList = orderList.filter((item) =>
    item.startsWith(ASIS_pre)
  );
  _fnLogArrayInfo(orderList, ASIS_pre);

  valtioStore.postOrderList = orderList.filter((item) =>
    item.startsWith(ASIS_post)
  );
  _fnLogArrayInfo(orderList, ASIS_post);

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
  // console.log(`Text: cursor: ${cursor}`);
  const { sidCursor } = fnSplitCursor(cursor);

  fnInitZZZState();

  return { error: null, sidCursor };
};

function fnInitZZZState() {
  valtioStore.zzzState = ZZZ_STATE_1;
}
