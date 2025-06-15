import { User } from "./user";

export type AuthUser = {
  user: User;
  access: AccessToken;
};

export type AccessToken = {
  token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};
