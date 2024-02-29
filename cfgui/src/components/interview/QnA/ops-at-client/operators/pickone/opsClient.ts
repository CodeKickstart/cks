import { OP_PICKONE } from "../../../../../../shared/defs/constants";
import { Str } from "../../../defs/types/Str";

import { fnBypassUserResponses } from "../../../misc/interviewBypass";
import { fnUpdateQueryObject } from "../../../state-mgt/dataAccess/loLevelAccess";
import { fnRetrieveQueryObject } from "../../../ui-common/_support";

const name = OP_PICKONE;
export const opsClient = () => {
  const fnPreProcess = (
    sidCursor: string
  ): {
    error: Str;
    nextSidCursor: Str;
  } => {
    console.log(`opsClient::${name}:pre sidCursor: ${sidCursor}`);
    const queryObject = fnRetrieveQueryObject();
    if (!queryObject) {
      throw new Error("Failed to retrieve query object");
    }
    interface ObjTemplate {
      children?: string;
    }

    const { children } = queryObject as ObjTemplate;

    interface ObjTemplateChildren {
      kind?: string;
      sid?: string;
    }
    const { kind: childrenKind } = children as ObjTemplateChildren;
    console.log(`opsClient::${name}:pre childrenKind: ${childrenKind}`);

    const names = ["A", "B", "C"];
    const { error: errorUpdateQueryObject } = fnUpdateQueryObject(sidCursor, {
      names: names,
    });
    if (errorUpdateQueryObject) {
      return { error: errorUpdateQueryObject, nextSidCursor: null };
    }

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
    return { error: null, nextSidCursor: null }; // Provide a default value for queryObject if necessary
  };

  return { fnPreProcess, fnPostProcess };
};
