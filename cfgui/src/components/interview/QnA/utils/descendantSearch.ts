import { JsonObjectType } from "../../../../shared/defs/types";
import { Str } from "../defs/types/Str";
import { fnUpdateQueryObject } from "../state-mgt/dataAccess/loLevelAccess";
import { fnFindChildrenNames } from "./children";
import { fnDestructureJsonObj } from "./destructureObj";

export const fnFindDescendantNames = (
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
  return { error: null, descendantNames };
};

export const fnFindAndStoreDescendantNames = (
  parentQueryObj: JsonObjectType
): { error: Str; descendantNames: string[] } => {
  if (
    parentQueryObj === null ||
    typeof parentQueryObj !== "object" ||
    Array.isArray(parentQueryObj)
  ) {
    return { error: "Invalid parent query object", descendantNames: [] };
  }

  const { error, descendantNames } = fnFindDescendantNames(parentQueryObj);
  if (error) {
    return { error, descendantNames: [] };
  }
  const { sid } = fnDestructureJsonObj(parentQueryObj, ["sid"]);
  if (typeof sid !== "string") {
    return { error: "Invalid sid", descendantNames: [] };
  }

  const { error: errorUpdateQueryObject } = fnUpdateQueryObject(sid, {
    descendantNames,
  });
  if (errorUpdateQueryObject) {
    return { error: errorUpdateQueryObject, descendantNames: [] };
  }

  return { error: null, descendantNames };
};
