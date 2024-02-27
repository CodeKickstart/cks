import {
  fnCursorInitForResponse,
  fnGetAllPostOrderCursors,
} from "./cursor/cursor";

export const fnSetupForResponse = () => {
  fnCursorInitForResponse();

  for (const cursor of fnGetAllPostOrderCursors()) {
    console.log(cursor);
  }

  return { error: null };
};

const REACT_SECOND_RENDER_COUNT = 2;
export const logListingSuccess = (() => {
  let count = 0;
  return () => {
    count++;
    if (count === REACT_SECOND_RENDER_COUNT) {
      console.log(`Listing out answers successful: count ${count} `);
      const { error } = fnSetupForResponse();
      if (error) {
        console.error(`fnSetupForResponse: error: ${error}`);
      }
    }
  };
})();
