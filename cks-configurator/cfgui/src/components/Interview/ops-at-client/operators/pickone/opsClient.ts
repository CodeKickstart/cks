import { OP_LITERAL } from "../../../../../shared/defs/constants";

import { Str } from "../../../defs/types/Str";

import { fnGetQueryObject } from "../../../state-mgt/dataAccess/loLevelAccess";

import { fnFindAndStoreDescendantNames } from "../../../utils/descendantSearch";
import { fnFindChildrenInfo } from "../_helper/postProcChildrenInfo";
import { fnPostProcPickForLiteralDescendants } from "../_helper/postProcLiteralDescendants";
import { fnPostProcPickForSkippedDescendants } from "../_helper/postProcSkippedDescedants";

// const name = OP_PICKONE;
export const opsClient = () => {
  const fnPreProcess = (
    sidCursor: string
  ): {
    error: Str;
  } => {
    const { error: errorQuery, queryObject } = fnGetQueryObject(sidCursor);
    if (errorQuery) {
      return { error: errorQuery };
    }
    const { error: errorFindDescendantNames } =
      fnFindAndStoreDescendantNames(queryObject);
    if (errorFindDescendantNames) {
      return { error: errorFindDescendantNames };
    }

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
      fnFindChildrenInfo<number>(sidCursor);

    if (errorDescendantInfo) {
      return { error: errorDescendantInfo };
    }
    const { children, childrenIndices, childrenKind, childrenVal } =
      descendantInfo as {
        children: object;
        childrenIndices: number;
        childrenKind: string;
        childrenVal: (string | number | boolean)[] | undefined;
      };

    if (childrenKind === OP_LITERAL) {
      const { error } = fnPostProcPickForLiteralDescendants(
        sidCursor,
        [childrenIndices],
        childrenVal,
        true
      );
      return { error };
    } else {
      const { error } = fnPostProcPickForSkippedDescendants(
        sidCursor,
        children
      );
      return { error };
    }
  };

  return { fnPreProcess, fnPostProcess };
};
