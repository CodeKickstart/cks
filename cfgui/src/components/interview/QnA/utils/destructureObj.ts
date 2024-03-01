// Define a generic function that takes a generic type T
export const fnDestructureJsonObj = <T extends Record<string, unknown>>(
  jsonObj: T,
  keyNames: (keyof T)[]
) => {
  const result: Partial<T> = {}; // Use Partial<T> to allow undefined values

  // Iterate through the provided keyNames
  keyNames.forEach((key) => {
    result[key] = jsonObj[key]; // Assign the value from jsonObj to the result object
  });

  return result; // Return the result object
};
