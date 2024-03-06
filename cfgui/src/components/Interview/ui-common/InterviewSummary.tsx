import { useState } from "react";
import Finish from "./Finish";

export function InterviewSummary() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={`p-4 ${isOpen ? "block" : "hidden"}`}>
      <h2 className='text-2xl font-bold mb-4'>Interview Summary</h2>
      <Finish debug={true} />
      <button
        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        onClick={handleClose}>
        Close
      </button>
    </div>
  );
}
