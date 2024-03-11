import React, { useState, useRef, useEffect, useCallback } from "react";

import { KEY_VAL } from "../../../shared/defs/constants";
import { fnSetQueryAttribute } from "../state-mgt/dataAccess/loLevelAccess";
import { JsonObjectType } from "../../../shared/defs/types";
import { ID_ZSYS_1 } from "../defs/constants/ComponentNames";
import { fnRunPhase2 } from "../state-mgt/setupForResponse";

interface Props {
  queryObject: JsonObjectType;
  onResponse: () => void;
}

const ENTER_BUTTON_LABEL = "Enter";
const Zsys: React.FC<Props> = ({ queryObject, onResponse }) => {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sidCursor, setSidCursor] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [id, setId] = useState<string>("");

  const fnIsValidAnswer = (answer: boolean | null) => {
    return answer !== null;
  };

  const handleEnter = useCallback(() => {
    if (answer !== null) {
      fnSetQueryAttribute(sidCursor, KEY_VAL, answer);
      if (answer === true) {
        if (id === ID_ZSYS_1) {
          fnRunPhase2();
        }
      }
      setAnswer(null);
      onResponse();
      setIsVisible(false);
    }
  }, [answer, onResponse, sidCursor, id]);

  useEffect(() => {
    interface ObjTemplate {
      defval?: boolean;
      sid?: string;
      id?: string;
    }

    const { defval, sid, id } = (queryObject || {}) as ObjTemplate;

    if (!id) {
      throw new Error("Error: id is missing in for ZSYS");
    }
    setId(id);

    setSidCursor(sid as string);

    if (defval !== undefined && typeof defval === "boolean") {
      setAnswer(defval as boolean);
    }
  }, [queryObject]);

  const handleSubmitButtonClick = () => {
    if (fnIsValidAnswer(answer)) {
      handleEnter();
    }
  };
  if (!isVisible) {
    return null; // Don't render anything if isVisible is false
  }
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

export default Zsys;
