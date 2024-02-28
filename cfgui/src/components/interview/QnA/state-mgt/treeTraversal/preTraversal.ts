import { JsonObjectType } from "../../../../../shared/defs/types";
import { Str } from "../../defs/types/Str";
import { FnNodeProcessor } from "../treeWorkers/FnNodeProcessor";

export function fnPrefixTraversal<O>(
  fnNodeProcessor: FnNodeProcessor<O[] | O | null>,
  queryContext: JsonObjectType,
  options?: {
    indent?: number;
    matchingKeys?: string[] | null;
    matchingValue?: Str;
  }
): {
  error: Str;
  retList: O[];
} {
  const { indent, matchingKeys, matchingValue } = options || {};
  const accumulator: O[] = [];
  interface ObjTemplate {
    [key: string]: JsonObjectType;
  }

  function _fnRunInfix(
    queryFragment: JsonObjectType,
    indent: number
  ): { error: Str } {
    try {
      const queryObj = queryFragment as ObjTemplate;
      for (const k in queryObj) {
        if (Object.prototype.hasOwnProperty.call(queryFragment, k)) {
          const value = queryObj[k];
          if (typeof value === "object" && value !== null) {
            const { error } = _fnRunInfix(value as JsonObjectType, indent + 1);
            if (error) {
              return { error };
            }
          }
          if (!matchingKeys || (matchingKeys && matchingKeys.includes(k))) {
            if (
              !matchingValue ||
              (matchingValue && matchingValue === (value as string))
            ) {
              const val = value as JsonObjectType;
              const { error, returnObj } = fnNodeProcessor(
                queryFragment,
                k,
                val,
                indent
              );
              if (error) {
                return { error };
              }
              if (returnObj) {
                if (Array.isArray(returnObj)) {
                  for (const obj of returnObj) {
                    accumulator.push(obj);
                  }
                } else {
                  accumulator.push(returnObj);
                }
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
  const { error } = _fnRunInfix(
    queryContext as JsonObjectType,
    indent as number
  );
  return { error, retList: accumulator };
}
