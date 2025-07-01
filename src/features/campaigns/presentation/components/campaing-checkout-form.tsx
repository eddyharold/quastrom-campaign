import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { usePayCampaign } from "../../application/use-cases/pay-campaign-mutation";
import { useState } from "react";
import { Button } from "@/presentation/components/ui/button";
import { ArrowLeft, CreditCard } from "lucide-react";
import { formatCurrency } from "@/domain/utils/currency";
import { useCampaignForm } from "../hooks/use-campaign-form";
import { StripeCardInput } from "@/presentation/components/stripe-card-input";

type CampaignCheckoutProps = {
  form: ReturnType<typeof useCampaignForm>;
  paymentAmount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  handlePrevious?: () => void;
};

export const CampaignCheckoutForm = ({
  form,
  paymentAmount,
  onSuccess,
  onError,
  handlePrevious,
}: CampaignCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("Création");
  const [isPaymentConfirmLoading, setIsPaymentConfirmLoading] = useState(false);

  const { mutateAsync: payCampaign, isPending: isPayCampaignLoading, error } = usePayCampaign();

  const clearStates = () => {
    form.reset();
    setErrorMessage("");
    onError?.("");
    setLoadingMessage("Création");
    setIsPaymentConfirmLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoadingMessage("Création...");

    if (elements == null || stripe == null) {
      setErrorMessage("Erreur lors de l'initialisation du paiement du formulaire de paiement. Contactez le support");
      return;
    }

    if ((await form.trigger()) === false) {
      onError?.("Veuillez remplir tous les champs requis");
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError?.message) {
      setErrorMessage(submitError.message);
      return;
    }

    const initiatePaymentResult = await payCampaign(form.getValues());

    if (!initiatePaymentResult || (!initiatePaymentResult?.clientSecret && !initiatePaymentResult?.campaign_id)) {
      onError?.(
        error?.message ||
          "Une erreur est survenue lors de la création de votre campagne. Veuillez vérifier vos informations et réessayer"
      );
      return;
    }

    if (!initiatePaymentResult?.clientSecret) {
      onSuccess?.();
      return;
    }

    setLoadingMessage("Paiement...");

    setIsPaymentConfirmLoading(true);

    const result = await stripe.confirmCardPayment(initiatePaymentResult.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    setIsPaymentConfirmLoading(false);

    if (result.error) {
      setErrorMessage(
        result.error.message ||
          "Une erreur est survenue lors du paiement. Veuillez vérifier vos informations et réessayer."
      );
    } else {
      onSuccess?.();
      clearStates();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="text-destructive bg-destructive/10 p-4 text-sm font-medium rounded-md border border-destructive/10">
          {errorMessage}
        </div>
      )}

      <StripeCardInput />

      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={handlePrevious} className="shrink-0 w-40">
          <ArrowLeft />
          Revenir
        </Button>
        <Button type="submit" className="flex-1" isLoading={isPayCampaignLoading || isPaymentConfirmLoading}>
          <CreditCard />
          {isPayCampaignLoading || isPaymentConfirmLoading ? loadingMessage : `Payer ${formatCurrency(paymentAmount)}`}
        </Button>
      </div>
    </form>
  );
};
