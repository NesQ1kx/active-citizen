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
}