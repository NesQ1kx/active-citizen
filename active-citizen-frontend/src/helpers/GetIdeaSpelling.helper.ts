export function GetIdeaSpelling(digit: number) {
  const lastNumber = digit % 10;
  if (lastNumber > 4 || (digit >= 5 && digit <= 20 )) {
    return "идей";
  } else if (lastNumber > 1 && lastNumber <= 4) {
    return "идеи";
  } else if (lastNumber === 1) {
    return "идею";
  } 
}