import React, { useState, useRef, useEffect, useCallback } from "react";

import { KEY_VAL } from "../../../shared/defs/constants";
import { fnSetQueryAttribute } from "../state-mgt/dataAccess/loLevelAccess";
import { JsonObjectType } from "../../../shared/defs/types";

interface Props {
  queryObject: JsonObjectType;
  onResponse: () => void;
}

const ENTER_KEY = "Enter";
const ENTER_BUTTON_LABEL = "Enter";

const MAX = 10000000;
const MIN = -10000000;

const Int: React.FC<Props> = ({ queryObject, onResponse }) => {
  const [answer, setAnswer] = useState<number | null>(null);
  const [sidCursor, setSidCursor] = useState<string>("");
  const [min] = useState<number | undefined>(undefined);
  const [max] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [inputColor, setInputColor] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

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

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      setAnswer(value);
      if (value < (min ?? MIN) || value > (max ?? MAX)) {
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

  return (
    <div className='flex items-center'>
      <input
        ref={inputRef}
        type='number'
        className={`form-input mr-2 ${inputColor}`}
        value={answer !== null ? answer.toString() : ""}
        onChange={onChangeHandler}
      />
      <div className='flex-grow text-red-500'>{errorMessage}</div>
      <button
        className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
          isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleSubmitButtonClick}
        disabled={isButtonDisabled}>
        {ENTER_BUTTON_LABEL}
      </button>
    </div>
  );
};

export default Int;
