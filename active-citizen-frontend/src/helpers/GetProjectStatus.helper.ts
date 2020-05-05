import { Project } from "../models";
import { GetDateDifference } from "./GetDateDifference.helper";
import { GetDaySpelling } from ".";
import { GetProjectPhase } from "./GetProjectPhase";

interface ResultType {
  message?: string;
  type?: string;
}

const DAY = 1000 * 3600 * 24;

export function GetProjectStatus(project: Project) {
  let result: ResultType = {};
  const proejctPhase = GetProjectPhase(project);

  switch(proejctPhase) {
    case "NOT_STARTED":
      const dateDiff = GetDateDifference(project.ProposeStartDate);
      result = {
        message: `До начала проекта ${dateDiff.digit} ${dateDiff.functionType && dateDiff.functionType(dateDiff.digit)}`,
        type: "default"
      };
    break;
    case "PROPOSE":
      result = {
        message: "Фаза подачи идей",
        type: "green",
      };
    break;
    case "VOTING":
      if (Date.now() > project.VoteStartDate && Date.now() < project.VoteEndDate) {
        result = {
          message: "Фаза голосования",
          type: "yellow",
        };
        return result;
      }
    break;
    case "FINISHED":
      result = {
        message: "Проект завершён",
        type: "red",
      }
    break;

  }
  // if (project.ProposeStartDate > Date.now()) {
  //   const dateDiff = GetDateDifference(project.ProposeStartDate);
  //   result = {
  //     message: `До начала проекта ${dateDiff.digit} ${dateDiff.functionType && dateDiff.functionType(dateDiff.digit)}`,
  //     type: "default"
  //   };
  //   return result;
  // }

  // if (Date.now() > project.ProposeStartDate && Date.now() < project.ProposeEndDate) {
  //   result = {
  //     message: "Фаза подачи идей",
  //     type: "green",
  //   };
  //   return result;
  // }

  // if (Date.now() > project.VoteStartDate && Date.now() < project.VoteEndDate) {
  //   result = {
  //     message: "Фаза голосования",
  //     type: "yellow",
  //   };
  //   return result;
  // }

  // if (Date.now() > project.VoteEndDate) {
  //   result = {
  //     message: "Проект завершён",
  //     type: "red",
  //   }
  // }

  return result
 }
