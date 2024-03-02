import { Str } from "../defs/types/Str";

export function fnCapitalizeFirstLetter(str: Str): string {
  if (str === null) {
    return ""; // or throw an error, log a message, or return a default value
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
