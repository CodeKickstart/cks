import React, { useState, useRef, useEffect, useCallback } from "react";

import { KEY_VAL } from "../../../../shared/defs/constants";
import { fnSetQueryAttribute } from "../state-mgt/dataAccess/loLevelAccess";
import { JsonObjectType } from "../../../../shared/defs/types";

interface Props {
  queryObject: JsonObjectType;
  onResponse: () => void;
}

const ENTER_KEY = "Enter";
const ENTER_BUTTON_LABEL = "Enter";
const Bool: React.FC<Props> = ({ queryObject, onResponse }) => {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sidCursor, setSidCursor] = useState<string>("");

  const fnIsValidAnswer = (answer: boolean | null) => {
    return answer !== null;
  };

  const handleEnter = useCallback(() => {
    if (answer !== null) {
      fnSetQueryAttribute(sidCursor, KEY_VAL, answer);
      setAnswer(null);
      onResponse();
    }
  }, [answer, onResponse, sidCursor]);

  useEffect(() => {
    const { defval, sid } = queryObject || {};

    setSidCursor(sid as string);

    if (defval !== undefined) {
      setAnswer(defval as boolean);
    }

    // Set loading state to false after fetching data
  }, [queryObject]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

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
    if (fnIsValidAnswer(answer)) {
      handleEnter();
    }
  };

  return (
    <div className='flex items-center'>
      <div className='flex items-center mb-4'>
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
      <div>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
            !fnIsValidAnswer(answer) ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmitButtonClick}
          disabled={!fnIsValidAnswer(answer)}>
          {ENTER_BUTTON_LABEL}
        </button>
      </div>
    </div>
  );
};

export default Bool;
