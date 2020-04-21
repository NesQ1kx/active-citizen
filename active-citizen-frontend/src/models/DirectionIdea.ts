import { ProjectDirection } from './ProjectDirection';
import { Project } from './Project.model';
import { User } from ".";

export interface DirectionIdea {
  Id: number;
  IdeaTitle: string;
  IdeaDescription: string;
  DirectionId: number;
  VotesCount: number;
  UserId: number;
  User?: User;
  Status: number;
  RejectReason: number;
  CreateDate: number;
  Direction?: ProjectDirection
}