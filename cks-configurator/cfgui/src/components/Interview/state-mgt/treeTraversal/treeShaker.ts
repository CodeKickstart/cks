import { JsonObjectType } from "../../../../shared/defs/types";
import { Str } from "../../defs/types/Str";

export function preorderTreeMgt(): {
  fnTreeTraverser: (
    queryFragment: JsonObjectType,
    indent?: number
  ) => { error: Str };
} {
  interface ObjTemplate {
    [key: string]: JsonObjectType;
  }

  function fnTreeTraverser(
    queryFragment: JsonObjectType,
    indent: number = 0
  ): { error: Str } {
    try {
      const queryObj = queryFragment as ObjTemplate;
      const keys = Object.keys(queryObj);

      // Print the current node
      console.log(`${"  ".repeat(indent)}${keys[0]}`);

      // Recursively traverse the child nodes
      for (const key of keys) {
        const value = queryObj[key];
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
    } catch (err) {
      const error = err as Error;
      return { error: error.message };
    }

    return { error: null };
  }

  return { fnTreeTraverser };
}
