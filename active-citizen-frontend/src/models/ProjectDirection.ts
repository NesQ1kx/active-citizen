import { DirectionIdea } from './DirectionIdea';
import { Project } from '.';
export interface ProjectDirection {
  Id: number;
  DirectionTitle: string;
  DirectionDescription: string;
  CountOfIdeas: string;
  CountOfComments: string;
  ProjectId: string;
  DirectionIdea: DirectionIdea[];
  Project: Project;
}