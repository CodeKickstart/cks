import React, { useState, useEffect, useCallback } from "react";

import { KEY_VAL } from "../../../shared/defs/constants";
import { fnSetQueryAttribute } from "../state-mgt/dataAccess/loLevelAccess";
import { JsonObjectType } from "../../../shared/defs/types";

interface Props {
  queryObject: JsonObjectType;
  onResponse: () => void;
}

const ENTER_KEY = "Enter";
const ENTER_BUTTON_LABEL = "Enter";

const Bool: React.FC<Props> = ({ queryObject, onResponse }) => {
  const [value, setValue] = useState<boolean | undefined>(undefined);
  const [sidCursor, setSidCursor] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const handleEnter = useCallback(() => {
    if (value !== undefined) {
      fnSetQueryAttribute(sidCursor, KEY_VAL, value);
      onResponse();
    }
  }, [value, onResponse, sidCursor]);

  useEffect(() => {
    interface ObjTemplate {
      defval?: boolean;
      sid?: string;
    }

    const { defval, sid } = (queryObject || {}) as ObjTemplate;
    setSidCursor(sid as string);

    if (defval !== undefined) {
      setValue(defval);
      setIsButtonDisabled(false);
    } else {
      setValue(undefined);
      setIsButtonDisabled(true);
    }
  }, [queryObject]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ENTER_KEY) {
        handleEnter();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleEnter]);

  const handleInputChange = (newValue: boolean) => {
    setValue(newValue);
    setIsButtonDisabled(false);
  };

  return (
    <div className='flex items-center'>
      <label className='mr-2'>
        <input
          type='radio'
          name='boolRadio'
          value='true'
          checked={value === true}
          onChange={() => handleInputChange(true)}
        />
        True
      </label>
      <label>
        <input
          type='radio'
          name='boolRadio'
          value='false'
          checked={value === false}
          onChange={() => handleInputChange(false)}
        />
        False
      </label>
      <div className='flex-grow' />
      <button
        className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
          isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleEnter}
        disabled={isButtonDisabled}>
        {ENTER_BUTTON_LABEL}
      </button>
    </div>
  );
};

export default Bool;
