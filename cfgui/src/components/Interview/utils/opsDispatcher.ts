import { fnGetQueryAttributeString } from "../state-mgt/dataAccess/loLevelAccess";
import { ASIS_post, ASIS_pre, KEY_KIND } from "../../../shared/defs/constants";

import { opsMap } from "./opsMap";

import { Str } from "../defs/types/Str";
import { fnSplitCursor } from "../state-mgt/dataAccess/hiLevelAccess";

export const fnDispatchOp = (
  cursor: string
): {
  error: Str;
  nextSidCursor: Str;
  // queryObject?: string | number | boolean | JsonObjectType | null;
} => {
  const { phase, sidCursor } = fnSplitCursor(cursor);

  const { error, value: kind } = fnGetQueryAttributeString(sidCursor, KEY_KIND);
  if (error || !kind) {
    return { error, nextSidCursor: null };
  }

  const { fnGetOpsMgr } = opsMap();
  const clientOps = fnGetOpsMgr(kind);
  if (!clientOps) {
    return {
      error: `fnDispatchOp: kind: ${kind} not found`,
      nextSidCursor: null,
    };
  }

  const { fnPreProcess, fnPostProcess } = clientOps();
  if (phase === ASIS_pre) {
    const { error, nextSidCursor } = fnPreProcess(sidCursor);

    if (error) {
      console.log(error);
      return { error, nextSidCursor: null };
    }
    return { error: null, nextSidCursor };
  } else {
    if (phase === ASIS_post) {
      const { error, nextSidCursor } = fnPostProcess(sidCursor);
      if (error) {
        console.log(error);
        return { error, nextSidCursor: null };
      }
      return { error: null, nextSidCursor };
    } else {
      console.log(`fnDispatchOp: phase: ${phase} not found`);
      return { error: null, nextSidCursor: null };
    }
  }
};
