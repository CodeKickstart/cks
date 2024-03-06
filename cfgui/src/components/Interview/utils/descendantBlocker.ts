import { KEY_BLOCKED } from "../../../shared/defs/constants";
import { JsonObjectType } from "../../../shared/defs/types";
import { Str } from "../defs/types/Str";

export const fnBlockUnselectedChildren = (
  queryObject: JsonObjectType
): { error: Str } => {
  console.log(`Query object: ${queryObject}`);

  interface ObjTemplate {
    children?: object;
    val?: number[] | number;
    // Other properties as needed
  }
  const { children, val } = queryObject as ObjTemplate;
  if (children === undefined || val === undefined) {
    return { error: "Failed to retrieve children or answer from query object" };
  }

  interface ObjTemplateChildren {
    kind?: string;
  }

  let valArray: number[] = [];
  if (typeof val === "number") {
    // pickone literal
    valArray = [val];
  }

  if (
    // pickmany literal
    Array.isArray(val) &&
    val.every((element) => typeof element === "number")
  ) {
    valArray = val;
  }

  const { kind } = children as ObjTemplateChildren;
  if (kind === undefined) {
    let index = 0;
    for (const [k, v] of Object.entries(children as object)) {
      console.log(`Key: ${k}, Value: ${v}`);
      if (!valArray.includes(index)) {
        const value = v as object;
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "object"
        ) {
          interface ObjTemplateValue {
            blocked?: boolean;
          }
          const value = v as ObjTemplateValue;
          value[KEY_BLOCKED] = true;
        }
      }

      index++;
    }
  }

  return { error: null };
};
