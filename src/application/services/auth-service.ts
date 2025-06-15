import { httpClient } from "@/infrastructure/api/http-client";
import { refractHttpError } from "@/domain/utils/error";
import { User } from "@/domain/entities/user";
import { BaseApiResponse } from "@/domain/types/api";

export const getProfile = async () => {
  try {
    const rs = await httpClient.get<BaseApiResponse<User>>("/userauth");
    return Promise.resolve(rs.data);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
