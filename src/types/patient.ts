
export interface Procedure {
  id: string;
  name: string;
  scheduledTime: string;
  doctor: string;
  location: string;
  preparationRequired: boolean;
  preparationInstructions?: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string; // ISO format
  cpf: string;
  healthInsurance: string;
  insuranceNumber: string;
  profileImage?: string;
  gender?: "male" | "female";
  procedures: Procedure[];
}
