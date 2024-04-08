import { Str } from "../../defs/types/typeStr";

export interface JsonObjectType {
  [key: string]: null | Str | number | boolean | JsonObjectType;
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
