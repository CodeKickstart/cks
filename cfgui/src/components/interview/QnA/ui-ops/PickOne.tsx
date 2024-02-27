import React, { useState, useEffect, useCallback } from "react";
import { KEY_VAL } from "../../../../shared/defs/constants";
import { fnSetQueryAttribute } from "../state-mgt/dataAccess/loLevelAccess";
import { JsonObjectType } from "../../../../shared/defs/types";

interface Props {
  queryObject: JsonObjectType;
  onResponse: () => void;
}

const ENTER_KEY = "Enter";
const ENTER_BUTTON_LABEL = "Enter";

const PickOne: React.FC<Props> = ({ queryObject, onResponse }) => {
  const [answer, setAnswer] = useState<number | null>(null); // Updated state name to 'answer'
  const [sidCursor, setSidCursor] = useState<string>("");
  const fruits = ["Mango", "Guava", "Apple"]; // Define the array of fruits

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
      setAnswer(defval as number);
    }

    // Set loading state to false after fetching data
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
  }, [handleEnter, sidCursor]);

  const handleSubmitButtonClick = () => {
    if (answer !== null) {
      handleEnter();
    }
  };

  return (
    <div>
      <select
        value={answer !== null ? answer : ""}
        onChange={(e) => setAnswer(parseInt(e.target.value))}>
        <option value=''>Select an option...</option>
        {fruits.map((fruit, index) => (
          <option key={index} value={index}>
            {fruit}
          </option>
        ))}
      </select>
      <div className='flex-grow'></div>
      <div>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
            answer === null ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmitButtonClick}
          disabled={answer === null}>
          {ENTER_BUTTON_LABEL}
        </button>
      </div>
    </div>
  );
};

export default PickOne;
