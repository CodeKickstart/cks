import { JsonObjectType } from "../../../../shared/defs/types";
import { Str } from "../../defs/types/Str";
import { valtioStore } from "../../defs/types/ValtioTypes";

export function treeShaker(
  queryFragment:
    | string
    | number
    | boolean
    | { [key: string]: JsonObjectType }
    | JsonObjectType[]
    | object[]
    | null
    | undefined
): {
  // fnGetRootNode: (queryFragment: JsonObjectType) => string | null;
  fnGetNextNode: (
    queryFragment: JsonObjectType,
    currentKey: string
  ) => string | null;
  fnReset: () => void;
} {
  interface ObjTemplate {
    [key: string]: JsonObjectType;
  }

  _fnTreeTraverser(queryFragment);

  // function fnGetRootNode(queryFragment: JsonObjectType): string | null {
  //   if (typeof queryFragment === "object" && queryFragment !== null) {
  //     const keys = Object.keys(queryFragment);
  //     return keys.length > 0 ? keys[0] : null;
  //   }
  //   return null;
  // }

  function fnGetNextNode(
    queryFragment: JsonObjectType,
    currentKey: string
  ): string | null {
    if (typeof queryFragment === "object" && queryFragment !== null) {
      const keys = Object.keys(queryFragment);
      const currentIndex = keys.indexOf(currentKey);
      if (currentIndex !== -1 && currentIndex < keys.length - 1) {
        return keys[currentIndex + 1];
      }
    }
    return null;
  }

  function fnReset() {
    valtioStore.dyntree_prev_key = null;
    valtioStore.dyntree_current_key = null;
    valtioStore.dyntree_nextKeyMap = {};
    valtioStore.dyntree_prevKeyMap = {};
  }

  function _fnTreeTraverser(
    queryFragment: JsonObjectType,
    indent: number = 0
  ): { error: Str } {
    try {
      const _fnRecordKey = (key: string) => {
        console.log(`${"  ".repeat(indent)}${key}`);
        valtioStore.dyntree_current_key = key;

        // only add non-null values to the map
        if (
          valtioStore.dyntree_prev_key !== null &&
          valtioStore.dyntree_current_key !== null
        ) {
          valtioStore.dyntree_nextKeyMap[valtioStore.dyntree_prev_key] =
            valtioStore.dyntree_current_key;

          valtioStore.dyntree_prevKeyMap[valtioStore.dyntree_prev_key] =
            valtioStore.dyntree_current_key;
        }
        valtioStore.dyntree_prev_key = valtioStore.dyntree_current_key;
      };

      const queryObj = queryFragment as ObjTemplate;
      const keys = Object.keys(queryObj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        _fnRecordKey(key);
      }

      // Check if queryObj is not empty
      if (keys.length > 0) {
        for (const k in queryObj) {
          if (Object.prototype.hasOwnProperty.call(queryFragment, k)) {
            const value = queryObj[k];
            if (typeof value === "object" && value !== null) {
              const { error } = _fnTreeTraverser(
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

  return { fnReset, fnGetNextNode };
}
