import React, { useState, useEffect, useCallback } from "react";
import { KEY_VAL } from "../../../shared/defs/constants";
import {
  fnGetQueryAttribute,
  fnSetQueryAttribute,
} from "../state-mgt/dataAccess/loLevelAccess";
import { JsonObjectType } from "../../../shared/defs/types";
import { fnBlockUnselectedChildren } from "../utils/descendantBlocker";
import { fnConverSingleDefvalToVal } from "../utils/defval2val";
import { valtioStore } from "../defs/types/ValtioTypes";
import { fnIsItTheFirstQuestion } from "../state-mgt/cursor/cursor";

interface Props {
  queryObject: JsonObjectType;
  onNextResponse: () => void;
  onBackResponse: () => void;
}

const NEXT_BUTTON_LABEL = "Next";

const PickOne: React.FC<Props> = ({
  queryObject,
  onNextResponse,
  onBackResponse,
}) => {
  const [answer, setAnswer] = useState<number | null>(null); // Updated state name to 'answer'
  const [sid, setSid] = useState<string>("");
  const [backSidExist, setBackSidExist] = useState<boolean>(false);

  interface ObjTemplate {
    descendantNames?: { [key: string]: string };
  }
  const { descendantNames } = queryObject as ObjTemplate;
  if (descendantNames === undefined || typeof descendantNames !== "object") {
    throw new Error("Failed to retrieve query object");
  }
  const listOfDescendantNames = Object.values(descendantNames);

  const handleNextResponse = useCallback(() => {
    if (answer !== null) {
      fnSetQueryAttribute(sid, KEY_VAL, answer);
      const { error: errorBlocker } = fnBlockUnselectedChildren(queryObject);
      if (errorBlocker) {
        console.error(`Error blocking unselected children: ${errorBlocker}`);
      }
      setAnswer(null);
      onNextResponse();
    }
  }, [answer, onNextResponse, sid, queryObject]);

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

    setBackSidExist(!fnIsItTheFirstQuestion());

    const { error, value } = fnGetQueryAttribute(sid, KEY_VAL);
    if (!error) {
      if (typeof value === "number") {
        setAnswer(value as number);
        return;
      }
    }
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
  }, [queryObject, listOfDescendantNames]);

  const handleChange = (index: number) => {
    const { error: errorSet } = fnSetQueryAttribute(sid, KEY_VAL, index);
    if (errorSet) {
      console.error(`Error setting query attribute: ${errorSet}`);
      return;
    }

    setAnswer(index);
  };

  const handleNextClick = () => {
    if (answer !== null) {
      handleNextResponse();
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
            className={`bg-blue-500 text-white px-4 py-2 rounded-md mt-2 ${
              !backSidExist ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!backSidExist}
            onClick={() => {
              onBackResponse();
            }}>
            Back
          </button>
          <button
            id='reset-button'
            className='bg-blue-500 text-white px-4 py-2 rounded-md mt-2'
            onClick={() => {
              valtioStore.earlyExit = true;
              window.location.href = "/";
            }}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickOne;
