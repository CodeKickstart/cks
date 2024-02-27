// import { JsonObjectType } from "../../../../shared/types/JsonObjectType";
import { QueryObjPartsType } from "../queryObjDestruct";
// import CursorCalc from "./CursorCalc";

export const PRE = "pre";
export const POST = "post";
export interface CursorType {
  direction: "pre" | "post";
  sid: number;
  sidCount: number;
}

export const ContextCursor = (
  queryObjParts: QueryObjPartsType
): {
  fnInitCursor: () => { isDone: boolean; cursor: CursorType };
  fnMoveCursor: () => { isDone: boolean; cursor: CursorType };
} => {
  const { prefixOrderList, postfixOrderList } = queryObjParts;

  // const fnFindNextCursor = CursorCalc(prefixOrderList, postfixOrderList);

  console.log(
    `***sid lists*** QueryCursor: prefixOrderList: ${prefixOrderList}, postfixOrderList: ${postfixOrderList}`
  );
  let _currentCursor: CursorType;

  const fnInitCursor = (): { isDone: boolean; cursor: CursorType } => {
    _currentCursor = {
      direction: PRE,
      sid: prefixOrderList[0],
      sidCount: 0,
    };

    if (_fnIsCursorAtEnd()) {
      return { isDone: false, cursor: _currentCursor };
    }
    return { isDone: true, cursor: _currentCursor };
  };

  function _fnIsCursorAtEnd(): boolean {
    const { direction, sidCount } = _currentCursor;
    if (direction === PRE) {
      return true;
    }

    if (sidCount < postfixOrderList.length - 1) {
      return true;
    }

    return false;
  }

  const fnMoveCursor = (): { isDone: boolean; cursor: CursorType } => {
    const { direction, sidCount } = _currentCursor;
    // console.log("@@@BEFORE _currentCursor", _currentCursor);
    switch (direction) {
      case PRE:
        if (sidCount < prefixOrderList.length - 1) {
          _currentCursor = {
            direction: PRE,
            sid: prefixOrderList[sidCount + 1], // move to next preOrder sid
            sidCount: sidCount + 1,
          };
        } else {
          const resetSidCount = 0;
          _currentCursor = {
            direction: POST,
            sid: postfixOrderList[resetSidCount], // move to next preOrder sid
            sidCount: resetSidCount,
          };
        }
        break;
      case POST:
        _currentCursor = {
          direction: POST,
          sid: postfixOrderList[sidCount + 1], // move to next postOrder sid
          sidCount: sidCount + 1,
        };
        break;
    }
    // console.log("^^^AFTER _currentCursor", _currentCursor);

    if (_fnIsCursorAtEnd()) {
      return { isDone: false, cursor: _currentCursor };
    }
    return { isDone: true, cursor: _currentCursor };
  };

  return { fnInitCursor, fnMoveCursor };
};
