export enum InputType {
  TEXT = "text",
  EMAIL = "email",
  LONG_MESSAGE = "LONG_MESSAGE",
  DATE = "date",
}

export enum CreateMode {
  NEW = "NEW",
  EDIT = "EDIT",
}

//CLIENT MODE => is what the embedable needs to use
export enum LeadFormMode {
  PREVIEW = "PREVIEW",
  CLIENT = "CLIENT",
}

export interface InputData {
  name: string;
  value: string;
  inputType: InputType;
  required: boolean;
}

export interface LeadFormType {
  created_by: string;
  created_at: string;
  formElements: InputData[];
  id: number;
  title: string;
}
