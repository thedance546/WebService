// src/utils/Utils.js
// yymmdd + 유통기한, 소비기한
export const calculateDate = (baseDate, daysToAdd) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + parseInt(daysToAdd, 10));
    const format = (num) => num.toString().padStart(2, "0");
    return `${date.getFullYear().toString().slice(-2)}-${format(date.getMonth() + 1)}-${format(date.getDate())}`;
};

// 공통적인 에러 핸들링 함수
export const handleApiError = (error, defaultMessage) => {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    return new Error(defaultMessage);
  };
