export const STRIPE_SECRET_KEY = import.meta.env.REACT_APP_STRIPE_SECRET_KEY || "";

export const CARD_LIGHT_THEME = {
  base: {
    color: "#09090b",
    fontSize: "14px",
    fontFamily: "Noto Sans, sans-serif",
    "::placeholder": {
      color: "#a1a1a8",
    },
  },
  invalid: {
    color: "#df2225",
  },
};

export const CARD_DARK_THEME = {
  base: {
    color: "#fafafa",
    fontSize: "14px",
    fontFamily: "Noto Sans, sans-serif",
    "::placeholder": {
      color: "#71717b",
    },
  },
  invalid: {
    color: "#ba1f1c",
  },
};
