import { Str } from "./Str";

export type OpsClient = () => {
  fnPreProcess: (sidCursor: string) => {
    error: Str;
    nextSidCursor: Str;
  };
  fnPostProcess: (sidCursor: string) => {
    error: Str;
    nextSidCursor: Str;
  };
};

export type OpsDictionary<K extends string> = {
  [key in K]: OpsClient;
};
