// import { KIND_ERROR } from "../defs/constants/ComponentNames";
// import { valtioStore } from "../defs/types/ValtioTypes";
import { fnDispatchOp } from "../utils/opsDispatcher";
import { fnGetAllPostOrderCursors } from "./cursor/cursor";

export function fnRunZZZ1(): { error: string | null } {
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

export function fnRunZZZ2(): { error: string | null } {
  console.log("fnRunZZZ2");
  return { error: null };
}

export function fnRunZZZ3(): { error: string | null } {
  console.log("fnRunZZZ3");
  return { error: null };
}
