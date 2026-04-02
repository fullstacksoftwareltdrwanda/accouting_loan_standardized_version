export type CustomerStatus = "APPROVED" | "PENDING" | "REJECTED";

export interface Customer {
  id: string;
  memberNumber: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  idNumber: string;
  status: CustomerStatus;
  
  // Basic Info
  gender: string;
  dateOfBirth: string;
  recordDate: string;
  occupation: string;
  accountNumber: string;
  
  // Residence
  province: string;
  district: string;
  sector: string;
  cell: string;
  streetAddress: string;
  
  // Family
  fatherName: string;
  motherName: string;
  maritalStatus: string;
  
  // Guarantor
  hasGuarantor: boolean;
  
  // Loan Interest
  loanTypePreferred?: string;
  project?: string;
  projectLocation?: string;
  collateralLocation?: string;
}
