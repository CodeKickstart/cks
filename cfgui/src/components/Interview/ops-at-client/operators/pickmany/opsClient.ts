import { OP_PICKMANY } from "../../../../../shared/defs/constants";
import { Str } from "../../../defs/types/Str";

import { fnGetQueryObject } from "../../../state-mgt/dataAccess/loLevelAccess";

import { fnFindAndStoreDescendantNames } from "../../../utils/descendantSearch";

const name = OP_PICKMANY;
export const opsClient = () => {
  const fnPreProcess = (
    sidCursor: string
  ): {
    error: Str;
    nextSidCursor: Str;
  } => {
    const { error: errorQuery, queryObject } = fnGetQueryObject(sidCursor);
    if (errorQuery) {
      return { error: errorQuery, nextSidCursor: null };
    }

    const { error: errorFinddescendantNames, descendantNames } =
      fnFindAndStoreDescendantNames(queryObject);
    if (errorFinddescendantNames) {
      return { error: errorFinddescendantNames, nextSidCursor: null };
    }
    console.log(`opsClient::${name}:pre descendantNames: ${descendantNames}`);

    return {
      error: null,
      nextSidCursor: null,
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
