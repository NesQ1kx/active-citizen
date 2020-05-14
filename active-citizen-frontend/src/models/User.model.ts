import { District } from "./District.model";
import { Roles } from "./Roles";

export interface User {
  Id: number;
  FirstName: string;
  LastName: string;
  Patronym: string;
  DistrictNavigation: District;
  Snils: string;
  Role: Roles;
  Email: string;
  Sex: number;
  IsConfirmedEmail: boolean,
  IsBlocked: boolean;
  DateOfBirth: number;
  UserAvatar: string;
}