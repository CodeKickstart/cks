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
} from "../defs/constants/ComponentNames";

import Text from "../ui-ops/Text";
import Bool from "../ui-ops/Bool";
import Int from "../ui-ops/Int";
import Dec from "../ui-ops/Dec";
import PickOne from "../ui-ops/PickOne";
import PickMany from "../ui-ops/PickMany";
import { fnRetrieveQueryObject } from "../state-mgt/dataAccess/hiLevelAccess";
import Finish from "./Finish";
import { valtioStore } from "../defs/types/ValtioTypes";
import { ZZZ } from "../ui-ops/ZZZ";

const CANCEL_BUTTON = "Cancel";

const Input: React.FC<InputProps> = ({ onResponse, inputType }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Display");
  const [isVisible, setIsVisible] = useState<boolean>(true); // State for visibility

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

    case INPUT_ZZZ:
      inputComponent = (
        <ZZZ queryObject={queryObject} onResponse={onResponse} />
      );
      break;

    default:
      inputComponent = null;
  }

  if (!isVisible) {
    return null; // Hide the component if isVisible is false
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
        <Finish debug={true} />
      </div>

      <div className='flex p-4'>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-md ml-2`}
          onClick={() => {
            valtioStore.earlyExit = true;
            setIsVisible(false); // Set isVisible to false to hide the component
          }}>
          {CANCEL_BUTTON}
        </button>
      </div>
    </div>
  );
};

export default Input;
