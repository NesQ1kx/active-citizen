import { GetHoursSpelling } from "./GetHoursSpelling.helper";
import { GetMinutesSpelling } from "./GetMinutesSpelling.helper";
import { GetDaySpelling } from "./GetDaySpelling.helper";

interface ResultType {
  digit?: number;
  functionType?: Function;
}

export function GetDateDifference(date: number) {
  let result: ResultType = {};
  const differenceInHours = Math.floor((date - Date.now()) / 1000 / 3600);
  if (differenceInHours >= 1 && differenceInHours < 24) {
    result = {
      digit: differenceInHours,
      functionType: GetHoursSpelling,
    }
  } else if (differenceInHours < 1) {
    result = {
      digit: Math.floor((date - Date.now()) / 1000 / 60),
      functionType: GetMinutesSpelling,
    }
  } else if (differenceInHours >= 24) {
    result = {
      digit: Math.floor((date - Date.now()) / 1000 / 3600 / 24),
      functionType: GetDaySpelling
    }
  }
  return result;
}