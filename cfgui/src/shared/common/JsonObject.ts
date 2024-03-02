import { Str } from "../../components/QnA/defs/types/Str";
import { JsonObjectType } from "../defs/types";

export const fnJsonObjIsArray = (jsonObj: JsonObjectType): { error: Str } => {
  // Check if queryObject is actually an object
  if (
    jsonObj === null ||
    typeof jsonObj !== "object" ||
    typeof jsonObj === "undefined" ||
    typeof jsonObj === "number" ||
    typeof jsonObj === "string" ||
    typeof jsonObj === "boolean" ||
    Array.isArray(jsonObj)
  ) {
    const error = `jsonObj is not a pure object`;
    return { error };
  }
  return { error: null };
};
