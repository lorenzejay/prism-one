import { TaskDetails } from "./tasksTypes";

export interface Gallery {}
export enum ProjectStatus {
  Inquiry = "Inquiry",
  Proposal = "Proposal",
  Proposal_Status = "Proposal_Status",
  Deposit = "Deposit",
  Completed = "Completed",
}
export interface ProjectDetails {
  id: number;
  title: string;
  owner: string;
  is_private: boolean;
  header_img: string;
  created_at: string;
  project_date: string;
  galleries: any[];
  tags: String[];
  client_name: string;
  client_email: string;
  project_status: ProjectDetails;
  expected_revenue: number;
  amount_paid: number;
  amount_due: number;
  goals: string[];
  tasks: TaskDetails[];
  job_type: string;
}
