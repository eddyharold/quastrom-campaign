import { LoginDto } from "../../domain/dto/login-dto";
import { Session } from "@/domain/types/session";
import { httpClient } from "@/infrastructure/api/http-client";
import { refractHttpError } from "@/domain/utils/error";
import { tokenManager } from "@/infrastructure/auth/token-manager";

export const login = async (data: LoginDto) => {
  try {
    const rs = await httpClient.post<Session>(`/login`, data);

    const token = rs?.data?.token;

    if (token) {
      tokenManager.setToken(token);
    }

    return Promise.resolve(rs);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
