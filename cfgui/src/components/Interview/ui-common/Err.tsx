import React from "react";

interface IErrProps {
  msg?: string;
}

export const Err: React.FC<IErrProps> = ({ msg }) => {
  return (
    <div
      className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
      role='alert'>
      <h3 className='font-bold'>
        {msg ? `Error: ${msg}` : "Error: Invalid component selected"}
      </h3>
    </div>
  );
};
