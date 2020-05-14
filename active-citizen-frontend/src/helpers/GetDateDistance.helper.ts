import { differenceInYears } from "date-fns"

export function GetDateDistance(fromDate: number, toDate: number) {
  const res = differenceInYears(fromDate, toDate);
  return res;
}