import { OP_LITERAL } from "../../../../../shared/defs/constants";
import { JsonObjectType } from "../../../../../shared/defs/types";
import { Str } from "../../defs/types/Str";
import { fnUpdateQueryObject } from "../../state-mgt/dataAccess/loLevelAccess";

export const fnFindAndStoreSelectableChildNames = (
  parentQueryObj: JsonObjectType
): { error: Str; childNames: string[] } => {
  if (Array.isArray(parentQueryObj)) {
    const error = `fnFindAndStoreSelectableChildNames: parentQueryObj is an array`;
    return { error, childNames: [] };
  }
  let childrenData: string[] = [];

  interface ObjTemplate {
    children?: string;
    sid?: string;
  }
  const { children, sid: sidCursor } = parentQueryObj as ObjTemplate;

  if (
    !children ||
    typeof children !== "object" ||
    !sidCursor ||
    typeof sidCursor !== "string"
  ) {
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
    if (childrenDefval) {
      const { error: errorUpdateQueryObject } = fnUpdateQueryObject(sidCursor, {
        childNames: childrenData,
      });
      if (errorUpdateQueryObject) {
        return { error: errorUpdateQueryObject, childNames: [] };
      }
    }
  } else {
    childrenData = Object.keys(children);

    const { error: errorUpdateQueryObject } = fnUpdateQueryObject(sidCursor, {
      childNames: childrenData,
    });
    if (errorUpdateQueryObject) {
      return { error: errorUpdateQueryObject, childNames: [] };
    }
  }

  return { error: null, childNames: childrenData };
};
