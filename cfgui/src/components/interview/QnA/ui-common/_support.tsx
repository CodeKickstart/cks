import { fnSplitCursor } from "../misc/strings";
import { fnGetCurrentCursor } from "../state-mgt/cursor/cursor";
import { fnGetQueryObject } from "../state-mgt/dataAccess/loLevelAccess";

export const fnRetrieveQueryObject = () => {
  const cursor = fnGetCurrentCursor();
  if (!cursor) {
    return null;
  }
  const { sidCursor } = fnSplitCursor(cursor);
  const { error, queryObject } = fnGetQueryObject(sidCursor);
  if (error) {
    console.log(error);
    return null;
  }
  if (!queryObject) {
    return null;
  }
  return queryObject;
};
