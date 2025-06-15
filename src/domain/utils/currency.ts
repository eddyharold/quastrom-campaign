type NumberFormatOptions = Intl.NumberFormatOptions & { locale?: string };

export const formatNumber = (number: string | number | undefined | null, options?: NumberFormatOptions) => {
  const toFormat = number ? Number(number) : 0;
  return toFormat.toLocaleString(options?.locale || "fr-FR", options);
};

export const formatCurrency = (number: string | number | undefined | null, options?: NumberFormatOptions) => {
  const toFormat = number ? Number(number) : 0;
  return toFormat.toLocaleString(options?.locale || "fr-FR", { style: "currency", currency: "EUR", ...options });
};

export const formatCurrencyCompact = (number: string | number | undefined | null, options?: NumberFormatOptions) => {
  const toFormat = number ? Number(number) : 0;
  return toFormat.toLocaleString(options?.locale || "fr-FR", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    ...options,
  });
};
