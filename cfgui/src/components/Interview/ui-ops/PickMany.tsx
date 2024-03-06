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

const PickMany: React.FC<Props> = ({ queryObject, onResponse }) => {
  const [answer, setAnswer] = useState<number[]>([]); // Updated state name to 'answer'
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
    if (answer.length > 0) {
      fnSetQueryAttribute(sidCursor, KEY_VAL, answer as number[]);
      const { error: errorBlocker } = fnBlockUnselectedChildren(queryObject);
      if (errorBlocker) {
        console.error(`Error blocking unselected children: ${errorBlocker}`);
      }
      setAnswer([]);
      onResponse();
    }
  }, [answer, onResponse, sidCursor, queryObject]);

  useEffect(() => {
    interface ObjTemplate {
      defval?: number[] | string[];
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
      if (
        Array.isArray(defval) &&
        defval.every((element) => typeof element === "string")
      ) {
        const ansArray: number[] = [];
        for (let i = 0; i < listOfDescendantNames.length; i++) {
          if (listOfDescendantNames[i] === defval[0]) {
            ansArray.push(i);
          }
        }
        setAnswer(ansArray);
      } else {
        if (
          Array.isArray(defval) &&
          defval.every((element) => typeof element === "number")
        ) {
          setAnswer(defval as number[]);
        }
      }
    }

    // Set loading state to false after fetching data
  }, [queryObject, listOfDescendantNames]);

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

  const handleCheckboxChange = (index: number) => {
    const isChecked = answer.includes(index);
    if (isChecked) {
      const newAnswerSet = answer.filter((item) => item !== index);
      setAnswer(newAnswerSet);
    } else {
      setAnswer([...answer, index]);
    }
  };

  const handleSubmitButtonClick = () => {
    handleEnter();
  };

  return (
    <div className='flex flex-col'>
      <h2 className='font-semibold mb-4'>Select one or more options:</h2>
      <ul className='space-y-1 flex-grow'>
        {listOfDescendantNames.map((descendantName, index) => (
          <li key={index}>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={answer !== null && answer.includes(index)}
                onChange={() => handleCheckboxChange(index)}
                className='mr-2'
              />
              {descendantName}
            </label>
          </li>
        ))}
      </ul>
      <div className='flex-grow'></div>
      <div className='self-end'>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded-md'
          onClick={handleSubmitButtonClick}>
          {ENTER_BUTTON_LABEL}
        </button>
      </div>
    </div>
  );
};

export default PickMany;
