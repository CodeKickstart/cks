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
const SUBMIT_BUTTON = "Submit";

const Input: React.FC<InputProps> = ({ onResponse, inputType }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cancelClicked, setCancelClicked] = useState<boolean>(false);
  const [submitClicked, setSubmitClicked] = useState<boolean>(false);

  useEffect(() => {
    try {
      const queryObject = fnRetrieveQueryObject();
      if (!queryObject) {
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
      // Handle the error state accordingly, e.g., display an error message
      setPrompt("Error: Failed to retrieve data");
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
      console.log(`Input: Invalid inputType: ${inputType}`);
    }
  }, [inputType]);

  let inputComponent;
  const queryObject = fnRetrieveQueryObject();
  if (!queryObject) {
    // onResponse();
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
  // const submitDisabled = false;

  return (
    <>
      {cancelClicked && <Finish />}
      {submitClicked && <Finish />}
      {isLoading && <div>Loading...</div>}
      <h2 className='text-lg font-bold mb-2'>{prompt}</h2>
      <div className='p-4 border rounded-md shadow-md'>{inputComponent}</div>
      <div>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-md mr-2 `}
          onClick={() => {
            setCancelClicked(true);
          }}>
          {CANCEL_BUTTON}
        </button>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-md mr-2 `}
          onClick={() => {
            setSubmitClicked(true);
          }}>
          {SUBMIT_BUTTON}
        </button>
      </div>
    </>
  );
};

export default Input;
