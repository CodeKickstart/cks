import { OP_LITERAL } from "../../../../shared/defs/constants";
import { JsonObjectType } from "../../../../shared/defs/types";
import { Str } from "../defs/types/Str";
import {
  fnGetQueryObject,
  fnUpdateQueryObject,
} from "../state-mgt/dataAccess/loLevelAccess";
import { fnDestructureJsonObj } from "./destructureObj";

export const fnFindChildrenNames = (jsonObject: JsonObjectType) => {
  let descendantNames: string[] = [];

  interface ObjTemplateChildren {
    defval?: { [key: string]: string };
    kind?: string;
  }
  const { kind: childrenKind, defval: childrenDefval } =
    jsonObject as ObjTemplateChildren;

  if (childrenKind === OP_LITERAL) {
    if (childrenDefval) {
      descendantNames = Object.values(childrenDefval);
    }
  } else if (jsonObject) {
    descendantNames = Object.keys(jsonObject);
  }
  return descendantNames;
};

export const fnFindChildrenNamesFromSid = (sid: string) => {
  const { error, queryObject } = fnGetQueryObject(sid);
  if (error) {
    return { error, descendantNames: [] };
  }

  const descendantNames = fnFindChildrenNames(queryObject);

  return fnFindChildrenNames(descendantNames);
};

export const fnFindDescendantNames = (
  queryObj: JsonObjectType
): { error: Str; descendantNames: string[] } => {
  const descendantNames: string[] = [];
  if (Array.isArray(queryObj)) {
    const error = `fnFindAndStoreDescendantNames: parentQueryObj is an array`;
    return { error, descendantNames: [] };
  }
  const keyNames = ["children", "sid"];

  if (!queryObj || typeof queryObj !== "object") {
    const error = `fnFindAndStoreDescendantNames: parentQueryObj is invalid`;
    return { error, descendantNames: [] };
  }
  const { children, sid } = fnDestructureJsonObj(queryObj, keyNames);
  // const { children, sid } = fnDestructureJsonObj(parentQueryObj);
  if (!children || !sid) {
    const error = `fnFindAndStoreDescendantNames: children or sidCursor is invalid`;
    return { error, descendantNames: [] };
  }
  return { error: null, descendantNames };
};

export const fnFindAndStoreDescendantNames = (
  parentQueryObj: JsonObjectType
): { error: Str; descendantNames: string[] } => {
  if (Array.isArray(parentQueryObj)) {
    const error = `fnFindAndStoreDescendantNames: parentQueryObj is an array`;
    return { error, descendantNames: [] };
  }
  const keyNames = ["children", "sid"];

  if (!parentQueryObj || typeof parentQueryObj !== "object") {
    const error = `fnFindAndStoreDescendantNames: parentQueryObj is invalid`;
    return { error, descendantNames: [] };
  }
  const { children, sid } = fnDestructureJsonObj(parentQueryObj, keyNames);
  // const { children, sid } = fnDestructureJsonObj(parentQueryObj);
  if (!children || !sid) {
    const error = `fnFindAndStoreDescendantNames: children or sidCursor is invalid`;
    return { error, descendantNames: [] };
  }

  const descendantNames = fnFindChildrenNames(children);

  if (typeof sid !== "string") {
    const error = `fnFindAndStoreDescendantNames: sid is invalid`;
    return { error, descendantNames: [] };
  }

  const { error: errorUpdateQueryObject } = fnUpdateQueryObject(sid, {
    descendantNames,
  });
  if (errorUpdateQueryObject) {
    return { error: errorUpdateQueryObject, descendantNames: [] };
  }

  return { error: null, descendantNames };
};
