import { handleApiError } from '../utils/Utils';

let accessToken: string = "";

export const setAccessToken = (token: string): void => {
  accessToken = token;
  console.debug("Access Token 설정됨:", token);
};

export const getAccessToken = (): string => {
  console.debug("현재 Access Token:", accessToken);
  return accessToken;
};

export const clearAccessToken = (): void => {
  console.debug("Access Token 초기화됨");
  accessToken = "";
};

// Access Token 갱신 함수
export const refreshAccessToken = async (api: any): Promise<string> => {
  console.debug("토큰 갱신 요청 시작...");
  try {
    const response = await api.post('/auth/refresh', {}, { withCredentials: true });
    const newAccessToken: string = response.data.accessToken;

    setAccessToken(newAccessToken);
    console.debug("토큰 갱신 성공: ", newAccessToken);

    return newAccessToken;
  } catch (error: any) {
    console.error("토큰 갱신 실패: ", error);
    clearAccessToken();
    throw handleApiError(error, '로그인이 필요합니다.');
  }
};
