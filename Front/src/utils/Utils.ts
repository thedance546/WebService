// src/utils/Utils.ts

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
