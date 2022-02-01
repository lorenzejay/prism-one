import { TaskDetails } from "./tasksTypes";

export interface Gallery {}
export enum ProjectStatus {
  Lead = "Lead",
  Booked = "Booked",
  Fulfillment = "Fulfillment",
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
// export interface ThreadDataResult {
//   id: string;
//   historyId: string;
//   messages: [
//     {
//       id: string;
//       historyId: string;
//       internalDate: string;
//       labelIds: string[];
//       payload: any;
//       sizeEstinate: number;
//       snippet: string;
//       threadId: string;
//     }
//   ];
// }

export interface ObjectNAndV {
  name: string;
  value: string;
}
export interface ThreadDataResult {
  emailBody: string;
  emailFrom: ObjectNAndV;
  emailDate: ObjectNAndV;
  emailId: ObjectNAndV;
  emailRecieved: ObjectNAndV;
  emailSubject: ObjectNAndV;
  emailThreadId: string;
  emailTo: ObjectNAndV;
  labelIds: string[];
  messageId: ObjectNAndV;
  contentType: ObjectNAndV;
  inReplyTo: ObjectNAndV;
}
