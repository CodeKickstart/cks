import React, { useState, useCallback, useEffect } from "react";
import InterviewEnd from "./InterviewBegin";
// import Diagnostics from "./Diagnostics";
import { fnPickNextKind } from "../misc/componentPicker";
import { fnSetupForInterview } from "../state-mgt/setupForInterview";
import {
  KIND_ERROR,
  KIND_FINISH,
  COMPONENT_INPUT,
} from "../defs/constants/ComponentNames";
import { Err } from "./Err";
import { fnBypassUserResponses } from "../misc/interviewBypass";
import { Str } from "../defs/types/Str";

import { fnComputeAndStoreLastQuestionIndex } from "../misc/computeLastQuestionIndex";

import { InputType } from "../defs/types/UITypes";
import Input from "./Input";
import { fnGetQueryAttributeString } from "../state-mgt/dataAccess/loLevelAccess";
import { KEY_KIND } from "../../../shared/defs/constants";
import QuestionResponses from "./QuestionResponses";

const QnA: React.FC = () => {
  const [interviewStarted, setInterviewStarted] = useState<boolean>(false);
  const [interviewFinished] = useState<boolean>(false);
  const [selectedResponseComponent, setSelectedResponseComponent] =
    useState<Str>(COMPONENT_INPUT);
  const [rerenderFlag, setRerenderFlag] = useState<boolean>(false);
  const [inputKind, setInputKind] = useState<InputType>();

  const handleStartInterview = useCallback(() => {
    const { error: errorInit, sidCursor } = fnSetupForInterview();
    if (errorInit) {
      console.log(errorInit);
      return;
    }

    const { error: errorComputingLastQuestion, lastQuestionIndex } =
      fnComputeAndStoreLastQuestionIndex();
    if (errorComputingLastQuestion) {
      console.log(errorComputingLastQuestion);
      return;
    }

    console.log(`lastQuestionIndex: ${lastQuestionIndex}`);
    setInterviewStarted(true);
    if (sidCursor === null || sidCursor === undefined) {
      setSelectedResponseComponent(KIND_FINISH);
      return;
    }

    const { error, nextSidCursor } = fnBypassUserResponses(sidCursor);
    if (error || !nextSidCursor) {
      console.log(error);
      return;
    }
    const { error: errorKind, value: kind } = fnGetQueryAttributeString(
      nextSidCursor,
      KEY_KIND
    );
    if (errorKind || !kind) {
      return { errorKind, sidCursor: null };
    }
    setInputKind(kind as InputType);
    setSelectedResponseComponent(COMPONENT_INPUT);
  }, [setSelectedResponseComponent]);

  const handleNext = useCallback(() => {
    const { error, nextKind } = fnPickNextKind(selectedResponseComponent);
    if (error) {
      setSelectedResponseComponent(KIND_ERROR);
    } else {
      if (nextKind === KIND_FINISH) {
        setSelectedResponseComponent(KIND_FINISH);
      } else {
        setInputKind(nextKind as InputType);
        setSelectedResponseComponent(COMPONENT_INPUT);
      }

      setRerenderFlag((prev) => !prev); // Toggle rerenderFlag to force a re-render
    }
  }, [selectedResponseComponent]);

  useEffect(() => {
    // Logic to handle actions when interviewFinished changes
    if (interviewFinished) {
      console.log("Interview finished.");
    }
  }, [interviewFinished]);

  const _fnRenderCore = () => {
    switch (selectedResponseComponent) {
      case COMPONENT_INPUT:
        return (
          <Input
            onResponse={handleNext}
            inputType={inputKind as InputType}
            key={rerenderFlag ? "text-1" : "text-2"}
          />
        );
      case KIND_ERROR:
        return <Err />;
      case KIND_FINISH:
        return <QuestionResponses />;
      default:
        return <Err />;
    }
  };

  return (
    <div className='container mx-auto p-4'>
      {!interviewStarted && <InterviewEnd onStart={handleStartInterview} />}
      {interviewStarted && !interviewFinished && _fnRenderCore()}
    </div>
  );
};

export default QnA;
