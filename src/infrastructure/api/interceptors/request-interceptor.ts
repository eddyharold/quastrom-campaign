import { REQUEST_HEADER_AUTH_KEY, TOKEN_TYPE } from "@/domain/constants/api";
import { tokenManager } from "@/infrastructure/auth/token-manager";
import { InternalAxiosRequestConfig } from "axios";

export const withAuthorization = (config: InternalAxiosRequestConfig) => {
  const token = tokenManager.getToken();

  const requestConfig = { ...config };
  if (token) {
    requestConfig.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE} ${token}`;
  }

  if (!requestConfig.headers["Content-Type"]) {
    if (config.data instanceof FormData) {
      requestConfig.headers["Content-Type"] = "multipart/form-data";
    } else if (config.data !== undefined) {
      requestConfig.headers["Content-Type"] = "application/json";
    }
  }

  return requestConfig;
};

export const withMultipartFormData = (config: InternalAxiosRequestConfig) => {
  const requestConfig = { ...config };

  if (!requestConfig.headers["Content-Type"]) {
    if (config.data instanceof FormData) {
      requestConfig.headers["Content-Type"] = "multipart/form-data";
    } else if (config.data !== undefined) {
      requestConfig.headers["Content-Type"] = "application/json";
    }
  }

  return requestConfig;
};
