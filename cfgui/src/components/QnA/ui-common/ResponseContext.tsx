import React from "react";
import { valtioStore } from "../defs/types/ValtioTypes";

interface Props {
  examine?: boolean;
}

const ResponseContext: React.FC<Props> = ({
  examine: debug = false,
}: Props) => {
  return (
    <>
      {debug && (
        <div className='flex-col'>
          <h1 className='text-2xl'>Response Context</h1>
          <pre>{JSON.stringify(valtioStore.queryContext, null, 2)}</pre>
          <br />
        </div>
      )}
    </>
  );
};

export default ResponseContext;
