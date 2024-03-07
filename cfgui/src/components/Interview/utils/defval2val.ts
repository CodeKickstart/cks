export const fnConvertDefvalToVal = (
  listOfDescendantNames: string[],
  defVal: string[] | number[]
): { val: number[] } => {
  if (!defVal) {
    return { val: [] };
  }

  if (
    Array.isArray(defVal) &&
    defVal.every((element) => typeof element === "number")
  ) {
    return { val: defVal as number[] };
  }

  if (
    Array.isArray(defVal) &&
    defVal.every((element) => typeof element === "string")
  ) {
    const ansArray: number[] = [];
    for (let i = 0; i < listOfDescendantNames.length; i++) {
      for (let j = 0; j < defVal.length; j++) {
        if (i === j) {
          ansArray.push(i);
        }
      }
    }
    return { val: ansArray };
  }
  return { val: [] };
};
