export function GetYearSpelling(digit: number) {
  const lastNumber = digit % 10;
  if (lastNumber > 4 || (digit >= 5 && digit <= 20 )) {
    return "лет";
  } else if (lastNumber > 1 && lastNumber <= 4) {
    return "года";
  } else if (lastNumber === 1) {
    return "год";
  } 
}