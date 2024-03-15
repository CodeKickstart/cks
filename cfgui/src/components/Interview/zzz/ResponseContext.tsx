import React from "react";
import { valtioStore } from "../defs/types/ValtioTypes";

import ReactJson from "react-json-view";

const ResponseContext: React.FC = () => {
  return (
    <div className='flex-1 overflow-y-auto'>
      <div className='bg-gray-200 p-4 rounded-lg'>
        <h1 className='text-xl font-bold mb-2'>Responses</h1>
        <div className='overflow-y-auto h-full'>
          <pre className='whitespace-pre-wrap'>
            <ReactJson src={valtioStore.answers as object} />
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ResponseContext;
