import { KEY_SID } from "../../../../../shared/defs/constants";
import { JsonObjectType } from "../../../../../shared/defs/types";
import { Str } from "../../defs/types/Str";
import { valtioStore } from "../../defs/types/ValtioTypes";
import { fnInfixTraversal } from "../treeTraversal/inTraversal";
import { fnRetrieveQueryFragment } from "../treeWorkers/queryFragment";

export const fnGetQueryObject = (
  sidCursor: string
): { error: Str; queryObject: JsonObjectType | null } => {
  const { error: errOrderSequences, retList } =
    fnInfixTraversal<JsonObjectType>(
      fnRetrieveQueryFragment,
      valtioStore.queryContext as JsonObjectType,
      {
        matchingKeys: [KEY_SID],
        matchingValue: sidCursor,
      }
    );
  if (errOrderSequences) {
    console.log("navigator", errOrderSequences);
    return { error: errOrderSequences, queryObject: null };
  }
  if (retList.length === 0) {
    return { error: `fnGetQueryObject: retList is empty`, queryObject: null };
  }
  const queryObject = retList[0];
  return { error: null, queryObject };
};

export const fnGetQueryAttribute = (
  sidCursor: string,
  attribute: string
): {
  error: Str;
  value: string | number | boolean | JsonObjectType | null | undefined;
} => {
  const { error, queryObject } = fnGetQueryObject(sidCursor);
  if (error) {
    return { error, value: null };
  }
  if (!queryObject) {
    return { error: `fnGetQueryAttribute: queryObject is null`, value: null };
  }

  const rawValue: JsonObjectType =
    queryObject[attribute as keyof JsonObjectType];

  return { error: null, value: rawValue };
};

export const fnGetQueryAttributeString = (
  sidCursor: string,
  attribute: string
): { error: Str; value: Str | undefined | null } => {
  const { error, value } = fnGetQueryAttribute(sidCursor, attribute);
  if (error) {
    return { error, value: null };
  }
  if (!(typeof value === "string" || value === undefined)) {
    return {
      error: `fnGetQueryAttributeString: ${value} is neither a string nor is it undefined`,
      value: null,
    };
  }
  return { error: null, value };
};

export const _fnGetQueryAttributeNumber = (
  sidCursor: string,
  attribute: string
): { error: Str; value: number | undefined | null } => {
  const { error, value } = fnGetQueryAttribute(sidCursor, attribute);
  if (error) {
    return { error, value: null };
  }
  if (!(typeof value == "number" || value === undefined)) {
    return {
      error: `fnGetQueryAttributeNumber: ${value} is neither a number nor is it undefined`,
      value: null,
    };
  }
  return { error: null, value };
};

export const fnGetQueryAttributeInteger = (
  sidCursor: string,
  attribute: string
): { error: Str; value: number | undefined | null } => {
  const { error, value } = _fnGetQueryAttributeNumber(sidCursor, attribute);
  if (error) {
    return { error, value: null };
  }
  if (!(Number.isInteger(value) || value === undefined)) {
    return {
      error: `fnGetQueryAttributeInteger: ${value} is neither an integer nor is undefined`,
      value: null,
    };
  }
  return { error: null, value };
};

export const fnGetQueryAttributeDec = (
  sidCursor: string,
  attribute: string
): { error: Str; value: number | undefined | null } => {
  const { error, value } = _fnGetQueryAttributeNumber(sidCursor, attribute);
  if (error) {
    return { error, value: null };
  }
  if (!(Number.isFinite(value) || value === undefined)) {
    return {
      error: `fnGetQueryAttributeInteger: ${value} is not neither a decimal number or an undefined`,
      value: null,
    };
  }
  return { error: null, value };
};

export const fnGetQueryAttributeBoolean = (
  sidCursor: string,
  attribute: string
): { error: Str; value: boolean | undefined | null } => {
  const { error, value } = fnGetQueryAttribute(sidCursor, attribute);
  if (error) {
    return { error, value: null };
  }
  if (!(typeof value === "boolean" || value === undefined)) {
    return {
      error: `fnGetQueryAttributeBoolean: ${value} is neither a boolean nor is it undefined`,
      value: null,
    };
  }
  return { error: null, value };
};

export const fnGetQueryAttributeJsonObject = (
  sidCursor: string,
  attribute: string
): { error: Str; value: JsonObjectType | undefined | null } => {
  const { error, value } = fnGetQueryAttribute(sidCursor, attribute);
  if (error) {
    return { error, value: null };
  }
  if (!(typeof value === "object" || value === undefined)) {
    return {
      error: `fnGetQueryAttributeJsonObject: ${value} is not a JsonObjectType`,
      value: null,
    };
  }
  return { error: null, value };
};

export const fnSetQueryAttribute = (
  sidCursor: string,
  attribute: string,
  value: JsonObjectType
): { error: string | null } => {
  const { error, queryObject } = fnGetQueryObject(sidCursor);
  if (error) {
    return { error };
  }
  if (!queryObject) {
    return { error: `fnSetQueryAttribute: queryObject is null` };
  }

  // Check if queryObject is actually an object
  if (typeof queryObject !== "object" || Array.isArray(queryObject)) {
    return { error: `fnSetQueryAttribute: queryObject is not an object` };
  }

  // Update queryObject
  queryObject[attribute] = value;

  return { error: null };
};
