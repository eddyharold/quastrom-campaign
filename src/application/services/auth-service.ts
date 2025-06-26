import { httpClient } from "@/infrastructure/api/http-client";
import { refractHttpError } from "@/domain/utils/error";
import { User } from "@/domain/entities/user";

export const getProfile = async () => {
  try {
    const rs = await httpClient.get<User>("/me");
    return Promise.resolve(rs.data);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
