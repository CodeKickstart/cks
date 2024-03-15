import React from "react";
import { valtioStore } from "../defs/types/ValtioTypes";

import ReactJson from "react-json-view";

interface IFinishProps {
  debug?: boolean;
}

const Diagnostics: React.FC<IFinishProps> = ({ debug = true }) => {
  return (
    // Import the JSONViewer component

    <div className='flex-1 overflow-y-auto'>
      {debug === true && (
        <div className='bg-gray-200 p-4 rounded-lg'>
          <h1 className='text-xl font-bold mb-2'>Debug Data</h1>
          <div id='idDebug' className='overflow-y-auto h-full'>
            {/* Apply overflow-y-auto and set a fixed height */}
            <pre className='whitespace-pre-wrap'>
              {typeof valtioStore.queryContext === "object" && (
                <ReactJson src={valtioStore.queryContext as object} />
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diagnostics;
