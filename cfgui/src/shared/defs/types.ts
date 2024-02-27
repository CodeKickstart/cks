export interface JsonObjectType {
  [key: string]: null | string | number | boolean | JsonObjectType;
}

export type AttrsType = {
  required: string[];
  optional: string[];
};

export type QueryBundleType = QueryPack[] | null;

export type QueryPack = {
  collectionName: string;
  processedQuery: JsonObjectType;
  prefixOrderList: string[];
  postfixOrderList: string[];
} | null;
