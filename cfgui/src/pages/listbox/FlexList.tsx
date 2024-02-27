// FlexList.tsx

import React from "react";

interface FlexListProps {
  items: string[];
}

const FlexList: React.FC<FlexListProps> = ({ items }) => {
  return (
    <div>
      <div className='log-content bg-white border border-solid border-red-500 overflow-y-scroll overflow-x-scroll '>
        {items.map((item, index) => (
          <div key={index} className='p-2 border-b'>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlexList;
