import { fnReadJsonDirectory } from "./readJsonDirectory";
import { QueryBundleType } from "../shared/defs/types";
import { fnPrepareQueriesForContext } from "./queryContextSetup";
import { Str } from "../typeStr";

export function fnBundleQuery(directoryPath: string): {
  error: Str;
  queryBundle: QueryBundleType | null;
} {
  try {
    const retJsonData = fnReadJsonDirectory(directoryPath);
    if (retJsonData.error) {
      return {
        error: "error: reading directory",
        queryBundle: null,
      };
    }

    const jsonData = retJsonData.jsonData;

    if (!jsonData) {
      return {
        error: "No JSON data",
        queryBundle: null,
      };
    }

    if (typeof jsonData !== "object") {
      return {
        error: "JSON data is not an object",
        queryBundle: null,
      };
    }

    const { error: error2, queryBundle } = fnPrepareQueriesForContext(jsonData);
    if (error2) {
      return { error: error2, queryBundle: null };
    }

    return { error: null, queryBundle };
  } catch (error) {
    return {
      error: `error: ${error}`,
      queryBundle: null,
    };
  }
}
