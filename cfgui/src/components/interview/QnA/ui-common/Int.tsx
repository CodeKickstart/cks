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
const Int: React.FC<Props> = ({ queryObject, onResponse }) => {
  const [answer, setAnswer] = useState<number | null>(null); // Changed to number type
  const inputRef = useRef<HTMLInputElement>(null);
  const [sidCursor, setSidCursor] = useState<string>("");

  const fnIsValidAnswer = (answer: number | null) => {
    // Updated for number type
    return answer !== null && !isNaN(answer);
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
      setAnswer(defval as number); // Updated for number type
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
      {/* Input for a whole number */}
      <input
        ref={inputRef}
        type='number'
        className='form-input mr-2'
        value={answer !== null ? answer.toString() : ""}
        onChange={(e) => setAnswer(parseInt(e.target.value))}
      />
      {/* Button */}
      <button
        className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
          !fnIsValidAnswer(answer) ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleSubmitButtonClick}
        disabled={!fnIsValidAnswer(answer)}>
        {ENTER_BUTTON_LABEL}
      </button>
    </div>
  );
};

export default Int;
