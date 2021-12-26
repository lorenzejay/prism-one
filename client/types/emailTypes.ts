interface nameValue {
  name: string;
  value: string;
}
export type SpecificEmailType = {
  emailId: string;
  emailThreadId: string;
  labelIds: string;
  emailFrom: nameValue;
  emailTo: nameValue;
  emailSubject: nameValue;
  emailRecieved: nameValue;
  emailDate: nameValue;
  emailBody: string;
};
