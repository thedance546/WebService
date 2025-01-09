// src/hooks/useDateInput.ts

import { useState } from "react";
import { parseDate } from "../utils/Utils";

const useDateInput = (initialValue: string) => {
  const [value, setValue] = useState<string>(initialValue);

  const handleChange = (input: string) => {
    setValue(input); // 입력값 그대로 반영
  };

  const handleBlur = () => {
    const parsedDate = parseDate(value);
    if (parsedDate) {
      setValue(parsedDate); // 포커스를 벗어날 때 변환
    }
  };

  const getParsedValue = (): string => {
    const parsedDate = parseDate(value);
    return parsedDate || value; // 변환된 값 반환, 변환되지 않으면 원래 값 반환
  };

  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value),
    onBlur: handleBlur,
    getParsedValue, // 변환된 값 반환 메서드
  };
};

export default useDateInput;
