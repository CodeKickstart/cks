import React from "react";

interface Props {
  answer: string | null;
  fnIsValidAnswer: (answer: string) => boolean;
  handleSubmitButtonClick: () => void;
  ENTER_BUTTON_LABEL: string;
}

const EnterComponent: React.FC<Props> = ({
  answer,
  fnIsValidAnswer,
  handleSubmitButtonClick,
  ENTER_BUTTON_LABEL,
}) => {
  return (
    <div id='Enter'>
      <div className='flex-grow' />
      <div>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
            !fnIsValidAnswer(answer ?? "")
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={handleSubmitButtonClick}
          disabled={!fnIsValidAnswer(answer ?? "")}>
          {ENTER_BUTTON_LABEL}
        </button>
      </div>
    </div>
  );
};

export default EnterComponent;
