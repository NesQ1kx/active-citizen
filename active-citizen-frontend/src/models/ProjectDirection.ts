import { DirectionIdea } from './DirectionIdea';
export interface ProjectDirection {
  Id: number;
  DirectionTitle: string;
  DirectionDescription: string;
  CountOfIdeas: string;
  CountOfComments: string;
  ProjectId: string;
  DirectionIdea: DirectionIdea[];
}