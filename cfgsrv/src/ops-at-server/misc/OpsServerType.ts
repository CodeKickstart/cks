import { JsonObjectType } from "../../shared/defs/types";
import { Str } from "../../typeStr";

export type OpsServerType = (jsonObj: JsonObjectType) => {
  fnSetup: () => {
    error: Str;
    processedQuery: JsonObjectType;
  };
};
