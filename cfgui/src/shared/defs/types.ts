export type Primitive = null | string | number | boolean;
export type JsonObjectType =
  | null
  | undefined
  | { [key: string]: JsonObjectType }
  | Primitive
  | JsonObjectType[]
  | Primitive[]
  | object[];

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
