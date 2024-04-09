// Text.tsx

import React, { useState, useRef, useEffect, useCallback } from "react";

import { KEY_VAL } from "../../../shared/defs/constants";
import { fnSetQueryAttribute } from "../state-mgt/dataAccess/loLevelAccess";
import { JsonObjectType } from "../../../shared/defs/types";
import { valtioStore } from "../defs/types/ValtioTypes";

interface Props {
  queryObject: JsonObjectType;
  onResponse: () => void;
}

const ENTER_BUTTON_LABEL = "Enter";
const Text: React.FC<Props> = ({ queryObject, onResponse }) => {
  const [answer, setAnswer] = useState<string | null>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [sidCursor, setSidCursor] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const fnIsValidAnswer = (answer: string) => {
    return answer && answer.trim() !== "";
  };

  const handleEnter = useCallback(() => {
    // if (answer !== null && fnIsValidAnswer(answer)) {
    fnSetQueryAttribute(sidCursor, KEY_VAL, answer);
    setAnswer("");
    onResponse();
    setIsVisible(false);
    // }
  }, [answer, onResponse, sidCursor]);

  useEffect(() => {
    interface ObjTemplate {
      defval?: string;
      val?: string;
      sid?: string;
    }

    const { defval, sid, val } = (queryObject || {}) as ObjTemplate;

    setSidCursor(sid as string);

    if (val !== undefined) {
      setAnswer(val as string);
    } else if (defval !== undefined) {
      setAnswer(defval as string);
    }

    // Set loading state to false after fetching data
  }, [queryObject]);

  const handleSubmitButtonClick = () => {
    if (answer !== null && fnIsValidAnswer(answer)) {
      handleEnter();
    }
  };
  if (!isVisible) {
    return null; // Don't render anything if isVisible is false
  }

  return (
    <div className='flex items-start'>
      <input
        ref={inputRef}
        type='text'
        className='border rounded-md px-2 py-1 mb-2 w-full mr-2'
        value={answer || ""}
        placeholder='Enter your response here and press RETURN to submit.'
        onChange={(e) => setAnswer(e.target.value)}
      />
      <div className='flex-grow' />
      <div className='flex flex-col justify-end'>
        <button
          id='submit-button'
          className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
            answer === null || answer === ""
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={handleSubmitButtonClick}
          disabled={answer === null}>
          {ENTER_BUTTON_LABEL}
        </button>
        <button
          id='back-button'
          className={`bg-blue-500 text-white px-4 py-2 rounded-md mt-2 ${
            answer === null || answer === ""
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
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

export default Text;
