export enum Industry {
  Wedding_Videography = "Wedding_Videography",
  Wedding_Photography = "Wedding_Photography",
  Portrait_Photography = "Portrait_Photography",
  Commerical_Photography = "Commerical_Photography",
  Commerical_Video = "Commerical_Video",
  Digital_Artist = "Digital_Artist",
  Other = "Other",
}

export interface ClientDetails {
  address: string;
  city: string;
  client_email: string;
  client_name: string;
  createdAt: string;
  created_by: string;
  id: number;
  notes: string;
  phone_number: string;
  state: string;
  zip_code: string;
}
//client form
export enum FormType {
  create = "create",
  details = "details",
}

export interface ApiCallReturn {
  data: any | null | undefined;
  success: boolean;
  message: string;
}
