import React, { useState } from "react";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS
import { JsonObjectType } from "../../../cfgui/src/shared/defs/types";

interface OptionsComponentProps {
  id: string;
  options: string[];
  input?: JsonObjectType;
}

const Pick1: React.FC<OptionsComponentProps> = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleOptionChange = (index: number) => {
    setSelectedOption(index);
    setIsButtonDisabled(false); // Enable the button when an option is selected
    console.log(`Selected option index: ${index}`);
  };

  const handleSubmission = () => {
    if (selectedOption !== null) {
      console.log("Submitted option index:", selectedOption);
      // Reset the selection and disable the button
      setSelectedOption(null);
      setIsButtonDisabled(true);
    } else {
      console.log("No option selected");
    }
  };

  return (
    <div className='border border-black rounded p-2 m-2'>
      <h3 className='text-lg font-bold mb-2'>Prompt: Options</h3>
      {options.map((option, index) => (
        <div key={index} className='mb-2'>
          <input
            type='radio'
            id={`option-${index}`}
            name='options'
            checked={selectedOption === index}
            onChange={() => handleOptionChange(index)}
            className='mr-2'
          />
          <label
            htmlFor={`option-${index}`}
            className='cursor-pointer pickone-none'>
            {option}
          </label>
        </div>
      ))}
      <button
        onClick={handleSubmission}
        disabled={isButtonDisabled}
        className={`bg-blue-500 text-white p-2 rounded mt-4 ${
          isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
        }`}>
        Submit
      </button>
    </div>
  );
};

export default Pick1;
