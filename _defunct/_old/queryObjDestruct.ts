import { JsonObjectType } from "../../cfgui/src/shared/defs/types";

export type QueryObjPartsType = {
  collectionName: string;
  processedQuery: JsonObjectType;
  prefixOrderList: number[];
  postfixOrderList: number[];
};

export const fnDestructureQueryObject = (
  queryObject: JsonObjectType
): { error: Str; queryObjParts: QueryObjPartsType | null } => {
  console.log(queryObject);
  const { collectionName, processedQuery, prefixOrderList, postfixOrderList } =
    queryObject;

  if (typeof collectionName !== "string") {
    return { error: "collectionName must be a string", queryObjParts: null };
  }

  if (typeof processedQuery !== "object") {
    return {
      error: "processedQuery must be an object",
      queryObjParts: null,
    };
  }

  if (
    !Array.isArray(prefixOrderList) ||
    !prefixOrderList.every((item) => typeof item === "number")
  ) {
    return {
      error: "prefixOrderList must be an array of numbers",
      queryObjParts: null,
    };
  }

  if (
    !Array.isArray(postfixOrderList) ||
    !postfixOrderList.every((item) => typeof item === "number")
  ) {
    return {
      error: "postfixOrderList must be an array of numbers",
      queryObjParts: null,
    };
  }

  const prefixOrderListArray = prefixOrderList as number[];
  const postfixOrderListArray = postfixOrderList as number[];

  if (prefixOrderListArray.length !== postfixOrderListArray.length) {
    return {
      error: "prefixOrderList and postfixOrderList must be the same length",
      queryObjParts: null,
    };
  }
  if (prefixOrderListArray.length === 0) {
    return {
      error: "prefixOrderList and postfixOrderList must not be empty",
      queryObjParts: null,
    };
  }
  if (processedQuery === null) {
    return {
      error: "processedQuery must not be null",
      queryObjParts: null,
    };
  }

  const queryObjParts: QueryObjPartsType = {
    collectionName,
    processedQuery,
    prefixOrderList: prefixOrderListArray,
    postfixOrderList: postfixOrderListArray,
  };
  return { error: null, queryObjParts };
};
