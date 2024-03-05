import React from "react";
import { valtioStore } from "../defs/types/ValtioTypes";

interface Props {
  examine?: boolean;
}

const QueryContext: React.FC<Props> = ({ examine: debug = false }: Props) => {
  return (
    <>
      {debug && (
        <div className='flex-col'>
          <h1 className='text-2xl'>Query Context</h1>
          <pre>{JSON.stringify(valtioStore.queryContext, null, 2)}</pre>
          <br />
        </div>
      )}
    </>
  );
};

export default QueryContext;
