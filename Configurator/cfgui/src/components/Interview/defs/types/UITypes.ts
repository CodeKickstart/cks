export interface Option {
  label: string;
  value: string;
}

export interface InputProps {
  onResponse: () => void;
  inputType: InputType;
  pickOneProps?: { options: Option[] };
}

export type InputType =
  | "text"
  | "pickone"
  | "pickmany"
  | "bool"
  | "int"
  | "dec"
  | "zzz"
  | null;
