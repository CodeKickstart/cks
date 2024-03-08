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

  const { children, val: childrenIndices } = (queryObject || {}) as ObjTemplate;
  if (!children) {
    return { error: "No children found" };
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
      childrenIndices,
      childrenKind,
      childrenVal,
    },
  };
};
