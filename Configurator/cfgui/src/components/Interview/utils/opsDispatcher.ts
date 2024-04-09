import { fnGetQueryAttributeString } from "../state-mgt/dataAccess/loLevelAccess";
import { ASIS_post, ASIS_pre, KEY_KIND } from "../../../shared/defs/constants";

import { opsClientMap } from "./opsClientMap";

import { Str } from "../defs/types/Str";
import { fnSplitCursor } from "../state-mgt/dataAccess/hiLevelAccess";

export const fnDispatchOp = (
  cursor: string
): {
  error: Str;
} => {
  const { phase, sidCursor } = fnSplitCursor(cursor);

  const { error, value: kind } = fnGetQueryAttributeString(sidCursor, KEY_KIND);
  if (error || !kind) {
    return { error };
  }

  const { fnGetOpsMgr } = opsClientMap();
  const clientOps = fnGetOpsMgr(kind);
  if (!clientOps) {
    return {
      error: `fnDispatchOp: kind: ${kind} not found`,
    };
  }

  const { fnPreProcess, fnPostProcess } = clientOps();
  if (phase === ASIS_pre) {
    const { error } = fnPreProcess(sidCursor);

    if (error) {
      console.log(error);
      return { error };
    }
    return { error: null };
  } else {
    if (phase === ASIS_post) {
      const { error } = fnPostProcess(sidCursor);
      if (error) {
        console.log(error);
        return { error };
      }
      return { error: null };
    } else {
      console.log(`fnDispatchOp: phase: ${phase} not found`);
      return { error: null };
    }
  }
};
