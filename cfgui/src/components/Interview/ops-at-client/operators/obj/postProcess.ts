import { KEY_VAL } from "../../../../../shared/defs/constants";
import { JsonObjectType } from "../../../../../shared/defs/types";
import { fnSetQueryAttribute } from "../../../state-mgt/dataAccess/loLevelAccess";

export const fnObjPostForLiteralChildren = (
  parentSid: string,
  parentIndices: number[],
  childrenVal: (string | number | boolean)[] | undefined
) => {
  if (childrenVal === undefined) {
    return { error: "No value defined for literal" };
  }

  const parentValues: (string | number | boolean)[] = [];
  for (const index of parentIndices) {
    if (
      index >= childrenVal.length ||
      index < 0 ||
      childrenVal[index] === undefined ||
      childrenVal[index] === null
    ) {
      return { error: "Index out of bounds or no value defined for literal" };
    }
    const parentVal = childrenVal[index];
    if (
      typeof parentVal === "string" ||
      typeof parentVal === "number" ||
      typeof parentVal === "boolean"
    ) {
      parentValues.push(parentVal);
    } else {
      return { error: "Invalid type for parent value" };
    }
  }

  const { error: errorSetValue } = fnSetQueryAttribute(
    parentSid,
    KEY_VAL,
    parentValues
  );
  if (errorSetValue) {
    return { error: errorSetValue };
  }
  return { error: null };
};

export const fnObjPostForGrandchildren = (
  parentSid: string,
  children: object
) => {
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
