import { KEY_VAL } from "../../../../../shared/defs/constants";
import { fnSetQueryAttribute } from "../../../state-mgt/dataAccess/loLevelAccess";

export const fnPostProcPickForLiteralDescendants = (
  parentSid: string,
  parentIndices: number[],
  childrenVal: (string | number | boolean)[] | undefined,
  scalarOutput: boolean
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

  if (scalarOutput === true) {
    if (parentValues.length !== 1) {
      return { error: "Scalar output but multiple values found" };
    }
    const { error: errorSetValue } = fnSetQueryAttribute(
      parentSid,
      KEY_VAL,
      parentValues[0]
    );
    if (errorSetValue) {
      return { error: errorSetValue };
    }
    return { error: null };
  } else {
    const { error: errorSetValue } = fnSetQueryAttribute(
      parentSid,
      KEY_VAL,
      parentValues
    );
    if (errorSetValue) {
      return { error: errorSetValue };
    }
    return { error: null };
  }
};
