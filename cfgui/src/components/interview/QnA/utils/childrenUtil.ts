import { OP_LITERAL } from "../../../../shared/defs/constants";
import { JsonObjectType } from "../../../../shared/defs/types";
import { Str } from "../defs/types/Str";
import {
  fnGetQueryObject,
  fnUpdateQueryObject,
} from "../state-mgt/dataAccess/loLevelAccess";

export const fnFindChildrenNames = (jsonObject: JsonObjectType) => {
  let namesOfChildren: string[] = [];

  interface ObjTemplateChildren {
    defval?: { [key: string]: string };
    kind?: string;
  }
  const { kind: childrenKind, defval: childrenDefval } =
    jsonObject as ObjTemplateChildren;

  if (childrenKind === OP_LITERAL) {
    if (childrenDefval) {
      namesOfChildren = Object.values(childrenDefval);
    }
  } else if (jsonObject) {
    namesOfChildren = Object.keys(jsonObject);
  }
  return namesOfChildren;
};

export const fnFindChildrenNamesFromSid = (sid: string) => {
  const { error, queryObject } = fnGetQueryObject(sid);
  if (error) {
    return { error, namesOfChildren: [] };
  }

  const namesOfChildren = fnFindChildrenNames(queryObject);

  return fnFindChildrenNames(namesOfChildren);
};

// Define a generic function that takes a generic type T
export const fnDestructureJsonObj = <T extends Record<string, unknown>>(
  jsonObj: T,
  keyNames: (keyof T)[]
) => {
  const result: Partial<T> = {}; // Use Partial<T> to allow undefined values

  // Iterate through the provided keyNames
  keyNames.forEach((key) => {
    result[key] = jsonObj[key]; // Assign the value from jsonObj to the result object
  });

  return result; // Return the result object
};

export const fnFindAndStoreSelectablenamesOfChildren = (
  parentQueryObj: JsonObjectType
): { error: Str; namesOfChildren: string[] } => {
  if (Array.isArray(parentQueryObj)) {
    const error = `fnFindAndStoreSelectablenamesOfChildren: parentQueryObj is an array`;
    return { error, namesOfChildren: [] };
  }
  const keyNames = ["children", "sid"];

  if (!parentQueryObj || typeof parentQueryObj !== "object") {
    const error = `fnFindAndStoreSelectablenamesOfChildren: parentQueryObj is invalid`;
    return { error, namesOfChildren: [] };
  }
  const { children, sid } = fnDestructureJsonObj(parentQueryObj, keyNames);
  // const { children, sid } = fnDestructureJsonObj(parentQueryObj);
  if (!children || !sid) {
    const error = `fnFindAndStoreSelectablenamesOfChildren: children or sidCursor is invalid`;
    return { error, namesOfChildren: [] };
  }

  const namesOfChildren = fnFindChildrenNames(children);

  if (typeof sid !== "string") {
    const error = `fnFindAndStoreSelectablenamesOfChildren: sid is invalid`;
    return { error, namesOfChildren: [] };
  }

  const { error: errorUpdateQueryObject } = fnUpdateQueryObject(sid, {
    namesOfChildren,
  });
  if (errorUpdateQueryObject) {
    return { error: errorUpdateQueryObject, namesOfChildren: [] };
  }

  return { error: null, namesOfChildren };
};