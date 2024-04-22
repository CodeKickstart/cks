import {
  KEY_BLOCKED,
  KEY_CHILDREN,
  KEY_COMMENTS,
  KEY_CONTENT,
  KEY_DEFVAL,
  KEY_DPICK,
  KEY_ID,
  KEY_INFO,
  KEY_KIND,
  KEY_MAX,
  KEY_MIN,
  KEY_OVERRIDE,
  KEY_PARENT_UID,
  KEY_PROMPT,
  KEY_SID,
  KEY_VAL,
} from "../../shared/defs/constants";
import { JsonObjectType } from "../../shared/defs/types";
import { Str } from "../../defs/types/typeStr";

export const fnValidateTreeNodesWithPreTraversal = (
  jsonObj: JsonObjectType
): { error: Str } => {
  const _fnIsKeyCustom = (key: string): boolean => {
    const regularKeys = [
      KEY_CHILDREN,
      KEY_CONTENT,
      KEY_KIND,
      KEY_DEFVAL,
      KEY_ID,
      KEY_SID,
      KEY_BLOCKED,
      KEY_COMMENTS,
      KEY_DPICK,
      KEY_INFO,
      KEY_PARENT_UID,
      KEY_PROMPT,
      KEY_MAX,
      KEY_MIN,
      KEY_VAL,
      KEY_OVERRIDE,
    ];
    if (regularKeys.includes(key)) {
      return false;
    }
    return true;
  };
  function _fnValidateTree(
    key: string | null,
    parentKey: string | null,
    obj: JsonObjectType
  ): { error: Str } {
    if (
      key !== null &&
      _fnIsKeyCustom(key) &&
      parentKey !== null &&
      _fnIsKeyCustom(parentKey)
    ) {
      return {
        error: `Cannot have a custom node (${key}) under another custom node (${parentKey})`
      };
    }
    const allKeys = Object.keys(obj);
    if (allKeys.includes(KEY_CHILDREN) && !allKeys.includes(KEY_KIND)) {
      return {
        error: `Cannot have a "children" key without a key named "kind"`,
      };
    }
    for (const [keyChild, childObj] of Object.entries(obj)) {
      if (typeof childObj === "object" && childObj !== null) {
        return _fnValidateTree(keyChild, key, childObj as JsonObjectType);
      }
    }
    return { error: null };
  }

  const { error } = _fnValidateTree(null, null, jsonObj);
  return { error };
};
