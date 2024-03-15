import { Request, Response } from "express";
import { resolve } from "path";

import { fnBundleQuery } from "../context/_queryContextMaker";

export const fnHandleFetchQuery = (req: Request, res: Response) => {
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

export const fnHandlePostData = (req: Request, res: Response) => {
  const data = req.body;
  console.log(`Data received: ${data}`);
  res.status(200).json({ message: "Data received" });
};

// export const fnHandlePostData = (req: Request, res: Response) => {
//   const jsonString = req.body; // Assuming req.body is a stringified JSON
//   const data = JSON.parse(jsonString);
//   console.log("Data received:", data); // Log as an object
//   res.status(200).json({ message: "Data received" });
// };
