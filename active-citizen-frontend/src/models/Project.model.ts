import { ProjectDirection } from './ProjectDirection';
export interface Project {
  Id: number;
  ProjectTitle: string;
  ProjectDescription: string;
  ProposeStartDate: number;
  ProposeEndDate: number;
  VoteStartDate: number;
  VoteEndDate: number;
  IsProjectActive: boolean;
  ProjectImage: string;
  ParticipantsCount: number;
  IdeasCount: number;
  ProjectDirection: ProjectDirection[];
}