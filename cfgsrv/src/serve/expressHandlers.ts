import { Request, Response } from "express";
import { resolve } from "path";

import { fnBundleQuery } from "../context/_queryContextMaker";

export const handleFetchQuery = (req: Request, res: Response) => {
  const libAddress = req.query.libAddress as string;
  const prodPath = req.query.relProdPath as string;
  const directoryPath = resolve(libAddress, prodPath);

  const { error, queryBundle } = fnBundleQuery(directoryPath);
  if (error) {
    console.log(error);
    return { error, queryBundle: null };
  }

  res.status(200).json(queryBundle);
};
