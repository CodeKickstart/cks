import { KEY_BLOCKED, KEY_OVERRIDE } from "../../../../shared/defs/constants";
import { JsonObjectType } from "../../../../shared/defs/types";
import { Str } from "../../defs/types/Str";
import { valtioStore } from "../../defs/types/ValtioTypes";

import { fnGetAllPreOrderCursors, fnGetCurrentCursor } from "../cursor/cursor";
import { fnPostfixTraversal } from "../treeTraversal/postTraversal";
import { fnBlock, fnUnblock } from "../treeWorkers/blocker";
import { fnGetQueryAttribute, fnGetQueryAttributeBoolean, fnGetQueryObject } from "./loLevelAccess";

export function fnSplitCursor(str: string): {
  phase: string;
  sidCursor: string;
} {
  const index = str.indexOf(".");
  if (index !== -1) {
    const phase = str.substring(0, index);
    const sidCursor = str.substring(index + 1);
    return { phase, sidCursor };
  } else {
    return { phase: "", sidCursor: str };
  }
}
export const fnGetAllPreOrderAnswers = <T>(
  key: string
): {
  error: Str;
  results: T[] | null;
} => {
  const results: T[] = [];
  for (const cursor of fnGetAllPreOrderCursors()) {
    if (cursor !== null) {
      const { sidCursor } = fnSplitCursor(cursor);

      const { error: errorBlocked, value: blocked } = fnGetQueryAttribute(
        sidCursor,
        KEY_BLOCKED
      );
      if (errorBlocked) {
        return { error: errorBlocked, results: null };
      }

      const { error: errorOverride, value: override } = fnGetQueryAttribute(
        sidCursor,
        KEY_OVERRIDE
      );

      if (errorOverride) {
        return { error: errorOverride, results: null };
      }

      if (!override && !blocked) {
        const { error, value } = fnGetQueryAttribute(sidCursor, key);
        if (error) {
          return { error, results: null };
        }
        if (value !== null && value !== undefined) {
          results.push(value as T);
        }
      }
    }
  }

  return { error: null, results: results };
};

export const fnRetrieveQueryObject = () => {
  const cursor = fnGetCurrentCursor();
  if (!cursor) {
    return null;
  }
  const { sidCursor } = fnSplitCursor(cursor);
  const { error, queryObject } = fnGetQueryObject(sidCursor);
  if (error) {
    console.log(error);
    return null;
  }
  if (!queryObject) {
    return null;
  }
  return queryObject;
};

export const fnGetSidCursor = () => {
  const cursor = fnGetCurrentCursor();
  if (!cursor) {
    return null;
  }
  const { sidCursor } = fnSplitCursor(cursor);
  return sidCursor;
};

export const fnChangeBlockingStatusOfSubtree = (treenode: object, doBlock: boolean) => {
  const fnBlockingFunction = doBlock ? fnBlock : fnUnblock;
  const { error } = fnPostfixTraversal<string>(
    fnBlockingFunction,
    treenode as JsonObjectType
  );
  if (error) {
    console.log("!!!fnChangeBlockingStatusOfSubtree", error);
    return { error };
  }
  return { error: null };
};

export const fnGetQueryAttrOfChildren = (
  queryObject: JsonObjectType,
  attribute: string
): { error: Str; value: Array<{ [key: string]: JsonObjectType }> | null } => {
  if (!queryObject) {
    const error = `fnGetQueryChildrenAttributeList: queryObject is null`;
    return { error, value: null };
  }

  const attrValsOfChildren: JsonObjectType[] =
    queryObject[attribute as keyof JsonObjectType];
  for (const [key, value] of Object.entries(fnGetQueryObject)) {
    const childObject = value as JsonObjectType;
    const rawValue: JsonObjectType =
      queryObject[attribute as keyof JsonObjectType];

    const keyValPair = { key, value: rawValue };

    attrValsOfChildren.push(keyValPair);

    console.log(`Key: ${key}, Value: ${JSON.stringify(childObject)}`);
  }

  return {
    error: null,
    value: attrValsOfChildren as Array<{ [key: string]: JsonObjectType }>,
  };
};

export const fnValidPostOrderSids = (): {error: string | null, validSids: string[]} => {
  const validSids: string[] = [];

  const postOrderList = valtioStore.postOrderList;
  for (const cursor of postOrderList) {
    const sid = cursor.split("post.")[1];

    const { error, value } = fnGetQueryAttributeBoolean(sid, KEY_BLOCKED);
    if (error) {
      return { error, validSids };
    }
    if (value === null || value === undefined) {
      validSids.push(sid);
    }
    if (value === false) {
      validSids.push(sid);
    }
  }

  return { error: null, validSids };
};
