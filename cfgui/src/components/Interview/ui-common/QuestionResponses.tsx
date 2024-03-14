import React from "react";
// import { logListingSuccess } from "../state-mgt/setupForResponse";
import { fnGetAllPreOrderAnswers } from "../state-mgt/dataAccess/hiLevelAccess";
import { KEY_VAL } from "../../../shared/defs/constants";

const QuestionResponses: React.FC = () => {
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
    <div className='mb-4'>
      <h3 className='text-lg font-semibold mb-2'>Questions answered!</h3>
      <ul>
        {valList.map((answer, index) => (
          <li key={index}>{`Question ${index + 1}: ${answer}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionResponses;
