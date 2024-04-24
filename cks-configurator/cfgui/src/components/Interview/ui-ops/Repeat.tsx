import React, { useState, useEffect } from "react";

import { JsonObjectType } from "../../../shared/defs/types";
import { valtioStore } from "../defs/types/ValtioTypes";
import { fnIsItTheFirstQuestion } from "../state-mgt/cursor/cursor";
import { fnSetQueryAttribute } from "../state-mgt/dataAccess/loLevelAccess";
import { KEY_VAL } from "../../../shared/defs/constants";

interface Props {
  queryObject: JsonObjectType;
  onNextResponse: () => void;
  onBackResponse: () => void;
}

const NEXT_BUTTON_LABEL = "Next";

const Repeat: React.FC<Props> = ({
  queryObject,
  onNextResponse,
  onBackResponse,
}) => {
  const DEFAULT_MAX_COUNT = 100;
  const [sidCursor, setSidCursor] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [backSidExist, setBackSidExist] = useState<boolean>(false);
  const [repeatCount, setRepeatCount] = useState<number>(0);
  const [minCount, setMinCount] = useState<number>(0);
  const [maxCount, setMaxCount] = useState<number>(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    interface ObjTemplate {
      val?: number;
      sid?: string;
      min?: number;
      max?: number;
      children?: JsonObjectType[];
    }

    const { sid, min, max, val, children } = (queryObject || {}) as ObjTemplate;
    console.log("children: ", children);
    console.log("sidCursor: ", sidCursor);

    if (min === undefined || min < 0) {
      setMinCount(0);
    } else {
      setMinCount(min);
    }

    if (max === undefined || max < 0 || max < minCount) {
      setMaxCount(DEFAULT_MAX_COUNT);
    } else {
      setMaxCount(max);
    }
    if (val !== undefined || val === null) {
      setRepeatCount(val as number);
    } else {
      setRepeatCount(0);
    }

    setSidCursor(sid as string);

    setBackSidExist(!fnIsItTheFirstQuestion());
  }, [minCount, queryObject, sidCursor]);

  const handleNextClick = () => {


    onNextResponse();
    setIsVisible(false);
    fnSetQueryAttribute(sidCursor, KEY_VAL, repeatCount);
  };

  const handleClearAll = () => {
    console.log("Clear All clicked");
  };

  if (!isVisible) {
    return null; // Don't render anything if isVisible is false
  }

  const handleRepeatClick = () => {
    setRepeatCount((c) => c + 1);
  };

  return (
    <div className='flex items-start'>
      <div className='flex flex-col items-start mr-2'>
        <div className='flex items-center justify-between w-full mb-2'>
          <span className='bg-gray-200 px-2 py-1 rounded-md'>
            <div className='font-bold'> Repeat Count: {repeatCount}</div>
          </span>
        </div>
        <div id='top-row' className='flex items-center justify-between w-full'>
          <div className='flex mt-2'>
            <button
              id='repeat-button'
              className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
                repeatCount >= maxCount || repeatCount < minCount
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={repeatCount > maxCount || repeatCount < minCount}
              onClick={handleRepeatClick}>
              Repeat
            </button>
            <button
              id='clear-all-button'
              className='bg-blue-500 text-white px-4 py-2 ml-2 rounded-md w-full'
              onClick={handleClearAll}>
              Clear All
            </button>
          </div>
        </div>
      </div>
      <div className='flex-grow' />
      <div className='flex flex-col justify-end'>
        <button
          id='next-button'
          className={`bg-blue-500 text-white px-4 py-2 rounded-md `}
          onClick={handleNextClick}>
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
  );
};

export default Repeat;
