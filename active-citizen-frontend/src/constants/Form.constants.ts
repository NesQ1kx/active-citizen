import { ValidationResult } from "../types"

export const requireValidationFunction = (value: string) => {
  return {
    isValid: !!value.toString().trim(),
    errorMessage: "Это поле необходимо заполнить",
  }
}

export const emailValidationFunction = (value: string): ValidationResult => {
  return {
    isValid: emailRegexp.test(value),
    errorMessage: "Адрес не удовлетворяет формату",
  }
}

export const passwordValidationFunction = (value: string) => {
  return {
    isValid: passwordRegexp.test(value),
    errorMessage: "Пароль не удовлетворяет формату",
  }
}

export const snilsValidationFunction = (value: string) => {
  return {
    isValid: validateSnils(value.toString()),
    errorMessage: "Неверный СНИЛС",
  }
}

const emailRegexp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const passwordRegexp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

function validateSnils(value: string) {
  let result = false;
  if (/[^0-9]/.test(value)) {
    result = false;
  } else if (value.length !== 11) {
    result = false;
  } else {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(value[i]) * (9 - i);
    }

    let checkDigit = 0;
    if (sum < 100) {
      checkDigit = sum;
    } else if (sum > 100) {
      checkDigit = sum % 101;
      if (checkDigit === 100) {
        checkDigit = 0;
      }
    }
    if (checkDigit === parseInt(value.slice(-2))) {
      result = true;
    }
  }

  return result;
}