import {
  ASIS_post,
  ASIS_pre,
  KEY_KIND,
  KEY_SID,
  OP_BOOL,
  OP_DEC,
  OP_INT,
  OP_LITERAL,
  OP_PICKMANY,
  OP_PICKONE,
  OP_TEXT,
} from "../../shared/defs/constants";
import { JsonObjectType } from "../../shared/defs/types";
import { Str } from "../../typeStr";

export function TreeOrderMgr() {
  const prefixOrderList: string[] = [];
  const postfixOrderList: string[] = [];

  function fnGetPrefixList(
    obj: JsonObjectType,
    indent: number = 0
  ): { error: Str; prefixOrderList: string[] | null } {
    const _fnMakeSidList = (obj: JsonObjectType) => {
      const keys = Object.keys(obj);
      const validSids: string[] = [];
      if (keys.includes(KEY_SID)) {
        for (const [k, v] of Object.entries(obj)) {
          if (
            k === KEY_KIND &&
            (v === OP_TEXT ||
              v === OP_INT ||
              v === OP_DEC ||
              v === OP_BOOL ||
              v === OP_PICKONE ||
              v === OP_PICKMANY)
          ) {
            const sid: string = obj[KEY_SID] as string;
            validSids.push(sid);
          }
        }
      }
      const newSidList: string[] = [];
      if (keys.includes(KEY_SID)) {
        for (const [k, valSid] of Object.entries(obj)) {
          if (k === KEY_SID && typeof valSid === "string") {
            if (validSids.includes(valSid)) {
              const val = `${ASIS_pre}.${valSid}`;
              newSidList.push(val);
            }
          }
        }
      }
      return newSidList;
    };

    const sidList: string[] = _fnMakeSidList(obj);
    prefixOrderList.push(...sidList);
    for (const [key, value] of Object.entries(obj)) {
      // Recursively print nested objects
      if (typeof value === "object" && value !== null) {
        fnGetPrefixList(value as JsonObjectType, indent + 1);
      }
    }
    return { error: null, prefixOrderList };
  }

  function fnGetPostfixList(
    obj: JsonObjectType,
    indent: number = 0
  ): { error: Str; postfixOrderList: string[] | null } {
    for (const [key, value] of Object.entries(obj)) {
      // Recursively print nested objects
      if (typeof value === "object" && value !== null) {
        fnGetPostfixList(value as JsonObjectType, indent + 1);
      }
    }

    const keys = Object.keys(obj);

    if (keys.includes(KEY_SID)) {
      for (const [k, v] of Object.entries(obj)) {
        if (k === KEY_SID && typeof v === "string") {
          const val = `${ASIS_post}.${v}`;
          postfixOrderList.push(val);
        }
      }
    }

    return { error: null, postfixOrderList };
  }

  function fnAddCollectionNameToSid(
    collectionName: string,
    obj: JsonObjectType
  ): { error: Str } {
    const keys = Object.keys(obj);
    if (keys.includes(KEY_SID)) {
      for (const [k, v] of Object.entries(obj)) {
        if (k === KEY_SID && typeof v === "string") {
          obj[k] = `${collectionName}.${v}`;
        }
      }
    }

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object" && value !== null) {
        fnAddCollectionNameToSid(collectionName, value as JsonObjectType);
      }
    }
    return { error: null };
  }

  return {
    fnGetPrefixList,
    fnGetPostfixList,
    fnAddCollectionNameToSid,
  };
}
