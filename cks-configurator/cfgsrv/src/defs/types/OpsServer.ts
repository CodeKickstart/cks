import { JsonObjectType } from "../../shared/defs/types";
import { Str } from "./typeStr";

export type OpsServer = (jsonObj: JsonObjectType) => {
  fnSetup: () => {
    error: Str;
    processedQuery: JsonObjectType;
  };
};
