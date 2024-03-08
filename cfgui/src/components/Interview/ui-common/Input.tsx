import React, { useEffect, useState } from "react";
import { InputProps } from "../defs/types/UITypes";

import {
  INPUT_TEXT,
  INPUT_BOOL,
  INPUT_INT,
  INPUT_DEC,
  INPUT_PICKONE,
  INPUT_LITERAL,
  INPUT_PICKMANY,
} from "../defs/constants/ComponentNames";

import Text from "../ui-ops/Text";
import Bool from "../ui-ops/Bool";
import Int from "../ui-ops/Int";
import Dec from "../ui-ops/Dec";
import PickOne from "../ui-ops/PickOne";
import PickMany from "../ui-ops/PickMany";
import { fnRetrieveQueryObject } from "../state-mgt/dataAccess/hiLevelAccess";
import Finish from "./Finish";

const CANCEL_BUTTON = "Cancel";

const Input: React.FC<InputProps> = ({ onResponse, inputType }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cancelClicked, setCancelClicked] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // New state for error message

  useEffect(() => {
    try {
      const queryObject = fnRetrieveQueryObject();
      if (!queryObject) {
        setErrorMessage("Error: Query object is empty."); // Set error message if query object is empty
        return;
      }
      interface ObjTemplate {
        prompt?: string;
      }

      const { prompt } = queryObject as ObjTemplate;
      if (prompt) {
        setPrompt(prompt as string);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error retrieving query object:", error);
      setErrorMessage("Error: Failed to retrieve data"); // Set error message for any other error during retrieval
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // This effect will run whenever `inputType` changes
    if (
      inputType &&
      ![
        INPUT_TEXT,
        INPUT_BOOL,
        INPUT_INT,
        INPUT_DEC,
        INPUT_PICKONE,
        INPUT_PICKMANY,
        INPUT_LITERAL,
      ].includes(inputType)
    ) {
      setErrorMessage(`Invalid inputType: ${inputType}`); // Set error message for invalid inputType
    } else {
      setErrorMessage(null); // Clear error message if inputType is valid
    }
  }, [inputType]);

  let inputComponent;
  const queryObject = fnRetrieveQueryObject();
  if (!queryObject) {
    return null;
  }

  const handleResponse = () => {
    onResponse();
  };

  switch (inputType) {
    case INPUT_TEXT:
      inputComponent = (
        <Text queryObject={queryObject} onResponse={handleResponse} />
      );
      break;

    case INPUT_BOOL:
      inputComponent = (
        <Bool queryObject={queryObject} onResponse={onResponse} />
      );
      break;

    case INPUT_INT:
      inputComponent = (
        <Int queryObject={queryObject} onResponse={onResponse} />
      );
      break;

    case INPUT_DEC:
      inputComponent = (
        <Dec queryObject={queryObject} onResponse={onResponse} />
      );
      break;

    case INPUT_PICKONE:
      inputComponent = (
        <PickOne queryObject={queryObject} onResponse={onResponse} />
      );
      break;

    case INPUT_PICKMANY:
      inputComponent = (
        <PickMany queryObject={queryObject} onResponse={onResponse} />
      );
      break;

    default:
      inputComponent = null;
  }

  return (
    <div className='flex'>
      <div id='idDisplay' className={`p-4 ${isOpen ? "block" : "hidden"}`}>
        {cancelClicked && <Finish />}
        {isLoading && <div>Loading...</div>}
        <h2 className='text-lg font-bold mb-2'>{prompt}</h2>
        <div className='p-4 border rounded-md shadow-md'>{inputComponent}</div>
        <div>
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded-md mr-2 mt-4`}
            onClick={() => {
              setCancelClicked(true);
              setIsOpen(false);
            }}>
            {CANCEL_BUTTON}
          </button>
        </div>
      </div>
      {/* Error Message Tab */}
      {errorMessage && (
        <div className='p-4 border rounded-md shadow-md'>
          <h3 className='text-red-500 font-bold'>Error:</h3>
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Input;
