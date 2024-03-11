import { Str } from "./Str";

export type OpsClient = () => {
  fnPreProcess: (sidCursor: string) => {
    error: Str;
  };
  fnPostProcess: (sidCursor: string) => {
    error: Str;
  };
};

export type OpsDictionary<K extends string> = {
  [key in K]: OpsClient;
};
