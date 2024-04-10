import React, { useState, useCallback, useEffect } from "react";

import { fnMoveBack, fnMoveToNext } from "../misc/componentPicker";
import { fnSetupForInterview } from "../zzzComponent/setup1_interview";
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
import _RetrieveResponse from "./_RetrieveResponse";
import {
  fnGetQueryAttributeString,
  fnSetBackSid,
} from "../state-mgt/dataAccess/loLevelAccess";
import { KEY_KIND } from "../../../shared/defs/constants";
import InterviewEnd from "./InterviewEnd";
import InterviewBegin from "./InterviewBegin";

const _PrepareForResponse: React.FC = () => {
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

    const errSetBackPointer = fnSetBackSid(nextSidCursor);
    // setPrevSidCursor(nextSidCursor);
    if (errSetBackPointer) {
      return { error: errSetBackPointer, nextSidCursor: null };
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
    const { error, nextKind } = fnMoveToNext();
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
  }, []);

  const handleBack = useCallback(() => {
    const { error, nextKind } = fnMoveBack();
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
  }, []);

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
          <_RetrieveResponse
            onNextResponse={handleNext}
            onBackResponse={handleBack}
            inputType={inputKind as InputType}
            key={rerenderFlag ? "text-1" : "text-2"}
          />
        );
      case KIND_ERROR:
        return <Err />;
      case KIND_FINISH:
        return <InterviewEnd />;
      default:
        return <Err />;
    }
  };

  return (
    <div className='container mx-auto p-4'>
      {!interviewStarted && <InterviewBegin onStart={handleStartInterview} />}
      {interviewStarted && !interviewFinished && _fnRenderCore()}
    </div>
  );
};

export default _PrepareForResponse;
