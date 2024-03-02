import { OP_LITERAL } from "../../../shared/defs/constants";
import { JsonObjectType } from "../../../shared/defs/types";
import { fnGetQueryObject } from "../state-mgt/dataAccess/loLevelAccess";

export const fnFindChildrenNames = (jsonObject: JsonObjectType) => {
  let childrenNames: string[] = [];

  interface ObjTemplateChildren {
    override?: { [key: string]: string };
    kind?: string;
  }
  const { kind: childrenKind, override: childrenOverride } =
    jsonObject as ObjTemplateChildren;

  if (childrenKind === OP_LITERAL) {
    if (childrenOverride) {
      childrenNames = Object.values(childrenOverride);
    }
  } else if (jsonObject) {
    childrenNames = Object.keys(jsonObject);
  }
  return childrenNames;
};

export const fnFindChildrenNamesFromSid = (sid: string) => {
  const { error, queryObject } = fnGetQueryObject(sid);
  if (error) {
    return { error, childrenNames: [] };
  }

  const descendantNames = fnFindChildrenNames(queryObject);

  return fnFindChildrenNames(descendantNames);
};
