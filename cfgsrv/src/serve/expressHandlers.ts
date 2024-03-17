import { Request, Response } from "express";
import { resolve } from "path";

import { fnBundleQuery } from "../context/_queryContextMaker";
import fs from "fs";

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
  function fnWrite(data: unknown, filePath: string) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
      console.log("Data has been written to file successfully.");
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  const data = req.body;
  console.log(`Data received: ${data}`);

  const fileName = "__data.json";
  const rootDirpath = process.cwd();
  console.log(`Dirpath: ${rootDirpath}`);
  const repoDirpath = resolve(rootDirpath, "repo", "prod1");
  const filePath = resolve(repoDirpath, fileName);
  const { error } = fnWrite(data, filePath);
  if (error) {
    console.log(error);
    res.status(500).json({ message: "Error writing data" });
  }

  res.status(200).json({ message: "Data received" });
};
