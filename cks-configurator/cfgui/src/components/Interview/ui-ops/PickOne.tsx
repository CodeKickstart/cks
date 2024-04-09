import React, { useState, useEffect, useCallback } from "react";
import { KEY_VAL } from "../../../shared/defs/constants";
import { fnSetQueryAttribute } from "../state-mgt/dataAccess/loLevelAccess";
import { JsonObjectType } from "../../../shared/defs/types";
import { fnBlockUnselectedChildren } from "../utils/descendantBlocker";
import { fnConverSingleDefvalToVal } from "../utils/defval2val";
import { valtioStore } from "../defs/types/ValtioTypes";

interface Props {
  queryObject: JsonObjectType;
  onResponse: () => void;
}

const ENTER_KEY = "Enter";
const NEXT_BUTTON_LABEL = "Next";

const PickOne: React.FC<Props> = ({ queryObject, onResponse }) => {
  const [answer, setAnswer] = useState<number | null>(null); // Updated state name to 'answer'
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
    if (answer !== null) {
      fnSetQueryAttribute(sid, KEY_VAL, answer);
      const { error: errorBlocker } = fnBlockUnselectedChildren(queryObject);
      if (errorBlocker) {
        console.error(`Error blocking unselected children: ${errorBlocker}`);
      }
      setAnswer(null);
      onResponse();
    }
  }, [answer, onResponse, sid, queryObject]);

  useEffect(() => {
    interface ObjTemplate {
      defval?: number | string | null | undefined;
      sid?: string;
    }

    if (!listOfDescendantNames || !Array.isArray(listOfDescendantNames)) {
      const error = "Failed to retrieve query object";
      console.error(error);
      return;
    }

    const { defval, sid } = (queryObject || {}) as ObjTemplate;
    if (!sid) {
      throw new Error("Failed to retrieve query object");
    }
    setSid(sid);

    if (defval === null || defval === undefined) {
      return;
    }

    const { val } = fnConverSingleDefvalToVal(listOfDescendantNames, defval);

    const { error: errorSetValue } = fnSetQueryAttribute(sid, KEY_VAL, val);
    if (errorSetValue) {
      console.error(`Error setting query attribute: ${errorSetValue}`);
      return;
    }

    setAnswer(val);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (index: number) => {
    const { error: errorSet } = fnSetQueryAttribute(sid, KEY_VAL, index);
    if (errorSet) {
      console.error(`Error setting query attribute: ${errorSet}`);
      return;
    }

    setAnswer(index);
  };

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
  }, [handleEnter, sid]);

  const handleNextClick = () => {
    if (answer !== null) {
      handleEnter();
    }
  };

  return (
    <div className='flex flex-col'>
      <div className='flex'>
        <div>
          <h2 className='font-semibold'>Select one an option:</h2>
          {listOfDescendantNames.map((descendantName, index) => (
            <label key={index} className='flex items-center mb-2'>
              <input
                type='radio'
                value={index}
                checked={answer === index}
                onChange={() => handleChange(index)}
                className='mr-2'
              />
              {descendantName}
            </label>
          ))}
        </div>
        <div className='flex-grow'></div>
        <div className='flex flex-col justify-start'>
          <button
            id='next-button'
            className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
              answer === null ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleNextClick}
            disabled={answer === null}>
            {NEXT_BUTTON_LABEL}
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

export default PickOne;
