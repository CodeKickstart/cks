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

const MAX = 10000000;
const MIN = -10000000;

const Int: React.FC<Props> = ({
  queryObject,
  onNextResponse,
  onBackResponse,
}) => {
  const [answer, setAnswer] = useState<number | null>(null);
  const [sidCursor, setSidCursor] = useState<string>("");
  const [min, setMin] = useState<number | undefined>(undefined);
  const [max, setMax] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [inputColor, setInputColor] = useState<string>("");
  // const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true); // New state variable

  const [backSidExist, setBackSidExist] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const fnIsValidAnswer = useCallback(
    (value: number | null): boolean => {
      return (
        value !== null &&
        !isNaN(value) &&
        value >= (min ?? MIN) &&
        value <= (max || MAX)
      );
    },
    [min, max]
  );

  const handleNextResponse = useCallback(() => {
    if (answer !== null) {
      fnSetQueryAttribute(sidCursor, KEY_VAL, answer);
      setAnswer(null);
      onNextResponse();
      setIsVisible(false); // Hide the component after Enter is pressed
    }
  }, [answer, onNextResponse, sidCursor, setIsVisible]);

  useEffect(() => {
    interface ObjTemplate {
      defval?: number;
      sid?: string;
      min?: number;
      max?: number;
    }

    const { defval, sid, min, max } = (queryObject || {}) as ObjTemplate;
    setMin(min);
    setMax(max);

    setSidCursor(sid as string);

    if (defval !== undefined && typeof defval === "number") {
      setAnswer(defval as number);
    }
    setBackSidExist(!fnIsItTheFirstQuestion());
  }, [queryObject]);

  useEffect(() => {
    if (fnIsValidAnswer(answer)) {
      setErrorMessage("");
      setInputColor("");
      // setIsButtonDisabled(false);
    } else {
      setErrorMessage(`Value must be between ${min ?? MIN} and ${max ?? MAX}`);
      setInputColor("gray");
      // setIsButtonDisabled(true);
    }
  }, [answer, min, max, fnIsValidAnswer]);

  const handleNextClick = () => {
    if (fnIsValidAnswer(answer)) {
      handleNextResponse();
    }
  };

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      setAnswer(value);
    },
    []
  );

  if (!isVisible) {
    return null; // Don't render anything if isVisible is false
  }

  return (
    <div className='flex items-start'>
      <input
        ref={inputRef}
        type='number'
        className={`form-input mr-2 ${inputColor}`}
        value={answer !== null ? answer.toString() : ""}
        onChange={onChangeHandler}
      />
      <div className='flex-grow text-red-500'>{errorMessage}</div>
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

export default Int;
