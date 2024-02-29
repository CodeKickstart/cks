import { OP_PICKMANY } from "../../../../../../shared/defs/constants";
import { Str } from "../../../defs/types/Str";

import { fnBypassUserResponses } from "../../../misc/interviewBypass";
import { fnRetrieveQueryObject } from "../../../ui-common/_support";
import { fnFindAndStoreSelectablenamesOfChildren } from "../../support/childrenUtil";

const name = OP_PICKMANY;
export const opsClient = () => {
  const fnPreProcess = (
    sidCursor: string
  ): {
    error: Str;
    nextSidCursor: Str;
  } => {
    const queryObject = fnRetrieveQueryObject();
    if (!queryObject) {
      throw new Error("Failed to retrieve query object");
    }
    const { error: errorFindnamesOfChildren, namesOfChildren } =
      fnFindAndStoreSelectablenamesOfChildren(queryObject);
    if (errorFindnamesOfChildren) {
      return { error: errorFindnamesOfChildren, nextSidCursor: null };
    }
    console.log(`opsClient::${name}:pre namesOfChildren: ${namesOfChildren}`);

    const { error, nextSidCursor } = fnBypassUserResponses(sidCursor);

    return {
      error,
      nextSidCursor,
    };
  };

  const fnPostProcess = (
    sidCursor: string
  ): {
    error: Str;
    nextSidCursor: Str;
  } => {
    console.log(`opsClient::${name}:post sidCursor: ${sidCursor}`);
    return { error: null, nextSidCursor: null };
  };

  return { fnPreProcess, fnPostProcess };
};
