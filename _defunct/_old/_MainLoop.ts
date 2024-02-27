import { JsonObjectType } from "../../cfgui/src/shared/defs/types";
import { ContextCursor } from "./cursor/ContextCursor";
import { fnConvertToArray } from "../../cfgui/src/components/interview/QnA/misc/jsonObjOrganizer";
import { fnDestructureQueryObject } from "./queryObjDestruct";

export function _MainLoop(queryTree: JsonObjectType | null) {
  if (!queryTree) {
    throw new Error("queryTree is null");
  }
  const queryArray = fnConvertToArray(queryTree);

  const fnExecuteLoop = function* (): Generator<object, void, unknown> {
    for (const queryObject of queryArray) {
      if (queryObject && typeof queryObject !== "object") {
        throw new Error("queryObject must be an object");
      }
      const { error, queryObjParts } = fnDestructureQueryObject(queryObject);
      if (error) {
        throw new Error(error);
      }
      if (!queryObjParts) {
        throw new Error("queryObjParts is null");
      }

      const collectionName = queryObjParts.collectionName;
      if (!collectionName) {
        throw new Error("collectionName is null");
      }

      const { fnInitCursor, fnMoveCursor } = ContextCursor(queryObjParts);

      let { isDone, cursor } = fnInitCursor();
      console.log("cursor", cursor);
      while (!isDone) {
        const processedQuery = queryObjParts.processedQuery;
        if (!processedQuery) {
          throw new Error("processedQuery is null");
        }

        const moveResults = fnMoveCursor();
        isDone = moveResults.isDone;
        cursor = moveResults.cursor;
        console.log("cursor", cursor);

        const response: JsonObjectType = processedQuery;
        yield response;
      }
    }
  };

  return fnExecuteLoop;
}
