import React, { useEffect, useState } from "react";
import { logListingSuccess } from "../state-mgt/setupForResponse";
import { fnGetAllPreOrderAnswers } from "../state-mgt/dataAccess/hiLevelAccess";
import { KEY_VAL } from "../../../shared/defs/constants";
import { valtioStore } from "../defs/types/ValtioTypes";

interface IFinishProps {
  debug?: boolean;
}

const Finish: React.FC<IFinishProps> = ({ debug = true }) => {
  const [screenHeight, setScreenHeight] = useState<number>(0);
  useEffect(() => {
    logListingSuccess();
  }, []); // Run once after initial rendering

  useEffect(() => {
    // Calculate the screen height
    const height = window.innerHeight;
    setScreenHeight(height);

    // Add event listener for window resize to update screen height
    const handleResize = () => {
      const newHeight = window.innerHeight;
      setScreenHeight(newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { error, results: valList } = fnGetAllPreOrderAnswers<string>(KEY_VAL);
  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }
  if (valList === null) {
    return <div className='text-red-500'>Answers not found</div>;
  }

  const { error: errorNameLists, results: childNameLists } =
    fnGetAllPreOrderAnswers<string[]>("descendantNames");
  if (errorNameLists) {
    return <div className='text-red-500'>{errorNameLists}</div>;
  }
  if (childNameLists === null) {
    return <div className='text-red-500'>Name lists not found</div>;
  }

  return (
    <div className='flex-1 overflow-y-auto'>
      {debug === true && (
        <div className='bg-gray-200 p-4 rounded-lg'>
          <h1 className='text-xl font-bold mb-2'>Debug Data</h1>
          <div id='idDebug' className='overflow-y-auto h-${screenHeight}'>
            {/* Apply overflow-y-auto and set a fixed height */}
            <pre className='whitespace-pre-wrap'>
              {JSON.stringify(valtioStore.queryContext, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finish;
