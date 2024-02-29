import { OP_LITERAL } from "../../../../../shared/defs/constants";
import { JsonObjectType } from "../../../../../shared/defs/types";
import { Str } from "../../defs/types/Str";
import { fnUpdateQueryObject } from "../../state-mgt/dataAccess/loLevelAccess";

export const fnFindChildNames = (
  parentQueryObj: JsonObjectType
): { error: Str; childNames: string[] } => {
  if (Array.isArray(parentQueryObj)) {
    const error = `fnFindChildNames: parentQueryObj is an array`;
    return { error, childNames: [] };
  }
  const childrenData: string[] = [];

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
    const error = `fnFindChildNames: children or sidCursor is invalid`;
    return { error, childNames: [] };
  }

  interface ObjTemplateChildren {
    defval?: { [key: string]: string };
    kind?: string;
    sid?: string;
  }
  const { kind: childrenKind, defval: childrenDefval } =
    children as ObjTemplateChildren;

  if (childrenKind === OP_LITERAL) {
    if (childrenDefval) {
      const { error: errorUpdateQueryObject } = fnUpdateQueryObject(sidCursor, {
        childNames: childrenDefval,
      });
      if (errorUpdateQueryObject) {
        return { error: errorUpdateQueryObject, childNames: [] };
      }
    }
  }

  return { error: null, childNames: childrenData };
};
// Compare this snippet from cfgui/src/components/interview/QnA/state-mgt/dataAccess/loLevelAccess.ts:
