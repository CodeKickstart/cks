import { Request, Response } from "express";
import { resolve } from "path";

import { fnBundleQuery, fnFetchRawQuery } from "../context/_queryContextMaker";
import fs from "fs";
import path from "path";

const OUTPUT = "_OUTPUT";

export const fnHandleFetchQuery = (req: Request, res: Response) => {
  const libAddress = req.query.libAddress as string;
  const prodPath = req.query.relProdPath as string;
  const directoryPath = resolve(libAddress, prodPath);

  const { error: errorFetchingData, jsonObject: usrData } =
    fnFetchRawQuery(directoryPath);
  if (errorFetchingData || !usrData) {
    return res.status(500).json({ message: "Error fetching query" });
  }

  // get current dir path
  const currentDir = process.cwd();

  const zzzDirpath = resolve(currentDir, "src/zzz-data");
  const { error: errorFetchingDataZZZ, jsonObject: zzzData } =
    fnFetchRawQuery(zzzDirpath);
  if (errorFetchingDataZZZ || zzzData == null) {
    throw new Error("Error fetching zzz data");
  }

  const totalQueryContext = { ...usrData, ...zzzData };

  const { error, queryBundle } = fnBundleQuery(totalQueryContext);
  if (error) {
    return { error, queryBundle: null };
  }

  res.status(200).json(queryBundle);
};

export const fnHandlePostData = (req: Request, res: Response) => {
  function fnWrite(data: unknown, filePath: string) {
    try {
      const directory = path.dirname(filePath);

      // Create directory if it does not exist
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      // Write data to the specified file path
      fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

      // If successful, log a success message and return an object with no error
      console.log("Data has been written to file successfully.");
      return { error: null };
    } catch (error) {
      // If an error occurs during the file write operation or directory creation,
      // return an object with the error
      return { error };
    }
  }

  const data = req.body;

  const FILENAME = "response.json";
  const rootDirpath = process.cwd();
  const repoDirpath = resolve(rootDirpath, "repo", "prod1", OUTPUT);
  const filePath = resolve(repoDirpath, FILENAME);
  const { error } = fnWrite(data, filePath);
  if (error) {
    res.status(500).json({ message: "Error writing data" });
  }

  res.status(200).json({ message: "Data received" });
};
