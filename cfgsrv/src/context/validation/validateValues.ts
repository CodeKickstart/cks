import {
  isArrayOfIntegers,
  isArrayOfStrings,
  isBoolean,
  isFloat,
  isInteger,
  isString,
} from "../../shared/common/checkTypes";
import {
  KEY_CHILDREN,
  KEY_ID,
  KEY_KIND,
  KEY_PROMPT,
  KEY_SID,
  KEY_COMMENTS,
  KEY_INFO,
  KEY_OVERRIDE,
  KEY_DPICK,
  KEY_DEFVAL,
  KEY_MAX,
  KEY_MIN,
  OP_DEC,
  OP_INT,
  OP_TEXT,
  OP_BOOLEAN,
  OP_LITERAL,
  OP_PICKMANY,
  OP_PICKONE,
  KEY_UID,
} from "../../shared/defs/constants";
import { JsonObjectType } from "../../shared/defs/types";
import { Str } from "../../typeStr";

export const fnValidateValues = (jsonObj: JsonObjectType): Str => {
  function _fnGenerateError(kind: string, sidStr: string, key: string) {
    return `Invalid value for key: ${key} for kind: ${kind} and sid: ${sidStr}`;
  }

  function _fnCheckLiteral(
    kind: string,
    key: string,
    sidStr: string,
    val: any
  ) {
    let error = null;
    if (val === null || val === undefined) {
      error = `Invalid "literal" value for key: ${key}`;
      return error;
    }

    return error;
  }

  function _fnCheckLimit(kind: string, key: string, sidStr: string, val: any) {
    let error = null;

    switch (kind) {
      case OP_DEC:
        if (!isFloat(val)) {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
        break;
      case OP_INT:
        if (!isInteger(val)) {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
        break;
      case OP_TEXT:
        if (!isString(val)) {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
        break;
      case OP_BOOLEAN:
        if (!isBoolean(val)) {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
        break;
    }
    return error;
  }

  function _fnCheckDval(kind: string, key: string, sidStr: string, val: any) {
    let error = null;

    switch (kind) {
      case OP_DEC:
        if (!isFloat(val)) {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
        break;
      case OP_INT:
        if (!isInteger(val)) {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
        break;
      case OP_TEXT:
        if (!isString(val)) {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
        break;
      case OP_BOOLEAN:
        if (!isBoolean(val)) {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
        break;
      case OP_LITERAL:
        if (_fnCheckLiteral(kind, key, sidStr, val)) {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
        break;
    }
    return error;
  }

  function _fnCheckDpick(kind: string, key: string, sidStr: string, val: any) {
    let error = null;

    console.log(`_fnCheckDpick: ${kind}, ${key}, ${sidStr}, ${val}`);

    switch (kind) {
      case OP_PICKMANY:
        if (!isArrayOfIntegers(val) && !isArrayOfStrings(val)) {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
        break;
      case OP_PICKONE:
        if (!isInteger(val) && !isString(val)) {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
    }
    return error;
  }

  function _fnCheckOverride(
    kind: string,
    key: string,
    sidStr: string,
    val: any
  ) {
    let error = null;

    error = _fnCheckDval(kind, key, sidStr, val);
    if (error) {
      return error;
    }
    error = _fnCheckDpick(kind, key, sidStr, val);
    return error;
  }

  let error = null;

  const kind = jsonObj[KEY_KIND]?.toString();
  if (typeof kind !== "string") {
    error = `Invalid "kind" value for key: ${KEY_KIND}`;
    return error;
  }
  const sidStr = jsonObj[KEY_SID]?.toString();
  if (typeof sidStr !== "string") {
    error = `Invalid "sid string" value for key: ${KEY_SID}`;
    return error;
  }

  for (const [key, val] of Object.entries(jsonObj)) {
    if (val === null || val === undefined) {
      error = `Invalid "general" value for key: ${key}`;
      return error;
    }
    // if (typeof val === "object") {
    //   error = `Invalid "children" value for key: ${key}`;
    //   return error;
    // }
    switch (key) {
      case KEY_ID:
        if (typeof val !== "string") {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
        break;
      case KEY_INFO:
        if (typeof val !== "string") {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
        break;
      case KEY_COMMENTS:
        if (typeof val !== "string") {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
        break;
      case KEY_PROMPT:
        if (typeof val !== "string") {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
        break;
      case KEY_CHILDREN:
        if (typeof val !== "object") {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
        break;
      case KEY_SID:
        if (typeof val !== "string") {
          error = _fnGenerateError(kind, sidStr, key);
          return error;
        }
        break;
      case KEY_OVERRIDE:
        error = _fnCheckOverride(kind, key, sidStr, val);
        if (error) {
          return error;
        }
        break;
      case KEY_DPICK:
        error = _fnCheckDpick(kind, key, sidStr, val);
        if (error) {
          return error;
        }
        break;
      case KEY_DEFVAL:
        error = _fnCheckDval(kind, key, sidStr, val);
        break;
      case KEY_MAX:
        error = _fnCheckLimit(kind, key, sidStr, val);
        break;
      case KEY_MIN:
        error = _fnCheckLimit(kind, key, sidStr, val);
        break;

      case KEY_KIND:
        break;

      case KEY_UID:
        break;

      default:
        const warning = `Warning "default" key: ${key}, kind: ${kind}, sid: ${sidStr}`;
        console.log(warning);
        break;
    }
  }

  return error;
};
