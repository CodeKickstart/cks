import { Str } from "../../defs/types/Str";
import { valtioStore } from "../../defs/types/ValtioTypes";
import { fnValidPostOrderSids } from "../dataAccess/hiLevelAccess";

// returns cursor - null if no more questions
export const fnCursorMoveForward = (): { cursor: string | null } => {
  if (valtioStore.currentIndex === null) {
    return { cursor: null };
  }

  valtioStore.currentIndex = valtioStore.currentIndex + 1;
  if (valtioStore.currentIndex > valtioStore.maxOrderIndex) {
    return { cursor: null };
  }

  const cursor = valtioStore.preOrderList[valtioStore.currentIndex];

  return { cursor };
};

export const fnCursorMoveBackward = (): { cursor: string | null } => {
  if (valtioStore.currentIndex === null) {
    return { cursor: null };
  }

  valtioStore.currentIndex = valtioStore.currentIndex - 1;
  if (valtioStore.currentIndex < 0) {
    return { cursor: null };
  }

  const cursor = valtioStore.preOrderList[valtioStore.currentIndex];

  return { cursor };
};

export const fnCursorInitForInterview = () => {
  valtioStore.maxOrderIndex = valtioStore.preOrderList.length - 1;
  valtioStore.currentIndex = 0;
};

export const fnCursorInitForResponse = () => {
  valtioStore.maxOrderIndex = valtioStore.postOrderList.length - 1;
  valtioStore.currentIndex = 0;
};

export const fnGetCurrentCursor = (): string | null => {
  if (valtioStore.currentIndex === null) {
    return null;
  }

  return valtioStore.preOrderList[valtioStore.currentIndex];
};

export function* fnGetAllPostOrderCursors(): Generator<Str> {
  // fnValidPostOrderSids();
  const { error, validSids } = fnValidPostOrderSids();
  if (error) {
    throw new Error(`fnGetAllPostOrderCursors: ${error}`);
  }

  for (const sid of validSids) {
    const cursor = `post.${sid}`;
    yield cursor;
  }
}

export function* fnGetAllPreOrderCursors(): Generator<Str> {
  const preOrderList = valtioStore.preOrderList;
  for (const cursor of preOrderList) {
    yield cursor;
  }
}

export const fnSetLastQuestionIndex = (index: number | null) => {
  valtioStore.lastQuestionIndex = index;
};

export const fnIsItTheLastQuestion = (): boolean => {
  return valtioStore.currentIndex === valtioStore.lastQuestionIndex;
};

export const fnIsItTheFirstQuestion = (): boolean => {
  return valtioStore.currentIndex === 0;
};
