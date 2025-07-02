import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RechargeWalletDto, RechargeWalletDtoSchema } from "@/features/transactions/domain/dto/recharge-wallet.dto";
import { formatCurrency } from "@/domain/utils/currency";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/presentation/components/ui/form";
import { Input } from "@/presentation/components/ui/input";
import { Button } from "@/presentation/components/ui/button";
import { CheckCircle, CreditCard, Euro, Sparkles } from "lucide-react";
import { Modal } from "@/presentation/components/ui/modal";
import { StripeCardInput } from "@/presentation/components/stripe-card-input";
import { Label } from "@/presentation/components/ui/label";
import { useRechargeWallet } from "@/application/use-cases/recharge-wallet-mutation";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

type RechargeWalletModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const RechargeWalletModal = ({ isOpen, onClose }: RechargeWalletModalProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const form = useForm<RechargeWalletDto>({
    resolver: zodResolver(RechargeWalletDtoSchema),
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isPaymentConfirmLoading, setIsPaymentConfirmLoading] = useState(false);
  const [isPaymentDone, setIsPaymentDone] = useState(false);

  const { mutateAsync: rechargeWallet, isPending: isRechargeWalletLoading, error } = useRechargeWallet();

  const clearStates = useCallback(() => {
    form.reset();
    setErrorMessage("");
    setIsPaymentConfirmLoading(false);
  }, [form]);

  const onSubmit = async (data: RechargeWalletDto) => {
    if (elements == null || stripe == null) {
      setErrorMessage("Erreur lors de l'initialisation du paiement du formulaire de paiement. Contactez le support");
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError?.message) {
      setErrorMessage(submitError.message);
      return;
    }

    const clientSecret = await rechargeWallet(Number(data.amount));

    if (!clientSecret) {
      setErrorMessage(
        error?.message ||
          "Une erreur est survenue lors de la création de votre campagne. Veuillez vérifier vos informations et réessayer"
      );
      return;
    }

    setIsPaymentConfirmLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
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
      clearStates();
      setIsPaymentDone(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      clearStates();
      setIsPaymentDone(false);
    }
  }, [isOpen, clearStates]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isPaymentDone ? "" : "Recharger votre portefeuille"} size="xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full ">
          {errorMessage && (
            <div className="text-destructive bg-destructive/10 p-4 text-sm font-medium rounded-md border border-destructive/10">
              {errorMessage}
            </div>
          )}

          {!isPaymentDone ? (
            <>
              <div className="space-y-2">
                <Label>Carte bancaire</Label>
                <StripeCardInput />
              </div>

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} placeholder="Ex: 100 pour 100€" className="h-10 pr-10" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xl font-bold">
                          <Euro className="size-4" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-accent/40 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Montant à recharger</span>
                  <span className="font-medium text-lg">{formatCurrency(form.watch("amount"))}</span>
                </div>

                <div className="flex justify-between items-center mt-2 border-t border-dashed pt-2">
                  <span className="text-sm text-muted-foreground">Frais de transaction</span>
                  <span className="font-medium text-lg">{formatCurrency(0)}</span>
                </div>

                <div className="border-t border-dashed mt-2 pt-2 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-bold text-lg">{formatCurrency(form.watch("amount"))}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="size-16 bg-gradient-to-br dark:from-success/50 dark:to-success/40 from-success to-success/80 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <CheckCircle className="size-8 text-success-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="size-5 dark:text-foreground text-primary animate-pulse" />
                  </div>
                  <div className="absolute -bottom-2 -left-2">
                    <Sparkles className="size-5 dark:text-foreground text-primary animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h1 className="text-xl font-semibold leading-tight tracking-tight">
                    Recharge effectuée avec succès 🎉
                  </h1>
                  <div className="w-16 h-1 bg-gradient-to-r from-success/20 to-success/80 rounded-full mx-auto"></div>
                </div>

                <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
                  Votre portefeuille a été crédité de {formatCurrency(form.watch("amount"))}.
                </p>
              </div>
            </div>
          )}

          <div className="flex w-full justify-between gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isRechargeWalletLoading || isPaymentConfirmLoading}
            >
              {!isPaymentDone ? "Annuler" : "Fermer"}
            </Button>

            {!isPaymentDone && (
              <Button type="submit" className="flex-1" isLoading={isRechargeWalletLoading || isPaymentConfirmLoading}>
                <CreditCard />
                Recharger {formatCurrency(form.watch("amount"))}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Modal>
  );
};
