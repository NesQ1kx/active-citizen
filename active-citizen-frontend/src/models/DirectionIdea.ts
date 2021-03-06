import { ProjectDirection } from './ProjectDirection';
import { User } from ".";
import { IdeaComment } from './IdeaComment';

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
  CountOfComments: number;
  IdeaComment?: IdeaComment[];
  IsRealised: boolean;
}