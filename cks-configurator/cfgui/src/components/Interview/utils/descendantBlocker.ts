// import { KEY_BLOCKED } from "../../../shared/defs/constants";
import { JsonObjectType } from "../../../shared/defs/types";
import { Str } from "../defs/types/Str";
import { fnBlockSubTree } from "../state-mgt/dataAccess/hiLevelAccess";

export function fnFindUnblockedChildren(queryObject: JsonObjectType): {
  error: string | null;
  children: object;
  unblockedChildrenIndices: number[];
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
      unblockedChildrenIndices: [],
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
      unblockedChildrenIndices: [],
    };
  }

  return { error: null, children, unblockedChildrenIndices };
}

export const fnBlockUnselectedChildren = (
  queryObject: JsonObjectType
): { error: Str } => {
  console.log(`Query object: ${queryObject}`);

  const { error, children, unblockedChildrenIndices } =
    fnFindUnblockedChildren(queryObject);
  if (error) {
    return { error };
  }

  const _fnBlockUnselectedChildren = (treeNode: object) => {
    const value = treeNode as object;
    if (value !== null && value !== undefined && typeof value === "object") {
      const { error } = fnBlockSubTree(treeNode as object);
      return { error };
    } else {
      return { error: "No tree node to be block" };
    }
  };

  interface ObjTemplateChildren {
    kind?: string;
  }

  const { kind } = children as ObjTemplateChildren;
  if (kind === undefined) {
    let index = 0;
    for (const [k, v] of Object.entries(children as object)) {
      console.log(`Key: ${k}, Value: ${v}`);
      if (!unblockedChildrenIndices.includes(index)) {
        const { error } = _fnBlockUnselectedChildren(v);
        if (error) {
          return { error };
        }
      }

      index++;
    }
  }

  return { error: null };
};
