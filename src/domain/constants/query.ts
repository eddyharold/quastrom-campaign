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

export const COMMON_QUERY = {
  getAllObjective: ["COMMON", "GET_OBJECTIVE"],
  getAllCreative: ["COMMON", "GET_CREATIVE"],
};

export const CAMPAIGN_QUERY = {
  default: ["CAMPAIGN"],
  getAll: ["CAMPAIGN", "GET_ALL"],
  create: ["CAMPAIGN", "CREATE"],
  update: (id: string) => ["CAMPAIGN", "UPDATE", id],
  delete: (id: string) => ["CAMPAIGN", "DELETE", id],
  getAllStats: ["CAMPAIGN", "GET_ALL_STATS"],
};

export const TRANSACTION_QUERY = {
  default: ["TRANSACTION"],
  getAll: ["TRANSACTION", "GET_ALL"],
  getStats: ["TRANSACTION", "GET_STATS"],
};

export const WALLET_QUERY = {
  default: ["WALLET"],
  getDetails: ["WALLET", "GET_DETAILS"],
  recharge: ["WALLET", "RECHARGE"],
};

export const LEAD_QUERY = {
  default: ["LEAD"],
  getAll: ["LEAD", "GET_ALL"],
  getStats: ["LEAD", "GET_STATS"],
  update: ["LEAD", "UPDATE"],
};
