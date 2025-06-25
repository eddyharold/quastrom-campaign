import { UNAUTHORIZED_STATUS_NUMBERS } from "@/domain/constants/api";
import { httpClient } from "../http-client";

export const catchUnauthorizedResponse = (callback: () => void) => {
  return httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error) {
        return Promise.reject(error);
      }

      const { response } = error;

      if (response && UNAUTHORIZED_STATUS_NUMBERS.includes(response.status)) {
        callback();
      }

      return Promise.reject(error);
    }
  );
};
