import React, { useEffect } from "react";
import { logListingSuccess } from "../state-mgt/setupForResponse";
import { fnGetAllPreOrderAnswers } from "../state-mgt/dataAccess/hiLevelAccess";
import { KEY_VAL } from "../../../../shared/defs/constants";

const Finish: React.FC = () => {
  useEffect(() => {
    logListingSuccess();
  }, []); // Run once after initial rendering

  const { error, results: valList } = fnGetAllPreOrderAnswers<string>(KEY_VAL);
  if (error) {
    return <div>{error}</div>;
  }
  if (valList === null) {
    return <div>Answers not found</div>;
  }

  const { error: errorNameLists, results: childNameLists } =
    fnGetAllPreOrderAnswers<string[]>("descendantNames");
  if (errorNameLists) {
    return <div>{errorNameLists}</div>;
  }
  if (childNameLists === null) {
    return <div>Name lists not found</div>;
  }

  return (
    <div>
      <h3>All questions answered!</h3>
      <ul>
        {valList.map((answer, index) => (
          <li key={index}>{`Question ${index + 1}: ${answer}`}</li>
        ))}
      </ul>
      <ul>
        {childNameLists.map((nameList, index) => (
          <li key={index}>{`Question ${index + 1}: ${nameList.join(", ")}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default Finish;
