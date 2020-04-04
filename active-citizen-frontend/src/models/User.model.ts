import { District } from "./District.model";
import { Roles } from "./Roles";

export interface User {
  Id: number;
  FirstName: string;
  LastName: string;
  Patronym: string;
  District: District;
  Snils: string;
  Role: Roles;
  Email: string;
  Sex: number;
  IsConfirmedEmail: boolean,
  IsBlocked: boolean;
}