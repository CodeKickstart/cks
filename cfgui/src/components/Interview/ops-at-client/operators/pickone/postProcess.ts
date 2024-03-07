import { KEY_VAL } from "../../../../../shared/defs/constants";
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

export const fnProcessGrandChildren = (children: object) => {
  for (const [key, value] of Object.entries(children as object)) {
    console.log(`fnPostProcessPickOne: children: ${key} => ${value}`);
  }
  return { error: null };
};
