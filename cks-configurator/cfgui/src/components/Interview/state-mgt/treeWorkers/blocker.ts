import { KEY_BLOCKED } from "../../../../shared/defs/constants";
import { JsonObjectType } from "../../../../shared/defs/types";
import { FnNodeProcessor } from "./FnNodeProcessor";

export const fnBlock: FnNodeProcessor<null> = (
  _queryFragment: JsonObjectType, // Update the type of _queryFragment parameter
  key: string,
  value: JsonObjectType
) => {
  console.log(`${key}: ${JSON.stringify(value)}`);

  if (key !== KEY_BLOCKED) {
    return { error: null };
  }

  (_queryFragment as { [key: string]: JsonObjectType })[KEY_BLOCKED] = true;

  return { error: null };
};

export const fnUnblock: FnNodeProcessor<null> = (
  _queryFragment: JsonObjectType, // Update the type of _queryFragment parameter
  key: string,
  value: JsonObjectType
) => {
  console.log(`${key}: ${JSON.stringify(value)}`);

  if (key !== KEY_BLOCKED) {
    return { error: null };
  }

  (_queryFragment as { [key: string]: JsonObjectType })[KEY_BLOCKED] = false;

  return { error: null };
};
