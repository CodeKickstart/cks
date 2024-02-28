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

const options = ["Guava", "Mango", "Apple"];

const PickMany: React.FC<Props> = ({ queryObject, onResponse }) => {
  const [answer, setAnswer] = useState<number[] | null>(null); // Updated state name to 'answer'
  const [sidCursor, setSidCursor] = useState<string>("");

  const handleEnter = useCallback(() => {
    if (answer !== null) {
      fnSetQueryAttribute(sidCursor, KEY_VAL, answer as number[]);
      setAnswer([]);
      onResponse();
    }
  }, [answer, onResponse, sidCursor]);

  useEffect(() => {
    interface ObjTemplate {
      defval?: number[];
      sid?: string;
      // Other properties as needed
    }
    const { defval, sid } = queryObject as ObjTemplate;

    setSidCursor(sid as string);

    if (Array.isArray(defval)) {
      setAnswer(defval as number[]);
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

  const handleCheckboxChange = (index: number) => {
    if (answer === null) {
      return;
    }

    const currentIndex = answer.indexOf(index);
    const newAnswer = [...answer];

    if (currentIndex === -1) {
      newAnswer.push(index);
    } else {
      newAnswer.splice(currentIndex, 1);
    }

    setAnswer(newAnswer);
  };

  const handleSubmitButtonClick = () => {
    handleEnter();
  };

  return (
    <div className='flex'>
      <h2 className='font-semibold'>Select one or more options:</h2>
      <ul className='space-y-1'>
        {options.map((option, index) => (
          <li key={index}>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={answer !== null && answer.includes(index)}
                onChange={() => handleCheckboxChange(index)}
                className='mr-2'
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
      <div className='flex-grow'></div> {/* Add a gap using flex-grow */}
      <div>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
            answer !== null && answer.length === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={handleSubmitButtonClick}
          disabled={answer !== null && answer.length === 0}>
          {ENTER_BUTTON_LABEL}
        </button>
      </div>
    </div>
  );
};

export default PickMany;
