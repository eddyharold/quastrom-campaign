export const USER_QUERY = {
  default: ["USER"],
  getAll: ["USER", "GET_ALL"],
  getById: (id: string) => ["USER", "GET_BY_ID", id],
  create: ["USER", "CREATE"],
  update: (id: string) => ["USER", id, "UPDATE"],
  delete: ["USER", "DELETE"],
};

export const AUTH_QUERY = {
  default: ["AUTH"],
  login: ["AUTH", "LOGIN"],
  getProfile: ["AUTH", "GET_PROFILE"],
};

export const PROMOTION_LINK_QUERY = {
  default: ["PROMOTION_LINK"],
  createPromotionLink: ["CREATE_PROMOTION_LINK"],
};

export const PAYMENT_QUERY = {
  default: ["PAYMENT"],
  getAllPayment: ["GET_ALL_PAYMENT"],
};
