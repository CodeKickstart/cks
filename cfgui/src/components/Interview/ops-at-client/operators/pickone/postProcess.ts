import { KEY_VAL } from "../../../../../shared/defs/constants";
import { fnSetQueryAttribute } from "../../../state-mgt/dataAccess/loLevelAccess";

export const fnPickOnePostForLiteralChildren = (
  parentSid: string,
  parentIndex: number,
  childrenVal: (string | number | boolean)[] | undefined
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
