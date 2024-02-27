import React, { useState } from "react";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS

interface PickNComponentProps {
  id: string;
  options: string[];
}

const PickN: React.FC<PickNComponentProps> = ({ options }) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleOptionChange = (index: number) => {
    // Toggle the selection
    const updatedOptions = selectedOptions.includes(index)
      ? selectedOptions.filter((selectedIndex) => selectedIndex !== index)
      : [...selectedOptions, index];

    setSelectedOptions(updatedOptions);
    setIsButtonDisabled(updatedOptions.length === 0);
  };

  const handleSubmission = () => {
    console.log("Selected option indices:", selectedOptions);
    // Reset the selections and disable the button
    setSelectedOptions([]);
    setIsButtonDisabled(true);
  };

  return (
    <div className='border border-black rounded p-2 m-2'>
      <h3 className='text-lg font-bold mb-2'>Prompt: Options</h3>
      {options.map((option, index) => (
        <div key={index} className='mb-2'>
          <input
            type='checkbox'
            id={`option-${index}`}
            checked={selectedOptions.includes(index)}
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

export default PickN;
