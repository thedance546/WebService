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

// 날짜 형식 문자열을 파싱하는 함수
export const parseDate = (input: string): string | null => {
  // 다양한 날짜 형식을 처리하기 위한 정규식 패턴
  const patterns = [
    /^(\d{4})[-/](\d{2})[-/](\d{2})$/, // yyyy-mm-dd 또는 yyyy/mm/dd
    /^(\d{2})[-/](\d{2})[-/](\d{2})$/  // yy-mm-dd 또는 yy/mm/dd
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      const [, year, month, day] = match;

      // yy 형식인 경우 yyyy로 변환
      const fullYear = year.length === 2 ? `20${year}` : year;

      // 유효한 날짜인지 확인
      if (parseInt(month, 10) >= 1 && parseInt(month, 10) <= 12 && parseInt(day, 10) >= 1 && parseInt(day, 10) <= 31) {
        return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
  }

  return null; // 유효하지 않은 날짜 형식
};
