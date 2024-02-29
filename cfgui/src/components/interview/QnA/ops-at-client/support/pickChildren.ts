import { OP_LITERAL } from "../../../../../shared/defs/constants";
import { JsonObjectType } from "../../../../../shared/defs/types";
import { Str } from "../../defs/types/Str";
import { fnUpdateQueryObject } from "../../state-mgt/dataAccess/loLevelAccess";

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

export const fnFindAndStoreSelectableChildNames = (
  parentQueryObj: JsonObjectType
): { error: Str; childNames: string[] } => {
  if (Array.isArray(parentQueryObj)) {
    const error = `fnFindAndStoreSelectableChildNames: parentQueryObj is an array`;
    return { error, childNames: [] };
  }
  let childrenData: string[] = [];

  const { children, sid } = _fnDestructureJsonObj(parentQueryObj);
  if (!children || !sid) {
    const error = `fnFindAndStoreSelectableChildNames: children or sidCursor is invalid`;
    return { error, childNames: [] };
  }

  interface ObjTemplateChildren {
    defval?: { [key: string]: string };
    kind?: string;
  }
  const { kind: childrenKind, defval: childrenDefval } =
    children as ObjTemplateChildren;

  if (childrenKind === OP_LITERAL) {
    if (childrenDefval) {
      childrenData = Object.values(childrenDefval);
    }
  } else {
    childrenData = Object.keys(children);
  }
  const { error: errorUpdateQueryObject } = fnUpdateQueryObject(sid, {
    childNames: childrenData,
  });
  if (errorUpdateQueryObject) {
    return { error: errorUpdateQueryObject, childNames: [] };
  }

  return { error: null, childNames: childrenData };
};
