// InterviewEnd.tsx
import React from "react";

interface WelcomeProps {
  onStart: () => void;
}

const InterviewEnd: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className='p-4 border rounded-md shadow-md'>
      <h3 className='text-xl font-bold mb-2'>InterviewEnd</h3>
      <p>InterviewEnd to the interview session!</p>
      <button
        className='bg-green-500 text-white px-4 py-2 rounded-md mt-2'
        onClick={onStart}>
        Start
      </button>
    </div>
  );
};

export default InterviewEnd;
