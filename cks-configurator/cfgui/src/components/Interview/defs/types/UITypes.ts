export interface Option {
  label: string;
  value: string;
}

export interface InputProps {
  onNextResponse: () => void;
  onBackResponse: () => void;
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
  | "literal"
  | "repeat"
  | "zzz"
  | null;
