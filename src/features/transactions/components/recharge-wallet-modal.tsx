import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RechargeWalletDto, RechargeWalletDtoSchema } from "@/features/transactions/domain/dto/recharge-wallet.dto";
import { useRechargeWallet } from "../application/use-cases/recharge-wallet-mutation";
import { toast } from "sonner";
import { formatCurrency } from "@/domain/utils/currency";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/presentation/components/ui/form";
import { Input } from "@/presentation/components/ui/input";
import { Button } from "@/presentation/components/ui/button";
import { CreditCard, Euro } from "lucide-react";
import { Modal } from "@/presentation/components/ui/modal";
import { StripeCardInput } from "@/presentation/components/stripe-card-input";
import { Label } from "@/presentation/components/ui/label";

const MINIMUM_AMOUNT = 100;

type RechargeWalletModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const RechargeWalletModal = ({ isOpen, onClose }: RechargeWalletModalProps) => {
  const { mutate: rechargeWallet, isPending } = useRechargeWallet();

  const form = useForm<RechargeWalletDto>({
    resolver: zodResolver(RechargeWalletDtoSchema),
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      form.setValue("amount", value);
    }
  };

  const onSubmit = (data: RechargeWalletDto) => {
    rechargeWallet(data, {
      onSuccess: () => {
        toast.success("Votre portefeuille a été rechargé avec succès", {
          description: `Montant ajouté: ${formatCurrency(data.amount)}`,
        });
        onClose();
        form.reset();
      },
    });
  };

  useEffect(() => {
    if (isOpen) {
      form.reset({
        payment_method: "pm_card_visa",
        amount: MINIMUM_AMOUNT,
      });
    }
  }, [isOpen, form]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recharger votre portefeuille" size="xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full ">
          {/* {errorMessage && (
            <div className="text-destructive bg-destructive/10 p-4 text-sm font-medium rounded-md border border-destructive/10">
              {errorMessage}
            </div>
          )} */}

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
                    <Input {...field} onChange={handleAmountChange} className="h-10 pr-10" />
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

          <div className="flex w-full justify-between gap-4 pt-6">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isPending}>
              Annuler
            </Button>

            <Button type="submit" className="flex-1" isLoading={isPending}>
              <CreditCard />
              Recharger {formatCurrency(form.watch("amount"))}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
