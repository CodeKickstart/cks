import React, { useState, useRef, useEffect } from "react";
// import { valtioStore } from "../defs/types/ValtioTypes";

interface QuestionnaireProps {
  question: string;
  onCancel: () => void;
  onFinish: () => void;
  onResponse: () => void;
}

const Questionnaire2: React.FC<QuestionnaireProps> = ({
  question,
  onCancel,
  onFinish,
  onResponse,
}) => {
  const [answer, setAnswer] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleNext = () => {
    // valtioStore.answers.push(answer);
    setAnswer("");
    onResponse();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

  return (
    <div className='p-4 border rounded-md shadow-md'>
      <h3 className='text-xl font-bold mb-2'>Questionnaire2</h3>
      <h2 className='text-lg font-bold mb-2'>{question}</h2>
      <input
        ref={inputRef}
        type='text'
        className='border rounded-md px-2 py-1 mb-2 w-full'
        value={answer}
        placeholder='Enter your response here'
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded-md mr-2'
          onClick={handleNext}>
          Next
        </button>
        <button
          className='bg-gray-500 text-white px-4 py-2 rounded-md mr-2'
          onClick={onCancel}>
          Cancel
        </button>
        <button
          className='bg-green-500 text-white px-4 py-2 rounded-md'
          onClick={onFinish}>
          Finish
        </button>
      </div>
    </div>
  );
};

export default Questionnaire2;
