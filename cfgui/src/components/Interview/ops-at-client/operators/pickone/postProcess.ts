import { KEY_VAL } from "../../../../../shared/defs/constants";
import { JsonObjectType } from "../../../../../shared/defs/types";
import { fnSetQueryAttribute } from "../../../state-mgt/dataAccess/loLevelAccess";

export const fnProcessLiteralChildren = (
  parentSid: string,
  parentIndex: number,
  childrenVal: string[] | number[] | boolean[] | undefined
) => {
  if (childrenVal === undefined) {
    return { error: "No value defined for literal" };
  }

  const parentVal = childrenVal[parentIndex] as string | number | boolean;

  const { error: errorSetValue } = fnSetQueryAttribute(
    parentSid,
    KEY_VAL,
    parentVal
  );
  if (errorSetValue) {
    return { error: errorSetValue };
  }
  return { error: null };
};

export const fnProcessGrandChildren = (parentSid: string, children: object) => {
  for (const [key, value] of Object.entries(children as object)) {
    interface ObjTemplate {
      blocked?: boolean;
      val?: string | number | boolean | object | null;
    }
    const { blocked, val } = (value || {}) as ObjTemplate;
    if (blocked === false) {
      const newVal = { [key]: val };
      const { error: errorSetValue } = fnSetQueryAttribute(
        parentSid,
        key,
        newVal as JsonObjectType
      );
      if (errorSetValue) {
        return { error: errorSetValue };
      }
    }
  }
  return { error: null };
};
