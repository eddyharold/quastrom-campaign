// import { Session } from "@/domain/types/session";
// import { httpClient } from "@/infrastructure/api/http-client";
// import { refractHttpError } from "@/domain/utils/error";
// import { BaseApiResponse } from "@/domain/types/api";
// import { tokenManager } from "@/infrastructure/auth/token-manager";

// export const login = async (data: LoginDto) => {
//   try {
//     const response = await httpClient.post<BaseApiResponse<Session>>(`/login`, data);

//     const token = response.data?.token;

//     if (token) {
//       tokenManager.setToken(token);
//     }

//     return Promise.resolve(response.data);
//   } catch (error) {
//     return Promise.reject(refractHttpError(error));
//   }
// };
