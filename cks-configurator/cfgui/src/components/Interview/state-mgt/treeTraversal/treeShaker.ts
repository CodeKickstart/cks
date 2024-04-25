import { JsonObjectType } from "../../../../shared/defs/types";
import { Str } from "../../defs/types/Str";

export function treeShaker(): {
  fnTreeTraverser: (
    queryFragment: JsonObjectType,
    indent?: number
  ) => { error: Str };
  fnGetRootNode: (queryFragment: JsonObjectType) => string;
} {
  interface ObjTemplate {
    [key: string]: JsonObjectType;
  }

function fnGetRootNode(queryFragment: JsonObjectType): string {
  if (typeof queryFragment === "object" && queryFragment !== null) {
    const keys = Object.keys(queryFragment);
    return keys.length > 0 ? keys[0] : "";
  }
  return "";
}


  function fnTreeTraverser(
    queryFragment: JsonObjectType,
    indent: number = 0
  ): { error: Str } {
    try {
      const queryObj = queryFragment as ObjTemplate;
      const keys = Object.keys(queryObj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        console.log(`${"  ".repeat(indent)}${key}`);
      }

      // Check if queryObj is not empty
      if (keys.length > 0) {
        for (const k in queryObj) {
          if (Object.prototype.hasOwnProperty.call(queryFragment, k)) {
            const value = queryObj[k];
            if (typeof value === "object" && value !== null) {
              const { error } = fnTreeTraverser(
                value as JsonObjectType,
                indent + 1
              );
              if (error) {
                return { error };
              }
            }
          }
        }
      }
    } catch (err) {
      const error = err as Error;
      return { error: error.message };
    }

    return { error: null };
  }

  return { fnTreeTraverser, fnGetRootNode };
}
