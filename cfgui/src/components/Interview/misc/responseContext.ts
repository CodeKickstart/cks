import { valtioStore } from "../defs/types/ValtioTypes";

export const fnGetResponseContext = () => {
  // return valtioStore.postOrderList;
  const responseContext = {} as { [key: string]: unknown };

  const queryContext = valtioStore.queryContext as { [key: string]: unknown };
  for (const key in queryContext) {
    const value = queryContext[key];

    responseContext[key] = value;
  }

  return responseContext;
};
