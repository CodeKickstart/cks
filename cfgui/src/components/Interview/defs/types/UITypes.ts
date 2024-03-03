export interface Option {
  label: string;
  value: string;
}

export interface InputProps {
  onResponse: () => void;
  onOpEnded: () => void;
  inputType: InputType;
  pickOneProps?: { options: Option[] };
}

export type InputType =
  | "text"
  | "pickone"
  | "pickmany"
  | "bool"
  | "int"
  | "dec";
