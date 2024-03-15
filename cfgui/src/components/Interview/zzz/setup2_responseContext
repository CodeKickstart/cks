import { fnGetAllPostOrderCursors } from "../state-mgt/cursor/cursor";
import { fnDispatchOp } from "../utils/opsDispatcher";

export function fnRunPhase2(): { error: string | null } {
  for (const cursor of fnGetAllPostOrderCursors()) {
    console.log(cursor);
    if (!cursor) {
      return { error: "_fnSetupForResponse: cursor is null" };
    }
    const { error } = fnDispatchOp(cursor);
    if (error) {
      return { error };
    }
  }
  return { error: null };
}
