export const SESSION_SECRET = import.meta.env.REACT_APP_SESSION_SECRET || "fallback_secret_key_for_development_only";
export const SESSION_KEY_NAME = "auth-session";
export const SESSION_ALGO = "HS256";
export const SESSION_EXPIRATION_TIME = 24 * 60 * 60 * 7; // 7 days
