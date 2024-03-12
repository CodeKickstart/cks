import { JsonObjectType } from "../../shared/defs/types";
import { Str } from "../../typeStr";

export const fnValidateTree = (jsonObj: JsonObjectType): Str => {
  function _fnValidateTree(
    parentKey: string | null,
    parentObj: JsonObjectType
  ): { error: Str } {
    for (const [key, childObj] of Object.entries(parentObj)) {
      if (typeof childObj === "object" && childObj !== null) {
        _fnValidateTree(key, childObj as JsonObjectType);
      }
    }
    return { error: null };
  }

  const { error } = _fnValidateTree(null, jsonObj);
  return error;
};
