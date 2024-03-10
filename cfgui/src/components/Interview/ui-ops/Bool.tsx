import React, { useState, useEffect, useCallback } from "react";
import { KEY_VAL } from "../../../shared/defs/constants";
import { fnSetQueryAttribute } from "../state-mgt/dataAccess/loLevelAccess";
import { JsonObjectType } from "../../../shared/defs/types";

interface Props {
  queryObject: JsonObjectType;
  onResponse: () => void;
}

// const ENTER_KEY = "Enter";
const ENTER_BUTTON_LABEL = "Enter";

const Bool: React.FC<Props> = ({ queryObject, onResponse }) => {
  const [value, setValue] = useState<boolean | undefined>(undefined);
  const [sidCursor, setSidCursor] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  // const handleEnter = useCallback(() => {
  //   if (value !== undefined) {
  //     fnSetQueryAttribute(sidCursor, KEY_VAL, value);
  //     onResponse();
  //   }
  // }, [value, onResponse, sidCursor]);

  const handleEnter = useCallback(async () => {
    if (value !== undefined) {
      await fnSetQueryAttribute(sidCursor, KEY_VAL, value); // Wait for the asynchronous operation to complete
      onResponse(); // Trigger the callback after the operation is finished
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

  const handleInputChange = (newValue: boolean) => {
    setValue(newValue);
    setIsButtonDisabled(false);
  };

  return (
    <div className='flex items-center'>
      <label className='inline-flex items-center mr-2'>
        <input
          type='radio'
          name='boolRadio'
          value='true'
          checked={value === true}
          onChange={() => handleInputChange(true)}
          className='form-radio h-5 w-5 text-blue-500'
        />
        <span className='ml-2'>True</span>
      </label>
      <label className='inline-flex items-center'>
        <input
          type='radio'
          name='boolRadio'
          value='false'
          checked={value === false}
          onChange={() => handleInputChange(false)}
          className='form-radio h-5 w-5 text-blue-500'
        />
        <span className='ml-2'>False</span>
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
