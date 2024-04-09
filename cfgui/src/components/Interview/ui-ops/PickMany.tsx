import React, { useState, useEffect, useCallback } from "react";
import { KEY_VAL } from "../../../shared/defs/constants";
import {
  fnGetQueryAttribute,
  fnSetQueryAttribute,
} from "../state-mgt/dataAccess/loLevelAccess";
import { JsonObjectType } from "../../../shared/defs/types";
import { fnBlockUnselectedChildren } from "../utils/descendantBlocker";
import { fnConverListDefvalToVal } from "../utils/defval2val";
import { valtioStore } from "../defs/types/ValtioTypes";

interface Props {
  queryObject: JsonObjectType;
  onResponse: () => void;
}

const ENTER_KEY = "Enter";
const ENTER_BUTTON_LABEL = "Enter";

const PickMany: React.FC<Props> = ({ queryObject, onResponse }) => {
  const [answer, setAnswer] = useState<number[]>([]); // Updated state name to 'answer'
  // const [sidCursor, setSidCursor] = useState<string>("");
  const [sid, setSid] = useState<string>("");

  interface ObjTemplate {
    descendantNames?: { [key: string]: string };
  }
  const { descendantNames } = queryObject as ObjTemplate;
  if (descendantNames === undefined || typeof descendantNames !== "object") {
    throw new Error("Failed to retrieve query object");
  }
  const listOfDescendantNames = Object.values(descendantNames);

  const handleEnter = useCallback(() => {
    interface ObjTemplate {
      sid?: string;
    }
    const { sid } = queryObject as ObjTemplate;
    if (sid === undefined) {
      throw new Error("Failed to retrieve query object");
    }
    fnSetQueryAttribute(sid, KEY_VAL, answer as number[]);
    const { error: errorBlocker } = fnBlockUnselectedChildren(queryObject);
    if (errorBlocker) {
      console.error(`Error blocking unselected children: ${errorBlocker}`);
    }
    setAnswer([]);
    onResponse();
  }, [answer, onResponse, queryObject]);

  useEffect(() => {
    interface ObjTemplate {
      defval?: number[] | string[] | null | undefined;
      sid?: string;
    }

    const { defval, sid } = (queryObject || {}) as ObjTemplate;

    if (!listOfDescendantNames || !Array.isArray(listOfDescendantNames)) {
      const error = "Failed to retrieve query object";
      console.error(error);
      return;
    }

    if (sid === undefined) {
      const error = "Failed to retrieve query object";
      console.error(error);
      return;
    }
    setSid(sid);

    // if (!defval) {
    //   return;
    // }

    const { val } = fnConverListDefvalToVal(listOfDescendantNames, defval);

    const { error: errorSetValue } = fnSetQueryAttribute(sid, KEY_VAL, val);
    if (errorSetValue) {
      console.error(`Error setting query attribute: ${errorSetValue}`);
      return;
    }

    if (val.length > 0) {
      setAnswer(val);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }, [handleEnter]);

  const handleCheckboxChange = (index: number) => {
    const { error, value: val } = fnGetQueryAttribute(sid, KEY_VAL);
    if (error) {
      console.error(`Error getting query attribute: ${error}`);
      return;
    }

    const newVal = [...(val as number[])];
    if (newVal.includes(index)) {
      const currentIndex = newVal.indexOf(index);
      newVal.splice(currentIndex, 1);
    } else {
      newVal.push(index);
    }

    const { error: errorSet } = fnSetQueryAttribute(sid, KEY_VAL, newVal);
    if (errorSet) {
      console.error(`Error setting query attribute: ${errorSet}`);
      return;
    }

    setAnswer(newVal);
  };

  const handleSubmitButtonClick = () => {
    handleEnter();
  };

  return (
    <div className='flex flex-col'>
      <div className='flex'>
        <div>
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
        </div>
        <div className='flex-grow'></div>
        <div className='flex flex-col justify-start'>
          <button
            id='submit-button'
            className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
              answer === null ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSubmitButtonClick}
            disabled={answer === null}>
            {ENTER_BUTTON_LABEL}
          </button>
          <button
            id='back-button'
            className='bg-blue-500 text-white px-4 py-2 rounded-md mt-2'
            onClick={() => {
              valtioStore.earlyExit = true;
              window.location.href = "/";
            }}>
            Back
          </button>
          <button
            id='cancel-button'
            className='bg-blue-500 text-white px-4 py-2 rounded-md mt-2'
            onClick={() => {
              valtioStore.earlyExit = true;
              window.location.href = "/";
            }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickMany;
