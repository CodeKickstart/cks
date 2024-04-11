import { fnReadJsonDirectory } from "./readJsonDirectory";
import { JsonObjectType, QueryBundleType } from "../shared/defs/types";
import { fnPrepareQueriesForContext } from "./queryContextSetup";
import { Str } from "../defs/types/typeStr";
import { fnValidateTreeNodesWithPreTraversal } from "./validation/validateEntireTree";

export const fnFetchRawQuery = (
  directoryPath: string
): { error: string | null; jsonObject: JsonObjectType | null } => {
  try {
    const retJsonData = fnReadJsonDirectory(directoryPath);
    if (retJsonData.error) {
      return {
        error: "error: reading directory",
        jsonObject: null,
      };
    }

    const jsonData = retJsonData.jsonData;

    if (!jsonData) {
      return {
        error: "No JSON data",
        jsonObject: null,
      };
    }

    if (typeof jsonData !== "object") {
      return {
        error: "JSON data is not an object",
        jsonObject: null,
      };
    }
    return { error: null, jsonObject: jsonData };
  } catch (error) {
    return { error: "error fetching data", jsonObject: null };
  }
};

export const fnBundleQuery = (
  directoryPath: string
): {
  error: Str;
  queryBundle: QueryBundleType | string;
} => {
  try {
    const retJsonData = fnReadJsonDirectory(directoryPath);
    if (retJsonData.error) {
      return {
        error: null,
        queryBundle: "error: reading directory",
      };
    }

    const jsonObject = retJsonData.jsonData;

    if (!jsonObject) {
      return {
        error: null,
        queryBundle: "No JSON data",
      };
    }

    if (typeof jsonObject !== "object") {
      return {
        error: null,
        queryBundle: "JSON data is not an object",
      };
    }

    const { error } = fnValidateTreeNodesWithPreTraversal(jsonObject);
    if (error) {
      return { error: null, queryBundle: error };
    }

    const { error: error2, queryBundle } = fnPrepareQueriesForContext(jsonObject);
    if (error2) {
      return { error: null, queryBundle: error2 };
    }

    return { error: null, queryBundle };
  } catch (error) {
    return {
      error: null,
      queryBundle: `error: ${error}`,
    };
  }
};
