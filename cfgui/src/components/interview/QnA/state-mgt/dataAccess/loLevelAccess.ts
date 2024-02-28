import { KEY_SID } from "../../../../../shared/defs/constants";
import { JsonObjectType } from "../../../../../shared/defs/types";
import { Str } from "../../defs/types/Str";
import { valtioStore } from "../../defs/types/ValtioTypes";
import { fnInfixTraversal } from "../treeTraversal/inTraversal";
import { fnRetrieveQueryFragment } from "../treeWorkers/queryFragment";

// Define a function for error logging
function logError(error: string): void {
  // You can replace this with your preferred logging mechanism,
  // such as logging to a file, sending logs to a logging service, etc.
  console.error(`Error: ${error}`);
}

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
    logError(errOrderSequences); // Log the error
    return { error: errOrderSequences, queryObject: null };
  }
  if (retList.length === 0) {
    const error = `fnGetQueryObject: retList is empty`;
    logError(error); // Log the error
    return { error, queryObject: null };
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
    logError(error); // Log the error
    return { error, value: null };
  }
  if (!queryObject) {
    const error = `fnGetQueryAttribute: queryObject is null`;
    logError(error); // Log the error
    return { error, value: null };
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
    logError(error); // Log the error
    return { error, value: null };
  }
  if (!(typeof value === "string" || value === undefined)) {
    const error = `fnGetQueryAttributeString: ${value} is neither a string nor is it undefined`;
    logError(error); // Log the error
    return { error, value: null };
  }
  return { error: null, value };
};

export const _fnGetQueryAttributeNumber = (
  sidCursor: string,
  attribute: string
): { error: Str; value: number | undefined | null } => {
  const { error, value } = fnGetQueryAttribute(sidCursor, attribute);
  if (error) {
    logError(error); // Log the error
    return { error, value: null };
  }
  if (!(typeof value == "number" || value === undefined)) {
    const error = `fnGetQueryAttributeNumber: ${value} is neither a number nor is it undefined`;
    logError(error); // Log the error
    return { error, value: null };
  }
  return { error: null, value };
};

export const fnGetQueryAttributeInteger = (
  sidCursor: string,
  attribute: string
): { error: Str; value: number | undefined | null } => {
  const { error, value } = _fnGetQueryAttributeNumber(sidCursor, attribute);
  if (error) {
    logError(error); // Log the error
    return { error, value: null };
  }
  if (!(Number.isInteger(value) || value === undefined)) {
    const error = `fnGetQueryAttributeInteger: ${value} is neither an integer nor is undefined`;
    logError(error); // Log the error
    return { error, value: null };
  }
  return { error: null, value };
};

export const fnGetQueryAttributeDec = (
  sidCursor: string,
  attribute: string
): { error: Str; value: number | undefined | null } => {
  const { error, value } = _fnGetQueryAttributeNumber(sidCursor, attribute);
  if (error) {
    logError(error); // Log the error
    return { error, value: null };
  }
  if (!(Number.isFinite(value) || value === undefined)) {
    const error = `fnGetQueryAttributeDec: ${value} is not neither a decimal number or an undefined`;
    logError(error); // Log the error
    return { error, value: null };
  }
  return { error: null, value };
};

export const fnGetQueryAttributeBoolean = (
  sidCursor: string,
  attribute: string
): { error: Str; value: boolean | undefined | null } => {
  const { error, value } = fnGetQueryAttribute(sidCursor, attribute);
  if (error) {
    logError(error); // Log the error
    return { error, value: null };
  }
  if (!(typeof value === "boolean" || value === undefined)) {
    const error = `fnGetQueryAttributeBoolean: ${value} is neither a boolean nor is it undefined`;
    logError(error); // Log the error
    return { error, value: null };
  }
  return { error: null, value };
};

export const fnGetQueryAttributeJsonObject = (
  sidCursor: string,
  attribute: string
): { error: Str; value: JsonObjectType | undefined | null } => {
  const { error, value } = fnGetQueryAttribute(sidCursor, attribute);
  if (error) {
    logError(error); // Log the error
    return { error, value: null };
  }
  if (value === null || !(typeof value === "object" || value === undefined)) {
    const error = `fnGetQueryAttributeJsonObject: ${value} is not a JsonObjectType`;
    logError(error); // Log the error
    return { error, value: null };
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
    logError(error); // Log the error
    return { error };
  }
  if (!queryObject) {
    const error = `fnSetQueryAttribute: queryObject is null`;
    logError(error); // Log the error
    return { error };
  }

  // Check if queryObject is actually an object
  if (
    queryObject === null ||
    typeof queryObject !== "object" ||
    Array.isArray(queryObject)
  ) {
    const error = `fnSetQueryAttribute: queryObject is not an object`;
    logError(error); // Log the error
    return { error };
  }

  // Update queryObject
  queryObject[attribute] = value;

  return { error: null };
};
