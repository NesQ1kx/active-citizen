import { Project } from "../models";

export function GetProjectPhase(project: Project) {
  const currentDate = Date.now();
  if (Date.now() < project.ProposeStartDate) {
    return "NOT_STARTED";
  }
  if (Date.now() > project.ProposeStartDate && Date.now() < project.ProposeEndDate) {
    return "PROPOSE";
  }
  if (Date.now() > project.VoteStartDate && Date.now() < project.VoteEndDate) {
    return "VOTING";
  }
  if (Date.now() > project.VoteEndDate) {
    return "FINISHED";
  }
}