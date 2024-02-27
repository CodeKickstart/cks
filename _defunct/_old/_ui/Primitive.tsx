import React, { useState, ChangeEvent, FormEvent } from "react";
import { JsonObjectType } from "../../../cfgui/src/shared/defs/types";

interface PrimitiveProps {
  id: string;
  prompt?: string;
  processedQuery?: JsonObjectType;
  fnCallbackInfo: (response: { userResponse: string }) => void;
}

const Primitive: React.FC<PrimitiveProps> = ({
  processedQuery,
  fnCallbackInfo,
}) => {
  const promptValue: string = processedQuery!.prompt as string;
  const [userResponse, setUserResponse] = useState<string>("");

  const handleUserResponseChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserResponse(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (userResponse.trim() === "") {
      // Do not submit if input is empty
      return;
    }

    // console.log("User Response:", userResponse);
    // Call the callback with the user response
    fnCallbackInfo && fnCallbackInfo({ userResponse });

    // Clear the input value after submission
    setUserResponse("");
  };

  return (
    <div className='w-full mx-0 mt-8 p-4 bg-gray-200 rounded shadow'>
      <p className='text-xl font-bold mb-4'>Primitive</p>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label
            htmlFor='idUserResponse'
            className='block text-sm font-medium text-gray-700'>
            {promptValue}
          </label>
          <input
            type='text'
            id='idUserResponse'
            value={userResponse}
            onChange={handleUserResponseChange}
            className='mt-1 p-2 border rounded w-full'
          />
        </div>
        <button
          type='submit'
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            userResponse.trim() === "" && "cursor-not-allowed opacity-50"
          }`}
          disabled={userResponse.trim() === ""}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Primitive;
