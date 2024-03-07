import {
  KEY_CHILDREN,
  KEY_KIND,
  KEY_SID,
  KEY_VAL,
  OP_LITERAL,
} from "../../../../../shared/defs/constants";

import { Str } from "../../../defs/types/Str";
import { fnGetQueryObject } from "../../../state-mgt/dataAccess/loLevelAccess";
import { fnDestructureJsonObj } from "../../../utils/destructureObj";

export const fnPostProcessObj = (sid: string): { error: Str } => {
  const { error, queryObject } = fnGetQueryObject(sid);
  if (error) {
    return { error };
  }
  if (
    !queryObject ||
    typeof queryObject !== "object" ||
    Array.isArray(queryObject)
  ) {
    return { error: `fnPostProcessObj: queryObject is an array` };
  }

  const { children } = fnDestructureJsonObj(queryObject, [KEY_CHILDREN]);
  if (!children) {
    return { error: `fnPostProcessObj: children is invalid` };
  }
  const childrenKeys = Object.keys(children);
  if (childrenKeys.includes(KEY_KIND)) {
    const { childKind, val, childSid } = fnDestructureJsonObj(queryObject, [
      KEY_KIND,
      KEY_VAL,
      KEY_SID,
    ]);
    if (childKind !== OP_LITERAL) {
      if (!val || Array.isArray(val)) {
        const error = `fnPostProcessObj: val is not an array for childSid: ${childSid}`;
        return { error };
      }
      return { error: null };
    } else {
      console.log(`fnPostProcessObj: childKind: ${childKind}`);
    }
  }

  for (const [k, v] of Object.entries(children)) {
    console.log(`fnPostProcessObj: children: ${k} => ${v}`);
    if (k) {
      // return { error: `fnPostProcessObj: children value is not a string` };
    }
  }

  //   const { kind, val} = fnDestructureJsonObj(queryObject, [KEY_KIND, KEY_SID, KEY_CHILDREN]);
  //     if

  return { error: null };
};
