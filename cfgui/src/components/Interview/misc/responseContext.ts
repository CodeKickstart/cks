import { Str } from "../defs/types/Str";
import { valtioStore } from "../defs/types/ValtioTypes";

export const fnGetResponseContext = (): {
  error: Str;
  responseContext: { [key: string]: unknown };
} => {
  let error: Str = null;

  const responseContext = {} as { [key: string]: unknown };

  const queryContext = valtioStore.queryContext as { [key: string]: unknown };
  for (const queryName in queryContext) {
    const queryValue = queryContext[queryName];
    interface ObjTemplate {
      processedQuery?: { [key: string]: unknown };
    }

    const { processedQuery } = queryValue as ObjTemplate;
    if (processedQuery) {
      interface ObjTemplateProcessedQuery {
        sid?: string;
        val?: unknown;
      }
      const { sid, val } = processedQuery as ObjTemplateProcessedQuery;

      if (sid === undefined) {
        error = `sid or val is undefined for queryName: ${queryName}`;
        return { error, responseContext: {} };
      }

      if (!sid.startsWith("zzz")) {
        responseContext[sid] = val;
      }
    }
  }

  return { error, responseContext };
};
