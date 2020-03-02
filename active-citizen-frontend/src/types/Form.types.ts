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