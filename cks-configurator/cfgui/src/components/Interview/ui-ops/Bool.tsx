import React, { useState, useRef, useEffect, useCallback } from "react";

import { KEY_VAL } from "../../../shared/defs/constants";
import { fnSetQueryAttribute } from "../state-mgt/dataAccess/loLevelAccess";
import { JsonObjectType } from "../../../shared/defs/types";
import { valtioStore } from "../defs/types/ValtioTypes";

interface Props {
  queryObject: JsonObjectType;
  onNextResponse: () => void;
}

const NEXT_BUTTON_LABEL = "Next";
const Bool: React.FC<Props> = ({ queryObject, onNextResponse }) => {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sidCursor, setSidCursor] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const fnIsValidAnswer = (answer: boolean | null) => {
    return answer !== null;
  };

  const handleNextResponse = useCallback(() => {
    if (answer !== null) {
      fnSetQueryAttribute(sidCursor, KEY_VAL, answer);
      setAnswer(null);
      onNextResponse();
      setIsVisible(false);
    }
  }, [answer, onNextResponse, sidCursor]);

  useEffect(() => {
    interface ObjTemplate {
      defval?: boolean;
      sid?: string;
    }

    const { defval, sid } = (queryObject || {}) as ObjTemplate;

    setSidCursor(sid as string);

    if (defval !== undefined && typeof defval === "boolean") {
      setAnswer(defval as boolean);
    }
  }, [queryObject]);

  const handleNextClick = () => {
    if (fnIsValidAnswer(answer)) {
      handleNextResponse();
    }
  };
  if (!isVisible) {
    return null; // Don't render anything if isVisible is false
  }
  return (
    <div className='flex items-start'>
      <div className='flex items-start'>
        <label className='inline-flex items-center mr-4'>
          <input
            ref={inputRef}
            type='radio'
            className='form-radio'
            value='true'
            checked={answer === true}
            onChange={() => setAnswer(true)}
          />
          <span className='ml-2'>True</span>
        </label>
        <label className='inline-flex items-center'>
          <input
            type='radio'
            className='form-radio'
            value='false'
            checked={answer === false}
            onChange={() => setAnswer(false)}
          />
          <span className='ml-2'>False</span>
        </label>
      </div>
      <div className='flex-grow' />
      <div className='flex flex-col justify-end'>
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
  );
};

export default Bool;
