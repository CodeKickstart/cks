import { JsonObjectType } from "../../../shared/defs/types";
import { Str } from "../defs/types/Str";
import { fnChangeBlockingStatusOfSubtree } from "../state-mgt/dataAccess/hiLevelAccess";
// import { fnGetQueryAttrOfChildren } from "../state-mgt/dataAccess/loLevelAccess";

function _fnFindAllChildrenIndices(queryObject: JsonObjectType): {
  error: string | null;
  children: object;
  childrenIndices: number[];
} {
  interface ObjTemplate {
    children?: object;
    val?: number[] | number;
  }
  const { children, val } = queryObject as ObjTemplate;
  if (children === undefined || val === undefined) {
    return {
      error: "Failed to retrieve children or answer from query object",
      children: {},
      childrenIndices: [],
    };
  }

  let unblockedChildrenIndices: number[] = [];
  if (typeof val === "number") {
    // pickone literal has to be processed as an array - hence the conversion
    unblockedChildrenIndices = [val];
  } else if (
    Array.isArray(val) &&
    val.every((element) => typeof element === "number")
  ) {
    unblockedChildrenIndices = val;
  } else {
    return {
      error: "Invalid value type for unblockedChildrenIndices",
      children: {},
      childrenIndices: [],
    };
  }

  return { error: null, children, childrenIndices: unblockedChildrenIndices };
}

export const fnBlockUnselectedChildren = (
  queryObject: JsonObjectType
): { error: Str } => {

  const {
    error,
    children,
    childrenIndices: unblockedChildrenIndices,
  } = _fnFindAllChildrenIndices(queryObject);
  if (error) {
    return { error };
  }

  const _fnChangeBlockingCondition = (treeNode: object, doBlock: boolean) => {
    const value = treeNode as object;
    if (value !== null && value !== undefined && typeof value === "object") {
      const { error } = fnChangeBlockingStatusOfSubtree(
        treeNode as object,
        doBlock
      );
      return { error };
    } else {
      return { error: "No tree node to be block" };
    }
  };

  interface ObjTemplateChildren {
    kind?: string;
  }

  const fnBlockComponentTree = (children: object): { error: string | null } => {
    const { error } = _fnChangeBlockingCondition(children, true);
    return { error };
  };

  const fnUnblockComponentTree = (
    children: object
  ): { error: string | null } => {
    const { error } = _fnChangeBlockingCondition(children, false);
    return { error };
  };

  const { kind } = children as ObjTemplateChildren;
  if (kind === undefined) {
    let index = 0;
    for (const v of Object.values(children as object)) {
      if (!unblockedChildrenIndices.includes(index)) {
        const { error } = fnBlockComponentTree(v);
        if (error) {
          return { error };
        }
      } else {
        const { error } = fnUnblockComponentTree(v);
        if (error) {
          return { error };
        }
      }

      index++;
    }
  }

  return { error: null };
};
