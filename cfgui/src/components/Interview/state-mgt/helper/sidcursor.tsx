import { fnSplitCursor } from "../../misc/strings";
import { fnGetCurrentCursor } from "../cursor/cursor";

export const fnGetSidCursor = () => {
  const cursor = fnGetCurrentCursor();
  if (!cursor) {
    return null;
  }
  const { sidCursor } = fnSplitCursor(cursor);
  return sidCursor;
};
