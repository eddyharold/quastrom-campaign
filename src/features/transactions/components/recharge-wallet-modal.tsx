import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RechargeWalletDto, RechargeWalletDtoSchema } from "@/features/transactions/domain/recharge-wallet.dto";
import { useRechargeWalletMutation } from "../application/use-cases/recharge-wallet";
import { toast } from "sonner";
import { formatCurrency } from "@/domain/utils/currency";
// UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/presentation/components/ui/form";
import { Input } from "@/presentation/components/ui/input";
import { Button } from "@/presentation/components/ui/button";
import { Loader2} from "lucide-react";
import { useGetTransactionStats } from "../application/use-cases/get-transaction-stats";
import { useGetWallet } from "../application/use-cases/get-wallet";
import { PaymentMethodSelector } from "./payment-method-selector";

const MINIMUM_AMOUNT = 0;

type RechargeWalletModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const RechargeWalletModal = ({ isOpen, onClose }: RechargeWalletModalProps) => {
  
  const [amount, setAmount] = useState(MINIMUM_AMOUNT);
  const { mutate: rechargeWallet, isPending } = useRechargeWalletMutation();
  const transactionsStatistic = useGetTransactionStats();
  const walletRefetch = useGetWallet();
  
  
  // Use wallet and transaction stats refetch

  const form = useForm<RechargeWalletDto>({
    resolver: zodResolver(RechargeWalletDtoSchema),
    defaultValues: {
      payment_method: "pm_card_visa",
      amount: MINIMUM_AMOUNT,
    },
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setAmount(value);
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
        walletRefetch.refetch();
        transactionsStatistic.refetch();
      },
      onError: (error) => {
        toast.error("Erreur lors du rechargement", {
          description: error.message || "Une erreur est survenue lors du rechargement de votre portefeuille",
        });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] w-full ">
        <DialogHeader>
          <DialogTitle className="text-xl">Recharger votre portefeuille</DialogTitle>
          <DialogDescription>
            Choisissez une méthode de paiement et entrez le montant à recharger.
          </DialogDescription>
        </DialogHeader>

        <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full ">
          <div className="grid grid-cols-2 gap-6 w-full space-y-10   ">
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem >
                  <PaymentMethodSelector field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-6 w-full">
            <p className="text-center mb-3 overflow-auto ">
            <span className="text-5xl font-bold">{formatCurrency(amount)}</span>
            </p>
                 <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="number"
                        min="100"
                        onChange={handleAmountChange}
                        className="text-2xl font-bold h-16 pl-12"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl font-bold">€</div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted/50 p-4 rounded-md">


              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Montant à recharger</span>
                <span className="font-medium">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted-foreground">Frais de transaction</span>
                <span className="font-medium">€0.00</span>
              </div>
              <div className="border-t mt-2 pt-2 flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-bold text-lg">{formatCurrency(amount)}</span>
              </div>
            </div>

            </div>
           
            </div>
           
            <DialogFooter>
              <div className="flex w-full justify-between">
                 <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Annuler
              </Button>
              
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Recharger maintenant
              </Button>
              </div>
             
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
