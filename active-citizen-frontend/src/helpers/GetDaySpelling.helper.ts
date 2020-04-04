export function GetDaySpelling(digit: number) {
  const lastNumber = digit % 10;
  if (lastNumber === 1) {
    return "день";
  } else if (lastNumber > 1 && lastNumber <= 4) {
    return "дня";
  } else {
    return "дней";
  }
}