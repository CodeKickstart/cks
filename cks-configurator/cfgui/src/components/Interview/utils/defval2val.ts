export const fnConverListDefvalToVal = (
  listOfDescendantNames: string[],
  defVal: string[] | number[] | null | undefined
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

export const fnConverSingleDefvalToVal = (
  listOfDescendantNames: string[],
  defVal: string | number | null | undefined
): { val: number } => {
  if (defVal === undefined || defVal === null) {
    return { val: -1 };
  }

  if (typeof defVal === "number") {
    return { val: defVal as number };
  }

  if (typeof defVal === "string") {
    for (let i = 0; i < listOfDescendantNames.length; i++) {
      if (listOfDescendantNames[i] === defVal) {
        return { val: i };
      }
    }
    return { val: -1 };
  }
  return { val: -1 };
};
