
import { Str } from "../../../defs/types/Str";
import { fnFindChildrenInfo } from "../_helper/postProcChildrenInfo";
import { fnPostProcPickForSkippedDescendants } from "../_helper/postProcSkippedDescedants";


export const opsClient = () => {
  const fnPreProcess = (

  ): {
    error: Str;
  } => {


    return {
      error: null,
    };
  };

  const fnPostProcess = (
    sidCursor: string
  ): {
    error: Str;
  } => {
    const { error: errorDescendantInfo, descendantInfo } =
      fnFindChildrenInfo<number[]>(sidCursor);

    if (errorDescendantInfo) {
      return { error: errorDescendantInfo };
    }
    const { children, childrenKind } = descendantInfo as {
      children: object;
      childrenKind: string;
    };

    if (childrenKind !== undefined) {
      const error = "childrenKind should be undefined";
      return { error };
    }

    // there will be no skipped descendants for OP_OBJ as no children will be blocked
    const { error } = fnPostProcPickForSkippedDescendants(sidCursor, children);
    return { error };
  };

  return { fnPreProcess, fnPostProcess };
};
