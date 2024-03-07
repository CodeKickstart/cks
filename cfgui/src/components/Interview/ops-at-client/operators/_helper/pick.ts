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

export const fnFindDescendantInfo = (sidCursor: string) => {
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
    sid: parentSid,
    val: derivedIndices,
  } = (queryObject || {}) as ObjTemplate;
  if (!children) {
    return { error: "No children found", descendantInfo: null };
  }
  if (typeof parentSid !== "string") {
    return { error: "sid is not a string" };
  }
  if (!Array.isArray(derivedIndices)) {
    return { error: "improper indices", descendantInfo: null };
  }

  interface ObjTemplateChildren {
    kind?: string;
    val?: string[] | number[] | boolean[] | undefined;
  }
  const { kind: childrenKind, val: childrenVal } =
    children as ObjTemplateChildren;

  return {
    error: null,
    descendantInfo: { parentSid, derivedIndices, childrenKind, childrenVal },
  };
};
