import { Dictionary } from "express-serve-static-core";
import fs from "fs";
import { readFileSync } from "fs";
import { resolve } from "path";
import { JsonObjectType } from "../shared/defs/types";

export const fnReadJsonDirectory = (directoryPath: string): JsonObjectType => {
  let jsonFiles: string[];
  try {
    jsonFiles = fs
      .readdirSync(directoryPath)
      .filter((file) => file.endsWith(".json"))
      .map((file) => resolve(directoryPath, file));
  } catch (err) {
    return { error: `Error reading directory`, jsonData: null };
  }

  const allJsonData: Dictionary<string> = {};
  try {
    jsonFiles.map((filePath) => {
      const jsonData = readFileSync(filePath, "utf-8");
      const parsedJsonData = JSON.parse(jsonData);
      const fileName = filePath.split("/").pop();
      if (!fileName) {
        return { error: `Error parsing JSON file`, jsonData: null };
      }
      const fileNameWithoutExtension = fileName.split(".")[0];
      allJsonData[fileNameWithoutExtension] = parsedJsonData;
    });
  } catch (err) {
    return { error: `Error parsing JSON file`, jsonData: null };
  }

  return { error: null, jsonData: allJsonData };
};
