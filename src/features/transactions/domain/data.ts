import { CreditCard, DollarSign } from "lucide-react";

export const paymentMethods = [
    { 
      id: "pm_card_visa", 
      label: "Visa", 
      icon: CreditCard,
      color: "#1A1F71",
      lightMode: {
        bgColor: "rgba(26, 31, 113, 0.05)",
        gradient: "linear-gradient(135deg, #ffffff 0%, #f7f9fc 100%)",
        textColor: "#1A1F71",
        borderColor: "rgba(26, 31, 113, 0.2)"
      },
      darkMode: {
        bgColor: "rgba(26, 31, 113, 0.15)",
        gradient: "linear-gradient(135deg, #1e1e2f 0%, #1a1f3f 100%)",
        textColor: "#a8b4ff",
        borderColor: "rgba(26, 31, 113, 0.5)"
      }
    },
    { 
      id: "pm_card_mastercard", 
      label: "Mastercard", 
      icon: CreditCard,
      color: "#EB001B",
      lightMode: {
        bgColor: "rgba(235, 0, 27, 0.05)",
        gradient: "linear-gradient(135deg, #ffffff 0%, #fff4f5 100%)",
        textColor: "#EB001B",
        borderColor: "rgba(235, 0, 27, 0.2)"
      },
      darkMode: {
        bgColor: "rgba(235, 0, 27, 0.15)",
        gradient: "linear-gradient(135deg, #1e1e2f 0%, #2f1a1f 100%)",
        textColor: "#ff8a94",
        borderColor: "rgba(235, 0, 27, 0.5)"
      }
    },
    { 
      id: "pm_card_paypal", 
      label: "PayPal", 
      icon: DollarSign,
      color: "#003087",
      lightMode: {
        bgColor: "rgba(0, 48, 135, 0.05)",
        gradient: "linear-gradient(135deg, #ffffff 0%, #f0f5ff 100%)",
        textColor: "#003087",
        borderColor: "rgba(0, 48, 135, 0.2)"
      },
      darkMode: {
        bgColor: "rgba(0, 48, 135, 0.15)",
        gradient: "linear-gradient(135deg, #1e1e2f 0%, #1a1f3f 100%)",
        textColor: "#7aa2ff",
        borderColor: "rgba(0, 48, 135, 0.5)"
      }
    },
  ];