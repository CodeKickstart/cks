import { JsonObjectType } from "../../../../../shared/defs/types";
import {
  fnGetQueryObject,
  fnSetQueryAttribute,
} from "../../../state-mgt/dataAccess/loLevelAccess";

export const fnProcessGrandChildren = (parentSid: string, children: object) => {
  for (const [key, value] of Object.entries(children as object)) {
    interface ObjTemplate {
      blocked?: boolean;
      val?: string | number | boolean | object | null;
    }
    const { blocked, val } = (value || {}) as ObjTemplate;
    if (blocked === false) {
      const newVal = { [key]: val };
      const { error: errorSetValue } = fnSetQueryAttribute(
        parentSid,
        key,
        newVal as JsonObjectType
      );
      if (errorSetValue) {
        return { error: errorSetValue };
      }
    }
  }
  return { error: null };
};

export const fnFindChildrenInfo = (sidCursor: string) => {
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
    val: childrenIndices,
  } = (queryObject || {}) as ObjTemplate;
  if (!children) {
    return { error: "No children found" };
  }
  if (!childrenIndices) {
    return { error: "No indices found" };
  }

  if (typeof childrenSid !== "string") {
    return { error: "sid is not a string" };
  }
  if (
    !Array.isArray(childrenIndices) ||
    childrenIndices.some((index) => typeof index !== "number")
  ) {
    return { error: "index is not a number[]" };
  }

  interface ObjTemplateChildren {
    kind?: string;
    val?: string[] | number[] | boolean[] | undefined;
  }

  const { kind: childrenKind, val: childrenVal } =
    children as ObjTemplateChildren;

  return {
    error: null,
    descendantInfo: {
      childrenSid,
      childrenIndices,
      childrenKind,
      childrenVal,
    },
  };
};
