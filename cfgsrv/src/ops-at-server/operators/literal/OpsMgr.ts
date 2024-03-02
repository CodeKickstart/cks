import { fnValidateKeys } from "../../../context/validation/validateKeys";
import { fnValidateValues } from "../../../context/validation/validateValues";
import {
  KEY_COMMENTS,
  KEY_ID,
  KEY_INFO,
  KEY_KIND,
  KEY_DEFVAL,
  KEY_PROMPT,
  KEY_SID,
  KEY_UID,
  KEY_PARENT_UID,
  KEY_BLOCKED,
} from "../../../shared/defs/constants";
import { JsonObjectType } from "../../../shared/defs/types";
import { Str } from "../../../typeStr";
import { OpsServerType } from "../../misc/OpsServerType";

export const OpsMgr: OpsServerType = (jsonObj: JsonObjectType) => {
  const validAttributes = {
    required: [KEY_KIND, KEY_SID, KEY_BLOCKED],
    optional: [
      KEY_ID,
      KEY_DEFVAL,
      KEY_PROMPT,
      KEY_INFO,
      KEY_COMMENTS,
      KEY_UID,
      KEY_PARENT_UID,
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
