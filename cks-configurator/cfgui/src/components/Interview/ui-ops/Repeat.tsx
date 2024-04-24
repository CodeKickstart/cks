import React, { useState, useRef, useEffect, useCallback } from "react";

import { KEY_VAL } from "../../../shared/defs/constants";
import { fnSetQueryAttribute } from "../state-mgt/dataAccess/loLevelAccess";
import { JsonObjectType } from "../../../shared/defs/types";
import { valtioStore } from "../defs/types/ValtioTypes";
import { fnIsItTheFirstQuestion } from "../state-mgt/cursor/cursor";

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
  const [selectedValue, setSelectedValue] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sidCursor, setSidCursor] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [backSidExist, setBackSidExist] = useState<boolean>(false);
  const [repeatCount, setRepeatCount] = useState<number>(0);
  const [minCount, setMinCount] = useState<number>(0);
  const [maxCount, setMaxCount] = useState<number>(0);

  const handleNextResponse = useCallback(() => {
    if (selectedValue !== null) {
      fnSetQueryAttribute(sidCursor, KEY_VAL, selectedValue);
      setSelectedValue(null);
      onNextResponse();
      setIsVisible(false);
    }
  }, [onNextResponse, selectedValue, sidCursor]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    interface ObjTemplate {
      defval?: boolean;
      val?: string;
      sid?: string;
      min?: number;
      max?: number;
    }

    const { defval, sid, val, min, max } = (queryObject || {}) as ObjTemplate;

    if (min === undefined || min < 0) {
      setMinCount(0);
    } else {
      setMinCount(min);
    }

    if (max === undefined || max < 0 || max < minCount) {
      setMaxCount(minCount);
    } else {
      setMaxCount(max);
    }
    setRepeatCount(0);

    setSidCursor(sid as string);

    setSelectedValue(null);
    if (val !== undefined && typeof val === "boolean") {
      setSelectedValue(val as boolean);
    } else if (defval !== undefined && typeof defval === "boolean") {
      setSelectedValue(defval as boolean);
    }

    setBackSidExist(!fnIsItTheFirstQuestion());
  }, [queryObject, minCount, maxCount]);

  const handleNextClick = () => {
    if (selectedValue !== null) {
      handleNextResponse();
    }
  };

  const handleTrueChange = () => {
    setSelectedValue(true);
  };

  const handleFalseChange = () => {
    setSelectedValue(false);
  };

  const handleClearAll = () => {
    console.log("Clear All clicked");
    setSelectedValue(null);
  };

  if (!isVisible) {
    return null; // Don't render anything if isVisible is false
  }

  const handleOkClick = () => {
    if (selectedValue !== null) {
      setRepeatCount((c) => c + 1);
    }

  };

  return (
    <div className='flex items-start'>
      <div className='flex flex-col items-start mr-2'>
        <div className='flex items-center justify-between w-full mb-2'>
          <span className='bg-gray-200 px-2 py-1 rounded-md'>
            Repeat Count: {repeatCount}
          </span>
          <span className='bg-gray-200 px-2 py-1 rounded-md'>
            Min Count: {minCount}, Max Count: {maxCount}
          </span>
        </div>
        <div id='top-row' className='flex items-center justify-between w-full'>
          <div className='flex items-center'>
            <label className='inline-flex items-center mr-4'>
              <input
                ref={inputRef}
                type='radio'
                className='form-radio'
                value='true'
                checked={selectedValue === true}
                onChange={handleTrueChange}
              />
              <span className='ml-2'>True</span>
            </label>
            <label className='inline-flex items-center'>
              <input
                type='radio'
                className='form-radio'
                value='false'
                checked={selectedValue === false}
                onChange={handleFalseChange}
              />
              <span className='ml-2'>False</span>
            </label>
          </div>
          <div className='flex items-center ml-2'>
            <button
              id='ok-button'
              className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
                selectedValue === null ||
                repeatCount > maxCount ||
                repeatCount < minCount
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleOkClick}
              disabled={repeatCount > maxCount || repeatCount < minCount}>
              OK
            </button>
          </div>
        </div>
        <div className='w-full mt-2'>
          <button
            id='clear-all-button'
            className='bg-blue-500 text-white px-4 py-2 rounded-md w-full'
            onClick={handleClearAll}>
            Clear All
          </button>
        </div>
      </div>
      <div className='flex-grow' />
      <div className='flex flex-col justify-end'>
        <button
          id='next-button'
          className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
            selectedValue === null ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleNextClick}
          disabled={selectedValue === null}>
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
