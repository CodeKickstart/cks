import React, { useState, useEffect, useCallback } from "react";
import { KEY_VAL } from "../../../shared/defs/constants";
import { fnSetQueryAttribute } from "../state-mgt/dataAccess/loLevelAccess";
import { JsonObjectType } from "../../../shared/defs/types";
import { fnBlockUnselectedChildren } from "../utils/descendantBlocker";

interface Props {
  queryObject: JsonObjectType;
  onResponse: () => void;
}

const ENTER_KEY = "Enter";
const ENTER_BUTTON_LABEL = "Enter";

const PickOne: React.FC<Props> = ({ queryObject, onResponse }) => {
  const [answer, setAnswer] = useState<number | null>(null); // Updated state name to 'answer'
  const [sidCursor, setSidCursor] = useState<string>("");

  interface ObjTemplate {
    descendantNames?: { [key: string]: string };
  }
  const { descendantNames } = queryObject as ObjTemplate;
  if (descendantNames === undefined || typeof descendantNames !== "object") {
    throw new Error("Failed to retrieve query object");
  }
  const listOfdescendantNames = Object.values(descendantNames);

  const handleEnter = useCallback(() => {
    if (answer !== null) {
      fnSetQueryAttribute(sidCursor, KEY_VAL, answer);
      const { error: errorBlocker } = fnBlockUnselectedChildren(queryObject);
      if (errorBlocker) {
        console.error(`Error blocking unselected children: ${errorBlocker}`);
      }
      setAnswer(null);
      onResponse();
    }
  }, [answer, onResponse, sidCursor, queryObject]);

  useEffect(() => {
    interface ObjTemplate {
      defval?: number;
      sid?: string;
    }

    const { defval, sid } = (queryObject || {}) as ObjTemplate;

    setSidCursor(sid as string);

    if (defval !== undefined) {
      setAnswer(defval as number);
    }

    // Set loading state to false after fetching data
  }, [queryObject]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ENTER_KEY) {
        handleEnter();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleEnter, sidCursor]);

  const handleSubmitButtonClick = () => {
    if (answer !== null) {
      handleEnter();
    }
  };

  return (
    <div className='flex'>
      <select
        value={answer !== null ? answer : ""}
        onChange={(e) => setAnswer(parseInt(e.target.value))}>
        <option value=''>Select an option...</option>
        {listOfdescendantNames.map((fruit, index) => (
          <option key={index} value={index}>
            {fruit}
          </option>
        ))}
      </select>
      <div className='flex-grow'></div>
      <div>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
            answer === null ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmitButtonClick}
          disabled={answer === null}>
          {ENTER_BUTTON_LABEL}
        </button>
      </div>
    </div>
  );
};

export default PickOne;
