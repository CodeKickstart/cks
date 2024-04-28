import React from "react";
import { valtioStore } from "../defs/types/ValtioTypes";

import ReactJson from "react-json-view";
import { JsonObjectType } from "../../../shared/defs/types";

const ResponseContext: React.FC = () => {
  const _fnGetInfo = () => {
    const response = valtioStore.responses as { [key: string]: JsonObjectType };
    if (response) {
      for (const key of Object.keys(response)) {
        // console.log(key);
        if (key === "responseContext") {
          // console.log(key);
          const val = response[key];
          return val;
        }
      }
    }

    return null;
  };

  const responseContextVal = _fnGetInfo();
  return (
    <div className='flex-1 overflow-y-auto'>
      <div className='bg-gray-200 p-4 rounded-lg'>
        <h1 className='text-xl font-bold mb-2'>Responses</h1>
        <div className='overflow-y-auto h-full'>
          <pre className='whitespace-pre-wrap'>
            <ReactJson src={responseContextVal as object} />
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ResponseContext;
