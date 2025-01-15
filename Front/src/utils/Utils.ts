// src/utils/Utils.ts

import { IngredientStatus } from "../types/FeatureTypes";
import { Ingredient } from "../types/EntityTypes";

// 날짜 계산 함수 (yymmdd + 유통기한, 소비기한)
export const calculateDate = (baseDate: string | Date, daysToAdd: number): string => {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + daysToAdd);
  const format = (num: number): string => num.toString().padStart(2, "0");
  return `${date.getFullYear().toString().slice(-2)}-${format(date.getMonth() + 1)}-${format(date.getDate())}`;
};

// 공통적인 API 에러 핸들링 함수
export const handleApiError = (error: any, defaultMessage: string): Error => {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  return new Error(defaultMessage);
};

// 날짜 형식 문자열을 파싱하는 함수
export const parseDate = (input: string): string | null => {
  const patterns = [
    /^(\d{4})[-/](\d{2})[-/](\d{2})$/, // yyyy-mm-dd 또는 yyyy/mm/dd
    /^(\d{2})[-/](\d{2})[-/](\d{2})$/  // yy-mm-dd 또는 yy/mm/dd
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      const [, year, month, day] = match;
      const fullYear = year.length === 2 ? `20${year}` : year;

      if (parseInt(month, 10) >= 1 && parseInt(month, 10) <= 12 && parseInt(day, 10) >= 1 && parseInt(day, 10) <= 31) {
        return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
  }

  return null;
};

// 로컬 날짜 형식으로 변환하는 함수
export const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear(); // 로컬 연도
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 로컬 월
  const day = String(date.getDate()).padStart(2, '0'); // 로컬 일
  return `${year}-${month}-${day}`;
};

export const calculateStatus = (ingredient: Ingredient): IngredientStatus => {
  const currentDate = new Date();
  const shelfLifeDate = ingredient.shelfLife ? new Date(ingredient.shelfLife) : null;
  const consumeByDate = ingredient.consumeBy ? new Date(ingredient.consumeBy) : null;

  if (shelfLifeDate && currentDate <= shelfLifeDate) {
    return IngredientStatus.Safe;
  } else if (consumeByDate && currentDate > shelfLifeDate! && currentDate <= consumeByDate) {
    return IngredientStatus.Caution;
  } else if (consumeByDate && currentDate > consumeByDate) {
    return IngredientStatus.Expired;
  }

  return IngredientStatus.Expired;
};