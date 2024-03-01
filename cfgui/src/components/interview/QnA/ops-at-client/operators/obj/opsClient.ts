import { OP_OBJ } from "../../../../../../shared/defs/constants";
import { Str } from "../../../defs/types/Str";

import { fnBypassUserResponses } from "../../../misc/interviewBypass";
import { fnFindChildrenNamesFromSid } from "../../../utils/children";

const name = OP_OBJ;
export const opsClient = () => {
  const fnPreProcess = (
    sidCursor: string
  ): {
    error: Str;
    nextSidCursor: Str;
  } => {
    console.log(`opsClient::${name}:pre sidCursor: ${sidCursor}`);

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
    const descendantNames = fnFindChildrenNamesFromSid(sidCursor);
    console.log(`opsClient::${name}:post descendantNames: ${descendantNames}`);
    return { error: null, nextSidCursor: null };
  };

  return { fnPreProcess, fnPostProcess };
};
