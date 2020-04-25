import { User } from '.';
export interface IdeaComment {
  Id?: number;
  CommentText: string,
  UserId: number;
  IdeaId: number;
  CreateDate: number;
  User?: User;
  ParrentComment?: number;
  ChildComments: IdeaComment[];
}