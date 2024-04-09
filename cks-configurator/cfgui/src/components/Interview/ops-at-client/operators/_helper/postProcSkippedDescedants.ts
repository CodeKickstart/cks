import { KEY_VAL } from "../../../../../shared/defs/constants";
import { JsonObjectType } from "../../../../../shared/defs/types";
import { fnSetQueryAttribute } from "../../../state-mgt/dataAccess/loLevelAccess";

export const fnPostProcPickForSkippedDescendants = (
  parentSid: string,
  children: object
) => {
  const obj: { [key: string]: unknown } = {};
  for (const [key, value] of Object.entries(children as object)) {
    interface ObjTemplate {
      blocked?: boolean;
      val?: string | number | boolean | object | null;
    }
    const { blocked, val } = (value || {}) as ObjTemplate;
    if (blocked === false && key) {
      obj[key] = val;
    }
  }
  const { error: errorSetValue } = fnSetQueryAttribute(
    parentSid,
    KEY_VAL,
    obj as JsonObjectType
  );
  if (errorSetValue) {
    return { error: errorSetValue };
  }
  return { error: null };
};
