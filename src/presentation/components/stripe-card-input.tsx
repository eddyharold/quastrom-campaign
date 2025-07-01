import { CardElement } from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import { CARD_DARK_THEME, CARD_LIGHT_THEME } from "@/domain/constants/stripe";
import { cn } from "@/domain/utils/common";

export const StripeCardInput = () => {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "rounded-md border border-input dark:bg-input/50 bg-transparent p-3 transition-colors",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      )}
    >
      <CardElement
        options={{
          style: isDark ? CARD_DARK_THEME : CARD_LIGHT_THEME,
          hidePostalCode: true,
        }}
      />
    </div>
  );
};
