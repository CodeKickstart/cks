import {
  KEY_CHILDREN,
  KEY_CONTENT,
  KEY_KIND,
} from "../../shared/defs/constants";
import { JsonObjectType } from "../../shared/defs/types";
import { Str } from "../../typeStr";

export const fnValidateTreeNodesWithPreTraversal = (
  jsonObj: JsonObjectType
): { error: Str } => {
  function _fnValidateTree(
    parentKey: string | null,
    parentObj: JsonObjectType
  ): { error: Str } {
    // if (parentKey === KEY_CHILDREN && !Array.isArray(parentObj)) {
    //   return { error: `Children must be an array` };
    // }
    const allKeys = Object.keys(parentObj);
    if (allKeys.includes(KEY_CHILDREN) && !allKeys.includes(KEY_KIND)) {
      return {
        error: `Cannot have a "children" key without a key named "kind"`,
      };
    }
    for (const [keyChild, childObj] of Object.entries(parentObj)) {
      // if (
      //   parentKey !== null &&
      //   parentKey !== KEY_CHILDREN &&
      //   key !== KEY_CHILDREN &&
      //   parentKey !== KEY_CONTENT &&
      //   key !== KEY_CONTENT
      // ) {
      //   return {
      //     error: `Cannot have a "non-children" node under a "non-children" node`,
      //   };
      // }
      if (typeof childObj === "object" && childObj !== null) {
        _fnValidateTree(keyChild, childObj as JsonObjectType);
      }
    }
    return { error: null };
  }

  const { error } = _fnValidateTree(null, jsonObj);
  return { error };
};
