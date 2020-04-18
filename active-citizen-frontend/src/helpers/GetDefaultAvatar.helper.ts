export function GetDefaultAvatar(sex: number) {
  return sex === 1 ? require("../assets/images/avatar-male.svg") : require("../assets/images/avatar-female.svg");
}