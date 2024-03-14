import { proxy } from "valtio";
import { JsonObjectType } from "../../../../shared/defs/types";
import { Str } from "./Str";
import { ZZZ_START } from "../constants/ComponentNames";

export interface querySelectorType {
  contextName: Str;
  id: Str;
}

const valtioStore = proxy({
  // answers: [] as string[],
  queryContext: {} as JsonObjectType,
  queryList: [] as Array<querySelectorType>,
  currentQueryKey: { contextName: null, id: null } as querySelectorType,
  sidIndex: null as number | null,
  preOrderList: [] as string[],
  postOrderList: [] as string[],
  currentIndex: null as number | null,
  maxOrderIndex: -1,
  lastQuestionIndex: null as number | null,
  preOrderComplete: false,
  earlyExit: false,
  zzzState: ZZZ_START as string,
});

export { valtioStore };
