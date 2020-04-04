export function GetMinutesSpelling (digit: number) {
  const lastNumber = digit % 10;
  if (lastNumber === 1) {
    return "минута";
  } else if (lastNumber > 1 && lastNumber <= 4) {
    return "минуты";
  } else if (lastNumber > 4 || (digit >= 5 && digit <= 20 )) {
    return "минут";
  }
}