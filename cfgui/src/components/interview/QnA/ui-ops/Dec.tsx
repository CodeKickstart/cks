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

const Dec: React.FC<Props> = ({ queryObject, onResponse }) => {
  const [answer, setAnswer] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sidCursor, setSidCursor] = useState<string>("");

  const fnIsValidAnswer = (answer: number | null) => {
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
    interface ObjTemplate {
      defval?: number;
      sid?: string;
    }

    const { defval, sid } = (queryObject || {}) as ObjTemplate;

    setSidCursor(sid as string);

    if (defval !== undefined && typeof defval === "number") {
      setAnswer(defval as number);
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
      <input
        ref={inputRef}
        type='number'
        step='0.01'
        className='form-input mr-4'
        value={answer !== null ? answer : ""}
        onChange={(e) => setAnswer(parseFloat(e.target.value))}
        placeholder='Enter a floating-point number'
      />
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

export default Dec;
