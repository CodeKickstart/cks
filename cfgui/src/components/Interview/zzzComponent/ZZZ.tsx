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
  ZZZ_STATE_3,
} from "../defs/constants/ComponentNames";
import { fnUpload } from "./setup3_upload";
import { fnGetResponseContext } from "../misc/responseContext";
import AnswerContext from "../ui-common/ResponseContext";
import { fnRunPostOrderProcessing } from "./setup2_responseContext";

interface Props {
  queryObject: JsonObjectType;
  onResponse: () => void;
}

const ENTER_BUTTON_LABEL = "Enter";
export const ZZZ: React.FC<Props> = ({ queryObject, onResponse }) => {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [sidCursor, setSidCursor] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const fnIsValidAnswer = (answer: boolean | null) => {
    return answer !== null;
  };

  const handleEnter = useCallback(() => {
    if (answer !== null) {
      fnSetQueryAttribute(sidCursor, KEY_VAL, answer);
      setAnswer(null);
      onResponse();
      setIsVisible(false);
    }
  }, [answer, onResponse, sidCursor]);

  useEffect(() => {
    interface ObjTemplate {
      defval?: boolean;
      sid?: string;
    }

    const { defval, sid } = (queryObject || {}) as ObjTemplate;

    setSidCursor(sid as string);

    if (defval !== undefined && typeof defval === "boolean") {
      setAnswer(defval as boolean);
    }
  }, [queryObject]);

  const handleSubmitButtonClick = async () => {
    if (fnIsValidAnswer(answer)) {
      switch (valtioStore.zzzState) {
        case "ZZZ_STATE_1": {
          valtioStore.zzzState = ZZZ_STATE_2;

          const { error: errorRun } = fnRunPostOrderProcessing();
          if (errorRun) {
            console.log(errorRun);
          }
          try {
            const responseContext = fnGetResponseContext();
            console.log(responseContext);
            const postData = responseContext as JsonObjectType;
            valtioStore.answers = postData;
          } catch (error) {
            console.error("Error uploading data:", error);
          }

          break;
        }
        case "ZZZ_STATE_2":
          valtioStore.zzzState = ZZZ_STATE_3;

          break;
        case "ZZZ_STATE_3":
          try {
            const result = await fnUpload(valtioStore.answers);
            console.log(result); // Log the result
          } catch (error) {
            console.error("Error uploading data:", error);
          }
          valtioStore.zzzState = ZZZ_END;
          break;
        default:
          break;
      }

      handleEnter();
    }
  };

  if (!isVisible) {
    return null; // Don't render anything if isVisible is false
  }
  return (
    <>
      {valtioStore.zzzState === ZZZ_STATE_1 && <QuestionResponses />}
      {valtioStore.zzzState === ZZZ_STATE_3 && <AnswerContext />}
      <h3 className='text-lg font-semibold mb-2'>Continue?</h3>

      <div className='flex justify-end'>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
            !fnIsValidAnswer(answer) ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmitButtonClick}
          disabled={!fnIsValidAnswer(answer)}>
          {ENTER_BUTTON_LABEL}
        </button>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded-md ml-2'
          onClick={() => {
            valtioStore.earlyExit = true;
            window.location.href = "/";
          }}>
          Cancel
        </button>
      </div>
    </>
  );
};
