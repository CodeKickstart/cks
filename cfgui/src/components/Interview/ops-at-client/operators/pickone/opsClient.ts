import { OP_PICKONE } from "../../../../../shared/defs/constants";
import { Str } from "../../../defs/types/Str";

import { fnBypassUserResponses } from "../../../misc/interviewBypass";
import { fnRetrieveQueryObject } from "../../../state-mgt/dataAccess/hiLevelAccess";

import { fnFindAndStoreDescendantNames } from "../../../utils/descendantSearch";

const name = OP_PICKONE;
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
    const { error: errorFinddescendantNames, descendantNames } =
      fnFindAndStoreDescendantNames(queryObject);
    if (errorFinddescendantNames) {
      return { error: errorFinddescendantNames, nextSidCursor: null };
    }
    console.log(`opsClient::${name}:pre descendantNames: ${descendantNames}`);

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
