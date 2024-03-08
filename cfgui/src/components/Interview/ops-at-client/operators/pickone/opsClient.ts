import { OP_LITERAL, OP_PICKONE } from "../../../../../shared/defs/constants";

import { Str } from "../../../defs/types/Str";

import { fnGetQueryObject } from "../../../state-mgt/dataAccess/loLevelAccess";

import { fnFindAndStoreDescendantNames } from "../../../utils/descendantSearch";
import { fnFindChildrenInfo } from "../_helper/postProcChildrenInfo";
import { fnPostProcPickForLiteralDescendants } from "../_helper/postProcLiteralDescendants";
import { fnPostProcPickForSkippedDescendants } from "../_helper/postProcSkippedDescedants";

const name = OP_PICKONE;
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
    const { error: errorFindDescendantNames, descendantNames } =
      fnFindAndStoreDescendantNames(queryObject);
    if (errorFindDescendantNames) {
      return { error: errorFindDescendantNames };
    }
    console.log(`opsClient::${name}:pre descendantNames: ${descendantNames}`);

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
    console.log(`opsClient::${name}:post descendantInfo: ${descendantInfo}`);
    const {
      children,
      childrenSid,
      childrenIndices,
      childrenKind,
      childrenVal,
    } = descendantInfo as {
      children: object;
      childrenSid: string;
      childrenIndices: number;
      childrenKind: string;
      childrenVal: (string | number | boolean)[] | undefined;
    };

    if (childrenKind === OP_LITERAL) {
      const { error } = fnPostProcPickForLiteralDescendants(
        childrenSid,
        [childrenIndices],
        childrenVal
      );
      return { error };
    } else {
      // pick the only unblocked child
      for (const [key, value] of Object.entries(children as object)) {
        console.log(`fnPostProcessPickOne: children: ${key} => ${value}`);
      }
      const { error } = fnPostProcPickForSkippedDescendants(
        childrenSid,
        children
      );
      return { error };
    }
  };

  return { fnPreProcess, fnPostProcess };
};
