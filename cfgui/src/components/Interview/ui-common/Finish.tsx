import React, { useEffect } from "react";
import { logListingSuccess } from "../state-mgt/setupForResponse";
import { fnGetAllPreOrderAnswers } from "../state-mgt/dataAccess/hiLevelAccess";
import { KEY_VAL } from "../../../shared/defs/constants";
import { valtioStore } from "../defs/types/ValtioTypes";

interface IFinishProps {
  debug?: boolean;
}

const Finish: React.FC<IFinishProps> = ({ debug = true }) => {
  useEffect(() => {
    logListingSuccess();
  }, []); // Run once after initial rendering

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
    <>
      <div className='mb-4'>
        <h3 className='text-lg font-semibold mb-2'>All questions answered!</h3>
        <ul>
          {valList.map((answer, index) => (
            <li key={index}>{`Question ${index + 1}: ${answer}`}</li>
          ))}
        </ul>
      </div>
      {debug === true && (
        <div className='bg-gray-200 p-4 rounded-lg'>
          <h1 className='text-xl font-bold mb-2'>Debug Data</h1>
          <pre className='whitespace-pre-wrap'>
            {JSON.stringify(valtioStore.queryContext, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
};

export default Finish;
