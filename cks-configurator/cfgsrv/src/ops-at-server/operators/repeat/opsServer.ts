import { fnValidateKeys } from "../../../context/validation/validateKeys";
import { fnValidateValues } from "../../../context/validation/validateValues";
import {
  KEY_COMMENTS,
  KEY_ID,
  KEY_INFO,
  KEY_KIND,
  KEY_CHILDREN,
  KEY_SID,
  KEY_UID,
  KEY_PARENT_UID,
  KEY_BLOCKED,
  KEY_PROMPT,
  KEY_MAX,
  KEY_MIN,
  KEY_OVERRIDE,
} from "../../../shared/defs/constants";
import { JsonObjectType } from "../../../shared/defs/types";
import { Str } from "../../../defs/types/typeStr";
import { OpsServer } from "../../../defs/types/OpsServer";

export const opsServer: OpsServer = (jsonObj: JsonObjectType) => {
  const validAttributes = {
    required: [KEY_KIND, KEY_CHILDREN, KEY_SID, KEY_BLOCKED],
    optional: [
      KEY_ID,
      KEY_INFO,
      KEY_UID,
      KEY_PARENT_UID,
      KEY_PROMPT,
      KEY_MAX,
      KEY_MIN,
      KEY_OVERRIDE,
    ],
  };

  const fnSetup = (): {
    error: Str;
    processedQuery: JsonObjectType;
  } => {
    let error = fnValidateKeys(jsonObj, validAttributes);
    if (error) {
      return { error, processedQuery: {} };
    }

    error = fnValidateValues(jsonObj);
    if (error) {
      return { error, processedQuery: {} };
    }

    const processedQuery = { ...jsonObj };

    return { error: null, processedQuery };
  };

  return { fnSetup };
};
