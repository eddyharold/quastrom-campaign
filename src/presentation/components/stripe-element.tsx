import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { STRIPE_SECRET_KEY } from "@/domain/constants/stripe";
import { CommonProps } from "@/domain/types/common";

const stripePromise = loadStripe(STRIPE_SECRET_KEY);

export const StripeElement = ({ children }: CommonProps) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};
