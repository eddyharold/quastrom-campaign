import { AxiosError } from "axios";
import { toast } from "sonner";
import { UNAUTHORIZED_STATUS_NUMBERS } from "@/domain/constants/api";
import { ErrorApiResponse } from "@/domain/types/api";

export const refractHttpError = (error: unknown): ErrorApiResponse => {
  let title = "SERVER ERROR";
  let message = "Une erreur est survenue. Si elle persiste, contactez le support";

  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      message = error.response?.data?.message;
    }

    if (error.code === "ERR_NETWORK") {
      title = "NETWORK ERROR";
      message = "Vérifiez votre connexion internet et réessayez";
    }

    if (UNAUTHORIZED_STATUS_NUMBERS.includes(error.status || 0)) {
      title = "AUTHENTICATION";
      message = "Vous n'êtes pas connecté. Veuillez vous connecter";
    }
  }

  const isProduction = import.meta.env.NODE_ENV === "production";

  if (!isProduction) {
    console.error(title, message, error);
  }

  toast.error(title, {
    description: message,
  });

  return {
    success: false,
    message,
    data: null,
  };
};
