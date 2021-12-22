export enum FormType {
  completed = "Completed",
  incomplete = "Incomplete",
}
export interface TaskDetails {
  id: number;
  description: string;
  created_by: string;
  due_date: string;
  created_at: string;
  project_associated: number;
  status: FormType;
}
