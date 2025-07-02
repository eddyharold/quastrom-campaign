import { httpClient } from "@/infrastructure/api/http-client";
import { refractHttpError } from "@/domain/utils/error";
import { Notification } from "@/domain/entities/notification";

export const getAllNotification = async () => {
  try {
    const response = await httpClient.get<Notification[]>("/notifications");
    return response.data;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const getRecentNotification = async () => {
  try {
    const response = await httpClient.get<Notification[]>("/recent-notifications");
    return response.data;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
