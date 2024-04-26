import { proxy } from "valtio";
import { JsonObjectType } from "../../../../shared/defs/types";
import { Str } from "./Str";
import { ZZZ_START } from "../constants/ComponentNames";

export interface querySelectorType {
  contextName: Str;
  id: Str;
}

const valtioStore = proxy({
  dyntree_prev_key: null as string | null,
  dyntree_current_key: null as string | null,
  dyntree_nextKeyMap: {} as { [key: string]: string },
  dyntree_prevKeyMap: {} as { [key: string]: string },

  repoonses: {} as JsonObjectType,
  queryContext: {} as JsonObjectType,
  queryList: [] as Array<querySelectorType>,
  currentQueryKey: { contextName: null, id: null } as querySelectorType,
  preOrderList: [] as string[],
  postOrderList: [] as string[],
  currentIndex: null as number | null,
  maxOrderIndex: -1,
  lastQuestionIndex: null as number | null,
  preOrderComplete: false,
  earlyExit: false,
  zzzState: ZZZ_START as string,
  urlInfo: {
    baseUrl: "",
    path: "",
    queryParams: "",
  },
});

export { valtioStore };
