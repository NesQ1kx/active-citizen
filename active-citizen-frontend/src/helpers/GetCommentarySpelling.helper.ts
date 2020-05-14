export function GetCommentarySpelling(digit: number) {
  const lastNumber = digit % 10;
  if (lastNumber > 4 || (digit >= 5 && digit <= 20 )) {
    return "комментариев";
  } else if (lastNumber > 1 && lastNumber <= 4) {
    return "комментария";
  } else if (lastNumber === 1) {
    return "комментарий";
  } 
}