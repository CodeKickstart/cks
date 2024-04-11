import React, { useState, useEffect, useCallback } from "react";

import { KEY_VAL } from "../../../shared/defs/constants";
import { fnSetQueryAttribute } from "../state-mgt/dataAccess/loLevelAccess";
import { JsonObjectType } from "../../../shared/defs/types";
import QuestionResponses from "../ui-common/QuestionResponses";
import { valtioStore } from "../defs/types/ValtioTypes";
import {
  ZZZ_END,
  ZZZ_STATE_1,
  ZZZ_STATE_2,
} from "../defs/constants/ComponentNames";
import { fnUpload } from "./setup3_upload";
import { fnGetResponseContext } from "../misc/responseContext";
import AnswerContext from "../ui-common/ResponseContext";
import { fnRunPostOrderProcessing } from "./setup2_responseContext";
import { fnIsItTheFirstQuestion } from "../state-mgt/cursor/cursor";

interface Props {
  queryObject: JsonObjectType;
  onNextResponse: () => void;
  onBackResponse: () => void;
}

const NEXT_BUTTON_LABEL = "Next";
export const ZZZ: React.FC<Props> = ({
  queryObject,
  onNextResponse,
  onBackResponse,
}) => {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [sidCursor, setSidCursor] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [backSidExist, setBackSidExist] = useState<boolean>(false);

  const fnIsValidAnswer = (answer: boolean | null) => {
    return answer !== null;
  };

  const handleNextResponse = useCallback(() => {
    if (answer !== null) {
      fnSetQueryAttribute(sidCursor, KEY_VAL, answer);
      setAnswer(null);
      onNextResponse();
      setIsVisible(false);
    }
  }, [answer, onNextResponse, sidCursor]);

  useEffect(() => {
    interface ObjTemplate {
      defval?: boolean;
      sid?: string;
    }

    const { defval, sid } = (queryObject || {}) as ObjTemplate;

    setSidCursor(sid as string);
    setBackSidExist(!fnIsItTheFirstQuestion());
    if (defval !== undefined && typeof defval === "boolean") {
      setAnswer(defval as boolean);
    }
  }, [queryObject]);

  const handleNextClick = async () => {
    if (fnIsValidAnswer(answer)) {
      switch (valtioStore.zzzState) {
        case ZZZ_STATE_1: {
          valtioStore.zzzState = ZZZ_STATE_2;

          const { error: errorRun } = fnRunPostOrderProcessing();
          if (errorRun) {
            console.log(errorRun);
          }
          try {
            const responseContext = fnGetResponseContext();
            console.log(responseContext);
            const postData = responseContext as JsonObjectType;
            valtioStore.repoonses = postData;
          } catch (error) {
            console.error("Error uploading data:", error);
          }

          break;
        }
        case ZZZ_STATE_2:
          try {
            const result = await fnUpload(valtioStore.repoonses);
            console.log(result); // Log the result
          } catch (error) {
            console.error("Error uploading data:", error);
          }
          valtioStore.zzzState = ZZZ_END;
          break;
      }

      handleNextResponse();
    }
  };

  if (!isVisible) {
    return null; // Don't render anything if isVisible is false
  }
  return (
    <>
      {valtioStore.zzzState === ZZZ_STATE_1 && <QuestionResponses />}
      {valtioStore.zzzState === ZZZ_STATE_2 && <AnswerContext />}
      <h3 className='text-lg font-semibold mb-2'>Continue?</h3>

      <div className='flex justify-start'>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
            !fnIsValidAnswer(answer) ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleNextClick}
          disabled={!fnIsValidAnswer(answer)}>
          {NEXT_BUTTON_LABEL}
        </button>
        {valtioStore.zzzState === ZZZ_STATE_1 && (
          <button
            id='back-button'
            className={`bg-blue-500 text-white px-4 py-2 rounded-md ml-2 ${
              !backSidExist ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!backSidExist}
            onClick={() => {
              onBackResponse();
            }}>
            Back
          </button>
        )}
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded-md ml-2'
          onClick={() => {
            valtioStore.earlyExit = true;
            window.location.href = "/";
          }}>
          Reset
        </button>
      </div>
    </>
  );
};
