import { AUTH_QUERY } from "@/domain/constants/query";
import { login } from "../services/auth-service";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () =>
  useMutation({
    mutationKey: AUTH_QUERY.login,
    mutationFn: login,
  });
