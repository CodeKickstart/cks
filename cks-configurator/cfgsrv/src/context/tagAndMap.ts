import {
  KEY_BLOCKED,
  KEY_ID,
  KEY_KIND,
  KEY_PARENT_UID,
  KEY_SID,
  KEY_UID,
} from "../shared/defs/constants";
import { JsonObjectType } from "../shared/defs/types";
import { Str } from "../defs/types/typeStr";

export function fnTag(rootObj: JsonObjectType) {
  let sidCount = 0;
  let uidCount = 0;

  function _fnTagQueries(
    currentObj: JsonObjectType,
    parentObj: JsonObjectType | null = null
  ): {
    error: Str;
    processedQueries: JsonObjectType;
  } {
    let keys = Object.keys(currentObj);
    if (keys.includes(KEY_KIND)) {
      // tag with uid
      currentObj[KEY_UID] = uidCount;
      // objDict[uidCount] = currentObj;
      uidCount++;

      // tag with puid
      if (
        parentObj !== null &&
        parentObj[KEY_UID] !== null &&
        typeof parentObj[KEY_UID] === "number"
      ) {
        const parent_uid = parentObj[KEY_UID];
        currentObj[KEY_PARENT_UID] = parent_uid;
      }

      // tag with sid
      currentObj[KEY_SID] = sidCount.toString();
      sidCount++;
    }

    let aggregatedQueries: JsonObjectType = {};
    for (const key in currentObj) {
      if (currentObj.hasOwnProperty(key)) {
        const thisObject = currentObj[key];
        if (typeof thisObject === "object" && thisObject !== null) {
          // does currentObj have the kind key?
          // if it does, then use the currentObj as the parentObj
          // if it doesn't, then use the parentObj as the parentObj
          let parentObjToUse = parentObj;
          if (keys.includes(KEY_KIND)) {
            parentObjToUse = currentObj;
          }

          const { error } = _fnTagQueries(
            thisObject as JsonObjectType,
            parentObjToUse
          );
          if (error) {
            return { error, processedQueries: {} };
          }
        }
      }
    }
    aggregatedQueries = {
      ...aggregatedQueries,
      ...currentObj,
    };
    return { error: null, processedQueries: aggregatedQueries };
  }

  let currentBaseId = "";
  function _fnPrefixTagWithBaseID(
    currentObj: JsonObjectType,
    parentObj: JsonObjectType | null = null
  ): {
    error: Str;
    processedQueries: JsonObjectType;
  } {
    let keys = Object.keys(currentObj);
    if (keys.includes(KEY_KIND)) {
      // is there a key KEY_PARENT_UID in currentObj?
      if (
        !keys.includes(KEY_PARENT_UID) &&
        keys.includes(KEY_ID) &&
        currentObj[KEY_ID]
      ) {
        currentBaseId = currentObj[KEY_ID].toString();
      }

      currentObj[KEY_BLOCKED] = false;
    }
    if (keys.includes(KEY_SID)) {
      currentObj[KEY_SID] = `${currentBaseId}.${currentObj[KEY_SID]}`;
    }

    if (parentObj === null) {
      // deep copy the currentObj
      parentObj = JSON.parse(JSON.stringify(currentObj));
    }

    let aggregatedQueries: JsonObjectType = {};
    for (const key in currentObj) {
      if (currentObj.hasOwnProperty(key)) {
        const thisObject = currentObj[key];
        if (typeof thisObject === "object" && thisObject !== null) {
          const { error } = _fnPrefixTagWithBaseID(
            thisObject as JsonObjectType,
            currentObj
          );
          if (error) {
            return { error, processedQueries: {} };
          }
        }
      }
    }
    aggregatedQueries = {
      ...aggregatedQueries,
      ...currentObj,
    };

    return { error: null, processedQueries: aggregatedQueries };
  }

  const rootObjCopy = JSON.parse(JSON.stringify(rootObj));
  let { error, processedQueries } = _fnTagQueries(rootObjCopy);
  if (error) {
    return { error, processedQueries: {} };
  }
  if (processedQueries === null) {
    return { error: "processedQueries is null", processedQueries: {} };
  }

  ({ error, processedQueries } = _fnPrefixTagWithBaseID(processedQueries));

  return { error, processedQueries };
}
