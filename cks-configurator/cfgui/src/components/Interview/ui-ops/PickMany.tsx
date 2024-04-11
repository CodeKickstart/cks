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
import { fnIsItTheFirstQuestion } from "../state-mgt/cursor/cursor";

interface Props {
  queryObject: JsonObjectType;
  onNextResponse: () => void;
  onBackResponse: () => void;
}

const NEXT_BUTTON_LABEL = "Next";

const PickMany: React.FC<Props> = ({
  queryObject,
  onNextResponse,
  onBackResponse,
}) => {
  const [answer, setAnswer] = useState<number[]>([]); // Updated state name to 'answer'

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
    onNextResponse();
  }, [answer, onNextResponse, queryObject]);

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

    const { error, value } = fnGetQueryAttribute(sid, KEY_VAL);
    if (!error) {
      if (
        Array.isArray(value) &&
        value.every((item) => typeof item === "number")
      ) {
        setAnswer(value as number[]);
        setBackSidExist(!fnIsItTheFirstQuestion());
        return;
      }
    }

    setSid(sid);
    setBackSidExist(!fnIsItTheFirstQuestion());
    const { val } = fnConverListDefvalToVal(listOfDescendantNames, defval);

    const { error: errorSetValue } = fnSetQueryAttribute(sid, KEY_VAL, val);
    if (errorSetValue) {
      console.error(`Error setting query attribute: ${errorSetValue}`);
      return;
    }

    if (val.length > 0) {
      setAnswer(val);
    }
  }, [queryObject, listOfDescendantNames]);

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

  const handleNextClick = () => {
    handleNextResponse();
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

export default PickMany;
