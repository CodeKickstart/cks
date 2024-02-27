import {
  ASIS_pre,
  ASIS_post,
  ASIS_postfixOrderList,
  ASIS_prefixOrderList,
} from "../../../../shared/defs/constants";
import { JsonObjectType } from "../../../../shared/defs/types";
import { fnSplitCursor } from "../misc/strings";
import { fnCursorInitForInterview, fnGetCurrentCursor } from "./cursor/cursor";
import { valtioStore } from "../defs/types/ValtioTypes";
import { fnPostfixTraversal } from "./treeTraversal/postTraversal";
import { fnGatherOrderSequences } from "./treeWorkers/orderList";

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

  // valtioStore.orderSequences = retList;
  fnCursorInitForInterview();
  const cursor = fnGetCurrentCursor();
  if (cursor === null || cursor === undefined) {
    return { error: null, sidCursor: cursor };
  }
  // console.log(`Text: cursor: ${cursor}`);
  const { sidCursor } = fnSplitCursor(cursor);
  return { error: null, sidCursor };

  // return { error: null, sidCursor: null };
};
