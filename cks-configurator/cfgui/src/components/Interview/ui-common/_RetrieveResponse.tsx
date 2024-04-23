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
  INPUT_ZZZ,
  INPUT_REPEAT,
} from "../defs/constants/ComponentNames";

import Text from "../ui-ops/Text";
import Bool from "../ui-ops/Bool";
import Int from "../ui-ops/Int";
import Dec from "../ui-ops/Dec";
import PickOne from "../ui-ops/PickOne";
import PickMany from "../ui-ops/PickMany";
import Repeat from "../ui-ops/Repeat";
import { fnRetrieveQueryObject } from "../state-mgt/dataAccess/hiLevelAccess";
import Diagnostics from "./Diagnostics";
import { ZZZ } from "../zzzComponent/ZZZ";
// import { fnCursorMoveBack } from "../state-mgt/cursor/cursor";

const _RetrieveResponse: React.FC<InputProps> = ({
  onNextResponse,
  onBackResponse,
  inputType,
}) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Display");

  useEffect(() => {
    try {
      const queryObject = fnRetrieveQueryObject();
      if (!queryObject) {
        setErrorMessage("Error: Query object is empty.");
        setActiveTab("Error");
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
      setErrorMessage("Error: Failed to retrieve data");
      setActiveTab("Error");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
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
        INPUT_REPEAT,
        INPUT_ZZZ,
      ].includes(inputType)
    ) {
      setErrorMessage(`Invalid inputType: ${inputType}`);
      setActiveTab("Error");
    } else {
      setErrorMessage(null);
    }
  }, [inputType]);

  let inputComponent;
  const queryObject = fnRetrieveQueryObject();
  if (!queryObject) {
    return null;
  }

  switch (inputType) {
    case INPUT_TEXT:
      inputComponent = (
        <Text
          queryObject={queryObject}
          onNextResponse={onNextResponse}
          onBackResponse={onBackResponse}
        />
      );
      break;

    case INPUT_BOOL:
      inputComponent = (
        <Bool
          queryObject={queryObject}
          onNextResponse={onNextResponse}
          onBackResponse={onBackResponse}
        />
      );
      break;

    case INPUT_INT:
      inputComponent = (
        <Int
          queryObject={queryObject}
          onNextResponse={onNextResponse}
          onBackResponse={onBackResponse}
        />
      );
      break;

    case INPUT_DEC:
      inputComponent = (
        <Dec
          queryObject={queryObject}
          onNextResponse={onNextResponse}
          onBackResponse={onBackResponse}
        />
      );
      break;

    case INPUT_PICKONE:
      inputComponent = (
        <PickOne
          queryObject={queryObject}
          onNextResponse={onNextResponse}
          onBackResponse={onBackResponse}
        />
      );
      break;

    case INPUT_PICKMANY:
      inputComponent = (
        <PickMany
          queryObject={queryObject}
          onNextResponse={onNextResponse}
          onBackResponse={onBackResponse}
        />
      );
      break;

    case INPUT_REPEAT:
      inputComponent = (
        <Repeat
          queryObject={queryObject}
          onNextResponse={onNextResponse}
          onBackResponse={onBackResponse}
        />
      );
      break;

    case INPUT_ZZZ:
      inputComponent = (
        <ZZZ
          queryObject={queryObject}
          onNextResponse={onNextResponse}
          onBackResponse={onBackResponse}
        />
      );
      break;

    default:
      inputComponent = null;
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex justify-between px-4'>
        <div className='flex'>
          {errorMessage && (
            <button
              className={`cursor-pointer p-2 rounded-t-md ${
                activeTab === "Error" ? "bg-gray-100" : ""
              }`}
              onClick={() => setActiveTab("Error")}>
              Error
            </button>
          )}
          <button
            className={`cursor-pointer p-2 rounded-t-md ${
              activeTab === "Display" ? "bg-gray-100" : ""
            }`}
            onClick={() => setActiveTab("Display")}>
            Display
          </button>
          <button
            className={`cursor-pointer p-2 rounded-t-md ${
              activeTab === "Diagnostics" ? "bg-gray-100" : ""
            }`}
            onClick={() => setActiveTab("Diagnostics")}>
            Diagnostics
          </button>
        </div>
      </div>

      <div
        id='idDisplay'
        className={`p-4 ${
          activeTab === "Display" ? "block bg-gray-100" : "hidden"
        }`}>
        {isLoading && <div>Loading...</div>}
        <h2 className='text-lg font-bold mb-2'>{prompt}</h2>
        <div className='p-4 border rounded-md shadow-md'>{inputComponent}</div>
      </div>

      {errorMessage && (
        <div
          className={`p-4 ${
            activeTab === "Error" ? "block bg-gray-100" : "hidden"
          }`}>
          <h3 className='text-red-500 font-bold'>Error:</h3>
          <p>{errorMessage}</p>
        </div>
      )}

      <div
        className={`p-4 ${
          activeTab === "Diagnostics" ? "block bg-gray-100" : "hidden"
        }`}>
        <h3 className='text-blue-500 font-bold'>Diagnostics:</h3>
        <Diagnostics debug={true} />
      </div>
    </div>
  );
};

export default _RetrieveResponse;
