import { OP_LITERAL } from "../../../../../shared/defs/constants";
import { JsonObjectType } from "../../../../../shared/defs/types";
import { Str } from "../../defs/types/Str";
import { fnUpdateQueryObject } from "../../state-mgt/dataAccess/loLevelAccess";

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

export const fnFindAndStoreSelectablenamesOfChildren = (
  parentQueryObj: JsonObjectType
): { error: Str; namesOfChildren: string[] } => {
  if (Array.isArray(parentQueryObj)) {
    const error = `fnFindAndStoreSelectablenamesOfChildren: parentQueryObj is an array`;
    return { error, namesOfChildren: [] };
  }
  const _fnDestructureJsonObj = (jsonObj: JsonObjectType) => {
    interface ObjTemplate {
      children?: string;
      sid?: string;
    }
    const { children, sid } = jsonObj as ObjTemplate;

    if (
      !children ||
      typeof children !== "object" ||
      !sid ||
      typeof sid !== "string"
    ) {
      return { children: undefined, sid: undefined };
    }
    return { children, sid };
  };

  const { children, sid } = _fnDestructureJsonObj(parentQueryObj);
  if (!children || !sid) {
    const error = `fnFindAndStoreSelectablenamesOfChildren: children or sidCursor is invalid`;
    return { error, namesOfChildren: [] };
  }

  const namesOfChildren = fnFindChildrenNames(children);

  const { error: errorUpdateQueryObject } = fnUpdateQueryObject(sid, {
    namesOfChildren,
  });
  if (errorUpdateQueryObject) {
    return { error: errorUpdateQueryObject, namesOfChildren: [] };
  }

  return { error: null, namesOfChildren };
};
