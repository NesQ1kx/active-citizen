export function GetHoursSpelling(digit: number) {
  const lastNumber = digit % 10;
  if (lastNumber > 4 || (digit >= 5 && digit <= 20 )) {
    return "часов";
  } else if (lastNumber > 1 && lastNumber <= 4) {
    return "часа";
  } else if (lastNumber === 1) {
    return "час";
  } 
}