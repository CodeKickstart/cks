import { valtioStore } from "../defs/types/ValtioTypes";
import { fnSplitCursor } from "../state-mgt/dataAccess/hiLevelAccess";

export const fnRunPostProcess = () => {
  const filteredPostProcessList: string[] = [];
  for (const sid of Object.values(valtioStore.postOrderList)) {
    const { sidCursor } = fnSplitCursor(sid);
    if (sidCursor.startsWith("zzz") === false) {
      filteredPostProcessList.push(sidCursor);
    }
  }
};
