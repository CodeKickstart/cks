import { OP_OBJ } from "../../../../../shared/defs/constants";
import { Str } from "../../../defs/types/Str";
import { fnFindChildrenInfo } from "../_helper/childrenProcessor";
import { fnObjPostForGrandchildren } from "./postProcess";

const name = OP_OBJ;
export const opsClient = () => {
  const fnPreProcess = (
    sidCursor: string
  ): {
    error: Str;
  } => {
    console.log(`opsClient::${name}:pre sidCursor: ${sidCursor}`);

    // const { error } = fnBypassUserResponses(sidCursor);

    return {
      error: null,
    };
  };

  const fnPostProcess = (
    sidCursor: string
  ): {
    error: Str;
  } => {
    const { error: errorDescendantInfo, descendantInfo } =
      fnFindChildrenInfo<number[]>(sidCursor);

    if (errorDescendantInfo) {
      return { error: errorDescendantInfo };
    }
    console.log(`opsClient::${name}:post descendantInfo: ${descendantInfo}`);
    const {
      children,
      childrenSid,
      childrenIndices,
      childrenKind,
      childrenVal,
    } = descendantInfo as {
      children: object;
      childrenSid: string;
      childrenIndices: number[];
      childrenKind: string;
      childrenVal: (string | number | boolean)[] | undefined;
    };

    console.log(
      `fnPostProcessObj: children: ${children} childrenSid: ${childrenSid} childrenIndices: ${childrenIndices} childrenVal: ${childrenVal} childrenKind: ${childrenKind}`
    );

    if (childrenKind !== undefined) {
      const error = "childrenKind should be undefined";
      return { error };
    }
    const { error } = fnObjPostForGrandchildren(childrenSid, children);
    return { error };
  };

  return { fnPreProcess, fnPostProcess };
};
