const InterviewEnd = () => {
  return (
    <>
      <h3 className='text-lg font-semibold mb-2'>
        Successfully collected your answers
      </h3>
      <div className='text-lg mt-2'>Interview results will be uploaded</div>
      <div className='italic text-lg mt-4 mb-4'>
        Please click on the Home link above or the Home button below to return
        to the main display
      </div>
      <button
        className='bg-blue-500 text-white px-4 py-2 rounded-md ml-2  mx-auto'
        onClick={() => {
          window.location.href = "/";
        }}>
        Home
      </button>
    </>
  );
};

export default InterviewEnd;
