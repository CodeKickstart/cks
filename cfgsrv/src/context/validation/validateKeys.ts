import { JsonObjectType, AttrsType } from "../../shared/defs/types";
import { Str } from "../../defs/types/typeStr";

export const fnValidateKeys = (
  jsonObj: JsonObjectType,
  attributes: AttrsType
): Str => {
  let error = null;

  const { required, optional } = attributes;
  const allAttributes = [...required, ...optional];

  for (const key in jsonObj) {
    if (!allAttributes.includes(key)) {
      error = `Invalid attribute: ${key}`;
      return error;
    }
  }

  const jsonObjKeys = Object.keys(jsonObj);
  for (const key of required) {
    if (!jsonObjKeys.includes(key)) {
      error = `Missing required attribute: ${key}`;
      return error;
    }
  }

  return error;
};
