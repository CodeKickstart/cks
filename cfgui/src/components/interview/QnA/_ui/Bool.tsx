import React, { useState, useRef, useEffect } from "react";
import { fnIsItTheLastQuestion } from "../state-mgt/cursor/cursor";

import { KEY_VAL } from "../../../../shared/defs/constants";
import {
  fnGetQueryObject,
  fnSetQueryAttribute,
} from "../state-mgt/dataAccess/loLevelAccess";
import { fnGetSidCursor } from "../state-mgt/helper/sidcursor";

interface Props {
  onCancel: () => void;
  onResponse: () => void;
}

const Bool: React.FC<Props> = ({ onCancel, onResponse }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state
  const [nextButtonLabel, setNextButtonLabel] = useState<string>("Next");

  const [answer, setAnswer] = useState<string>(""); // Store the selected value
  const inputRef = useRef<HTMLInputElement>(null);

  const [sidCursor, setSidCursor] = useState<string>("");

  useEffect(() => {
    const sidCursor = fnGetSidCursor();
    if (!sidCursor) {
      console.log("Error: sidCursor is not found");
      return;
    }

    const isTheCurrentLastQuestion = fnIsItTheLastQuestion();
    if (isTheCurrentLastQuestion) {
      setNextButtonLabel("Finish");
    }

    setSidCursor(sidCursor);
    const { error, queryObject } = fnGetQueryObject(sidCursor);
    if (error) {
      console.log(error);
      return;
    }
    if (queryObject) {
      const { prompt, defval } = queryObject;

      if (defval !== undefined) {
        setAnswer(defval as string); // Initialize with default value if available
      } else {
        if (prompt) {
          setPrompt(prompt as string);
        }
      }
    }

    setIsLoading(false); // Set loading state to false after fetching data
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleNext = () => {
    fnSetQueryAttribute(sidCursor, KEY_VAL, answer);
    setAnswer(""); // Reset answer after submission
    onResponse();
  };

  // Render loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render UI
  return (
    <div className='p-4 border rounded-md shadow-md'>
      <h3 className='text-xl font-bold mb-2'>Boolean (Radio)</h3>
      <h2 className='text-lg font-bold mb-2'>{prompt}</h2>
      <div className='flex items-center mb-4'>
        <label className='inline-flex items-center mr-4'>
          <input
            ref={inputRef}
            type='radio'
            className='form-radio'
            value='true'
            checked={answer === "true"}
            onChange={() => setAnswer("true")}
          />
          <span className='ml-2'>True</span>
        </label>
        <label className='inline-flex items-center'>
          <input
            type='radio'
            className='form-radio'
            value='false'
            checked={answer === "false"}
            onChange={() => setAnswer("false")}
          />
          <span className='ml-2'>False</span>
        </label>
      </div>
      <div>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded-md mr-2'
          onClick={handleNext}>
          {nextButtonLabel}
        </button>
        <button
          className='bg-gray-500 text-white px-4 py-2 rounded-md mr-2'
          onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Bool;
