import { fnReadJsonDirectory } from "./readJsonDirectory";
import { QueryBundleType } from "../shared/defs/types";
import { fnPrepareQueriesForContext } from "./queryContextSetup";
import { Str } from "../typeStr";

export function fnBundleQuery(directoryPath: string): {
  error: Str;
  queryBundle: QueryBundleType | string;
} {
  try {
    const retJsonData = fnReadJsonDirectory(directoryPath);
    if (retJsonData.error) {
      return {
        error: null,
        queryBundle: "error: reading directory",
      };
    }

    const jsonData = retJsonData.jsonData;

    if (!jsonData) {
      return {
        error: null,
        queryBundle: "No JSON data",
      };
    }

    if (typeof jsonData !== "object") {
      return {
        error: null,
        queryBundle: "JSON data is not an object",
      };
    }

    const { error: error2, queryBundle } = fnPrepareQueriesForContext(jsonData);
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
}
