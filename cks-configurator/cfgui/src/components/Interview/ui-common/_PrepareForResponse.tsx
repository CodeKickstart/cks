import React, { useState, useCallback } from "react";

import { fnMoveToPrevious, fnMoveToNext } from "../misc/componentPicker";
import { fnSetupForInterview } from "../zzzComponent/setup1_interview";
import {
  KIND_ERROR,
  KIND_FINISH,
  COMPONENT_INPUT,
} from "../defs/constants/ComponentNames";
import { Err } from "./Err";
import { fnBypassForward } from "../misc/interviewBypass";
import { Str } from "../defs/types/Str";

import { InputType } from "../defs/types/UITypes";
import _RetrieveResponse from "./_RetrieveResponse";
import { fnGetQueryAttributeString } from "../state-mgt/dataAccess/loLevelAccess";
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
      throw new Error(errorInit);
    }

    setInterviewStarted(true);
    if (sidCursor === null || sidCursor === undefined) {
      setSelectedResponseComponent(KIND_FINISH);
      return;
    }

    const { error, newSidCursor } = fnBypassForward(sidCursor);
    if (error || !newSidCursor) {
      throw new Error(`_PrepareForResponse: error?.toString()`);
    }

    const { error: errorKind, value: kind } = fnGetQueryAttributeString(
      newSidCursor,
      KEY_KIND
    );
    if (errorKind || !kind) {
      return { errorKind, sidCursor: null };
    }
    setInputKind(kind as InputType);
    setSelectedResponseComponent(COMPONENT_INPUT);
  }, [setSelectedResponseComponent]);

  const handleNext = useCallback(() => {
    const { error, newKind } = fnMoveToNext();
    if (error) {
      setSelectedResponseComponent(KIND_ERROR);
    } else {
      if (newKind === KIND_FINISH) {
        setSelectedResponseComponent(KIND_FINISH);
      } else {
        setInputKind(newKind as InputType);
        setSelectedResponseComponent(COMPONENT_INPUT);
      }

      setRerenderFlag((prev) => !prev); // Toggle rerenderFlag to force a re-render
    }
  }, []);

  const handleBack = useCallback(() => {
    const { error, newKind } = fnMoveToPrevious();
    if (error) {
      setSelectedResponseComponent(KIND_ERROR);
    } else {
      if (newKind === KIND_FINISH) {
        setSelectedResponseComponent(KIND_FINISH);
      } else {
        setInputKind(newKind as InputType);
        setSelectedResponseComponent(COMPONENT_INPUT);
      }

      setRerenderFlag((prev) => !prev); // Toggle rerenderFlag to force a re-render
    }
  }, []);

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
