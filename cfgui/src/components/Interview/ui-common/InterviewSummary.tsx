import { useState } from "react";
import Finish from "./Finish";

export function InterviewSummary() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div style={{ display: isOpen ? "block" : "none" }}>
      <h2>Interview Summary</h2>
      <Finish />
      <button onClick={handleClose}>Close</button>
    </div>
  );
}
