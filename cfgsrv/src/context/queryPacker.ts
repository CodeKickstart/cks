import { opsServerMap } from "../ops-at-server/misc/opsServerMap";
import { KEY_ID, KEY_KIND, KEY_SID } from "../shared/defs/constants";
import { JsonObjectType, QueryPack } from "../shared/defs/types";

import { TreeOrderMgr } from "./trees/TreeOrderMgr";
import { Str } from "../defs/types/typeStr";

export const fnPackQuery = (
  collectionName: string,
  queryItem: JsonObjectType
): { error: Str; prepackQuery: QueryPack } => {
  if (typeof queryItem !== "object" || queryItem === null) {
    return {
      error: `collectionName ${collectionName}" is not an object `,
      prepackQuery: null,
    };
  }

  const _fnCheckAttributes = (
    queryItem: JsonObjectType
  ): { error: Str; kind: string } => {
    const keys = Object.keys(queryItem);
    const kind = queryItem[KEY_KIND];
    if (typeof kind !== "string") {
      return {
        error: `collectionName ${collectionName}" contains a non-string "${KEY_KIND}" key `,
        kind: "",
      };
    }

    if (!keys.includes(KEY_ID)) {
      return {
        error: `collectionName ${collectionName}" does not contain a "id" attribute `,
        kind: "",
      };
    }
    if (!keys.includes(KEY_KIND)) {
      return {
        error: `collectionName ${collectionName}" does not contain a "kind" attribute `,
        kind: "",
      };
    }
    if (!keys.includes(KEY_SID)) {
      return {
        error: `collectionName ${collectionName}" does not contain a "SUD" attribute `,
        kind: "",
      };
    }

    // const sid = queryItem[KEY_SID];
    // queryItem[KEY_SID] = `${collectionName}.${sid}`;

    return { error: null, kind: kind };
  };

  const { error: attrError, kind } = _fnCheckAttributes(queryItem);
  if (attrError) {
    return { error: attrError, prepackQuery: null };
  }

  const { fnAddCollectionNameToSid, fnGetPrefixList, fnGetPostfixList } =
    TreeOrderMgr();

  const { error: errInAddingCollectionNameToSid } = fnAddCollectionNameToSid(
    collectionName,
    queryItem
  );
  if (errInAddingCollectionNameToSid) {
    return { error: errInAddingCollectionNameToSid, prepackQuery: null };
  }

  const { error: errorPrefix, prefixOrderList } = fnGetPrefixList(queryItem);
  if (errorPrefix) {
    return { error: errorPrefix, prepackQuery: null };
  }
  // console.log("prefixOrderList", prefixOrderList);

  const { error: errorPostfix, postfixOrderList } = fnGetPostfixList(queryItem);
  if (errorPostfix) {
    return { error: errorPostfix, prepackQuery: null };
  }
  // console.log("postfixOrderList", postfixOrderList);

  const { fnGetOpsMgr } = opsServerMap();
  const opsMgr = fnGetOpsMgr(kind);
  if (!opsMgr) {
    return {
      error: `Query Filename: "${collectionName}", Unknown Kind: "${kind}" `,
      prepackQuery: null,
    };
  }

  const { fnSetup } = opsMgr(queryItem);
  const { error, processedQuery } = fnSetup();
  if (error) {
    return { error, prepackQuery: null };
  }
  if (prefixOrderList === null) {
    return {
      error: `prefixOrderList is null `,
      prepackQuery: null,
    };
  }
  if (postfixOrderList === null) {
    return {
      error: `postfixOrderList is null `,
      prepackQuery: null,
    };
  }

  const prepackQuery = {
    collectionName,
    processedQuery,
    prefixOrderList,
    postfixOrderList,
  };

  return { error: null, prepackQuery };
};
