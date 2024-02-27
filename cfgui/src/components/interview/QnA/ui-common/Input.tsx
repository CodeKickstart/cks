import React, { useEffect, useState } from "react";
import { InputProps } from "../defs/types/UITypes";

import {
  INPUT_TEXT,
  INPUT_BOOL,
  INPUT_INT,
  INPUT_DEC,
  INPUT_PICKONE,
  INPUT_LITERAL,
} from "../defs/constants/ComponentNames";
import { fnRetrieveQueryObject } from "./_support";
import Text from "../ui-ops/Text";
import Bool from "../ui-ops/Bool";
import Int from "../ui-ops/Int";
import Dec from "../ui-ops/Dec";
import PickOne from "../ui-ops/PickOne";

const CANCEL_BUTTON = "Cancel";

const Input: React.FC<InputProps> = ({ onResponse, inputType }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const queryObject = fnRetrieveQueryObject();
      if (!queryObject) {
        throw new Error("Failed to retrieve query object");
      }
      const { prompt } = queryObject;
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

  if (
    ![
      INPUT_TEXT,
      INPUT_BOOL,
      INPUT_INT,
      INPUT_DEC,
      INPUT_PICKONE,
      INPUT_LITERAL,
    ].includes(inputType)
  ) {
    console.error("Invalid inputType:", inputType);
    // Handle the error state accordingly, e.g., display an error message
    return <div>Error: Invalid inputType</div>;
  }

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

    default:
      inputComponent = null;
  }
  // const submitDisabled = false;

  return (
    <>
      {isLoading && <div>Loading...</div>}
      <h2 className='text-lg font-bold mb-2'>{prompt}</h2>
      <div className='p-4 border rounded-md shadow-md'>{inputComponent}</div>
      <div>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-md mr-2 `}
          onClick={() => {}}>
          {CANCEL_BUTTON}
        </button>
      </div>
    </>
  );
};

export default Input;
