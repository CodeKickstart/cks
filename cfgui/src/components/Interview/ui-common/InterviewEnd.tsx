const InterviewEnd = () => {
  return (
    <>
      <h3 className='text-lg font-semibold mb-2'>
        Successfully collected your answers
      </h3>
      <div>Interview results will be uploaded</div>
      <div>
        Please click the button below or the Home link above to return to the
        home display
      </div>
      <button
        className='bg-green-500 text-white px-4 py-2 rounded-md ml-2'
        onClick={() => {
          window.location.href = "/";
        }}>
        Home
      </button>
    </>
  );
};

export default InterviewEnd;
