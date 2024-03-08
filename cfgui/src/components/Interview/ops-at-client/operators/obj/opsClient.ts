import { OP_LITERAL, OP_OBJ } from "../../../../../shared/defs/constants";
import { Str } from "../../../defs/types/Str";
import { fnFindChildrenInfo } from "../_helper/childrenProcessor";
import {
  fnObjPostForGrandchildren,
  fnObjPostForLiteralChildren,
} from "./postProcess";

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

    if (childrenKind === OP_LITERAL) {
      const { error } = fnObjPostForLiteralChildren(
        childrenSid,
        childrenIndices,
        childrenVal
      );
      return { error };
    } else {
      // pick the only unblocked child
      for (const [key, value] of Object.entries(children as object)) {
        console.log(`fnPostProcessPickOne: children: ${key} => ${value}`);
      }
      const { error } = fnObjPostForGrandchildren(childrenSid, children);
      return { error };
    }

    return { error: null };
  };

  return { fnPreProcess, fnPostProcess };
};
