import { OP_LITERAL, OP_PICKMANY } from "../../../../../shared/defs/constants";
import { Str } from "../../../defs/types/Str";

import { fnGetQueryObject } from "../../../state-mgt/dataAccess/loLevelAccess";

import { fnFindAndStoreDescendantNames } from "../../../utils/descendantSearch";
import { fnFindDescendantInfo, fnProcessGrandChildren } from "../_helper/pick";
import { fnProcessLiteralChildrenM } from "./postProcess";

const name = OP_PICKMANY;
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

    const { error: errorFinddescendantNames, descendantNames } =
      fnFindAndStoreDescendantNames(queryObject);
    if (errorFinddescendantNames) {
      return { error: errorFinddescendantNames };
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
      fnFindDescendantInfo(sidCursor);
    if (errorDescendantInfo) {
      return { error: errorDescendantInfo };
    }
    console.log(`opsClient::${name}:post descendantInfo: ${descendantInfo}`);

    const { error, queryObject } = fnGetQueryObject(sidCursor);
    if (error) {
      return { error };
    }
    interface ObjTemplate {
      children?: object;
      sid?: string;
      val?: number[];
    }

    const {
      children,
      sid: childrenSid,
      val: indices,
    } = (queryObject || {}) as ObjTemplate;
    if (!children) {
      return { error: "No children found" };
    }
    if (typeof childrenSid !== "string") {
      return { error: "sid is not a string" };
    }
    if (
      !Array.isArray(indices) ||
      indices.some((index) => typeof index !== "number")
    ) {
      return { error: "index is not a number[]" };
    }

    interface ObjTemplateChildren {
      kind?: string;
      val?: string[] | number[] | boolean[] | undefined;
    }
    const { kind: childrenKind, val: childrenVal } =
      children as ObjTemplateChildren;
    if (childrenKind === OP_LITERAL) {
      const { error } = fnProcessLiteralChildrenM(
        childrenSid,
        indices,
        childrenVal
      );
      return { error };
    } else {
      // pick the only unblocked child
      for (const [key, value] of Object.entries(children as object)) {
        console.log(`fnPostProcessPickOne: children: ${key} => ${value}`);
      }
      const { error } = fnProcessGrandChildren(childrenSid, children);
      return { error };
    }
  };

  return { fnPreProcess, fnPostProcess };
};
