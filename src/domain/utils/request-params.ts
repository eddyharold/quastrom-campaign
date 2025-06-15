import { RequestParams } from "@/domain/types/api";

export const validateSearchParams = (meta?: RequestParams) => {
  const result: RequestParams = {};

  if (meta) {
    Object.entries(meta).forEach(([key, value]) => {
      if (value) result[key] = value;
    });
  }

  return result;
};

export const buildURLSearchParams = (meta: RequestParams) => {
  const searchParams = new URLSearchParams();

  Object.entries(meta).forEach(([key, value]) => {
    if (value) searchParams.append(key, `${value}`);
  });

  return searchParams.toString();
};
