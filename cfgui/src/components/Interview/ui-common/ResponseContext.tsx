import React from "react";
import { valtioStore } from "../defs/types/ValtioTypes";

interface Props {
  debug?: boolean;
}

const ResponseContext: React.FC<Props> = ({ debug = false }: Props) => {
  return (
    <div className='flex-1 overflow-y-auto'>
      {debug && (
        <div className='p-4'>
          <h1 className='text-2xl'>Response Context</h1>
          <pre>{JSON.stringify(valtioStore, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ResponseContext;
