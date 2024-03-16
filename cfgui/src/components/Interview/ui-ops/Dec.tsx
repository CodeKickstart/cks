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

const MAX = 10000000.0;
const MIN = -10000000.0;

const Dec: React.FC<Props> = ({ queryObject, onResponse }) => {
  const [answer, setAnswer] = useState<string>("");
  const [sidCursor, setSidCursor] = useState<string>("");
  const [min, setMin] = useState<number | undefined>(undefined);
  const [max, setMax] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [inputColor, setInputColor] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const fnIsValidAnswer = useCallback(
    (value: string): boolean => {
      const floatValue = parseFloat(value);
      return (
        !isNaN(floatValue) &&
        floatValue >= (min ?? MIN) &&
        floatValue <= (max ?? MAX)
      );
    },
    [min, max]
  );

  const handleEnter = useCallback(() => {
    if (answer !== "") {
      fnSetQueryAttribute(sidCursor, KEY_VAL, answer);
      setAnswer("");
      onResponse();
      setIsVisible(false);
    }
  }, [answer, onResponse, sidCursor]);

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
      setAnswer(defval.toFixed(2));
    }
  }, [queryObject]);

  useEffect(() => {
    if (fnIsValidAnswer(answer)) {
      setErrorMessage("");
      setInputColor("");
      setIsButtonDisabled(false);
    } else {
      setErrorMessage(`Value must be between ${min ?? MIN} and ${max ?? MAX}`);
      setInputColor("gray");
      setIsButtonDisabled(true);
    }
  }, [answer, min, max, fnIsValidAnswer]);

  const handleSubmitButtonClick = () => {
    if (fnIsValidAnswer(answer)) {
      handleEnter();
    }
  };

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setAnswer(value);
      if (
        parseFloat(value) < (min ?? MIN) ||
        parseFloat(value) > (max ?? MAX) ||
        !/^[+-]?\d+(\.\d+)?$/.test(value)
      ) {
        setErrorMessage(
          `Value must be between ${min ?? MIN} and ${max ?? MAX}`
        );
        setInputColor("gray");
        setIsButtonDisabled(true);
      } else {
        setErrorMessage("");
        setInputColor("");
        setIsButtonDisabled(false);
      }
    },
    [min, max]
  );

  if (!isVisible) {
    return null; // Don't render anything if isVisible is false
  }

  return (
    <div className='flex items-center'>
      <input
        ref={inputRef}
        type='float'
        className={`form-input mr-2 ${inputColor}`}
        value={answer}
        onChange={onChangeHandler}
      />
      <div className='flex-grow text-red-500'>{errorMessage}</div>
      <div>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
            isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmitButtonClick}
          disabled={isButtonDisabled}>
          {ENTER_BUTTON_LABEL}
        </button>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded-md ml-2'
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

export default Dec;
