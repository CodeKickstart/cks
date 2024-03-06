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
  const listOfDescendantNames = Object.values(descendantNames);

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
      defval?: number | string;
      sid?: string;
    }

    const { defval, sid } = (queryObject || {}) as ObjTemplate;

    if (!listOfDescendantNames || !Array.isArray(listOfDescendantNames)) {
      const error = "Failed to retrieve query object";
      console.error(error);
      return;
    }

    setSidCursor(sid as string);

    if (defval !== undefined) {
      if (typeof defval === "string") {
        const index = listOfDescendantNames.indexOf(defval);
        if (index !== -1) {
          setAnswer(index);
        } else {
          const error = `Failed to find index of defval: ${defval}`;
          console.error(error);
          return;
        }
      } else {
        setAnswer(defval as number);
      }
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
    <div className='flex flex-col'>
      <div className='mb-4'>
        <h2 className='font-semibold'>Select one an option:</h2>
        {listOfDescendantNames.map((descendantName, index) => (
          <label key={index} className='flex items-center mb-2'>
            <input
              type='radio'
              value={index}
              checked={answer === index}
              onChange={() => setAnswer(index)}
              className='mr-2'
            />
            {descendantName}
          </label>
        ))}
      </div>
      <div className='flex-grow'></div>
      <div className='flex justify-end'>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-md ml-2 ${
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
