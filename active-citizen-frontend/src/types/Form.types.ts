import { ProjectDirection } from './../models/ProjectDirection';
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
  DateOfBirth: number;
  UserAvatar?: string;
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
  ProjectImage: string;
  ProjectDirection: any[];
}

export interface UpdateProjectModel {
  Id: number;
  ProjectTitle: string;
  ProjectDescription: string;
  ProposeStartDate: number;
  ProposeEndDate: number;
  VoteStartDate: number;
  VoteEndDate: number;
  IsProjectActive: boolean;
  ProjectImage: string;
  ProjectDirection: ProjectDirection[];
  ParticipantsCount: number;
  IdeasCount: number;
}

export interface AddIdeaModel {
  IdeaTitle: string;
  IdeaDescription: string;
  DirectionId: number;
  UserId: number;
  CreateDate: number;
}

export interface AddNewsModel {
  Text: string;
  Title: string;
  CreateDate: number;
  Image: string;
}

export interface EditUserProfileModel {
  Id: number;
  FirstName: string;
  LastName: string;
  Patronym: string;
  DateOfBirth: number;
  District: number
  Snils: number;
}