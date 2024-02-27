import React, { useEffect } from "react";
import { logListingSuccess } from "../state-mgt/setupForResponse";
import { fnGetAllPreOrderAnswers } from "../state-mgt/dataAccess/hiLevelAccess";

const Finish: React.FC = () => {
  useEffect(() => {
    logListingSuccess();
  }, []); // Run once after initial rendering

  const { error, answers } = fnGetAllPreOrderAnswers();
  if (error) {
    return <div>{error}</div>;
  }
  if (answers === null) {
    return <div>Answers not found</div>;
  }

  return (
    <div>
      <h3>All questions answered!</h3>
      <ul>
        {answers.map((answer, index) => (
          <li key={index}>{`Question ${index + 1}: ${answer}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default Finish;
