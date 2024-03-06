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
} from "./cursor/cursor";
import { valtioStore } from "../defs/types/ValtioTypes";
import { fnPostfixTraversal } from "./treeTraversal/postTraversal";
import { fnGatherOrderSequences } from "./treeWorkers/orderList";
import { fnSplitCursor } from "./dataAccess/hiLevelAccess";
import { fnDispatchOp } from "../utils/opsDispatcher";

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

  const _fnPreProcess = () => {
    for (const cursor of fnGetAllPreOrderCursors()) {
      console.log(cursor);
      if (!cursor) {
        return { error: "fnSetupForResponse: cursor is null" };
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
  const { error: errPreProcess } = _fnPreProcess();
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

  return { error: null, sidCursor };
};
