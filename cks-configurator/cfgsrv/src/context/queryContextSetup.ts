import { fnTag } from "./tagAndMap";
import { KEY_CONTENT } from "../shared/defs/constants";
import {
  JsonObjectType,
  QueryBundleType,
  QueryPack,
} from "../shared/defs/types";
import { fnPackQuery } from "./queryPacker";
import { Str } from "../defs/types/typeStr";

export const fnPrepareQueriesForContext = (
  queries: JsonObjectType
): {
  error: Str;
  queryBundle: QueryBundleType;
} => {
  const { error: tagError, processedQueries } = fnTag(queries);
  if (tagError) {
    return { error: tagError, queryBundle: null };
  }

  let queryBundle: QueryBundleType = [];

  for (const [collectionName, queryCollection] of Object.entries(
    processedQueries
  )) {
    if (queryCollection === null || queryCollection === undefined) {
      return {
        error: `Query File: "${collectionName}",  is null `,
        queryBundle: null,
      };
    }
    const processedQueryPackCollection: QueryPack[] = [];
    for (const [keyContent, queryList] of Object.entries(queryCollection)) {
      if (keyContent !== KEY_CONTENT) {
        return {
          error: `Query File: "${collectionName}", ${keyContent} is a disallowed key `,
          queryBundle: null,
        };
      }
      // if number of keys is not 1, then error
      if (Object.keys(queryCollection).length !== 1) {
        return {
          error: `collectionName "${collectionName}" contains more than one key `,
          queryBundle: null,
        };
      }
      if (!Array.isArray(queryList)) {
        return {
          error: `collectionName "${collectionName}" is not an array `,
          queryBundle: null,
        };
      }

      for (const queryItem of queryList) {
        const { error, prepackQuery } = fnPackQuery(collectionName, queryItem);
        if (error) {
          return { error, queryBundle: null };
        }
        if (prepackQuery === null) {
          return {
            error: `prepackQuery is null `,
            queryBundle: null,
          };
        }

        processedQueryPackCollection.push(prepackQuery);
      }
      // skip collection here as there is only one key named "__CONTENT"
    }
    if (processedQueryPackCollection !== null) {
      queryBundle.push(...processedQueryPackCollection);
    }
  }
  return { error: null, queryBundle };
};
