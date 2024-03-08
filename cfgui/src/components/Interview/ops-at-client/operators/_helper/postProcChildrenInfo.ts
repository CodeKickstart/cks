import { fnGetQueryObject } from "../../../state-mgt/dataAccess/loLevelAccess";

export const fnFindChildrenInfo = <T>(sidCursor: string) => {
  const { error, queryObject } = fnGetQueryObject(sidCursor);
  if (error) {
    return { error };
  }
  interface ObjTemplate {
    children?: object;
    sid?: string;
    val?: T;
  }

  const {
    children,
    sid: childrenSid,
    val: childrenIndices,
  } = (queryObject || {}) as ObjTemplate;
  if (!children) {
    return { error: "No children found" };
  }
  // if (!childrenIndices) {
  //   return { error: "No indices found" };
  // }
  if (typeof childrenSid !== "string") {
    return { error: "sid is not a string" };
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
      children,
      childrenSid,
      childrenIndices,
      childrenKind,
      childrenVal,
    },
  };
};
