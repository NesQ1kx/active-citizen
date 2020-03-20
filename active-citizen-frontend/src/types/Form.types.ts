export interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

export interface FormInput {
  value: any;
  validationFunctions: ((value: string) => ValidationResult)[];
  valid: boolean;
}

export interface SignupModel {
  FirstName: string;
  LastName: string;
  Patronym: string;
  Email: string;
  Snils: number;
  District: number;
  Sex: number;
  Password: string;
  PasswordRepeat: string;
}

export interface SiginModel {
  Email: string;
  Password: string;
}

export interface LoadProjectModel {
  ProjectTitle: string;
  ProjectDescription: string;
  ProposeStartDate: number;
  ProposeEndDate: number;
  VoteStartDate: number;
  VoteEndDate: number;
  IsProjectActive: boolean;
}