import { FormControl, FormItem, FormLabel } from "@/presentation/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/presentation/components/ui/radio-group";
import { Badge } from "@/presentation/components/ui/badge";
import { paymentMethods } from "../domain/data";
import { ControllerRenderProps } from "react-hook-form";

interface PaymentMethodSelectorProps {
  field: ControllerRenderProps<{
    payment_method: string;
    amount: number;
  }, "payment_method">;
}

/**
 * Component for selecting payment methods in the recharge wallet modal
 */
export const PaymentMethodSelector = ({ field }: PaymentMethodSelectorProps) => {
  return (
    <FormControl>
      <RadioGroup
        onValueChange={field.onChange}
        defaultValue={field.value}
        className="grid grid-cols-1 "
      >
        {paymentMethods.map((method) => (
          <FormItem
            key={`payment-method-${method.id}-item`}
            className="border-input h-20 has-data-[state=checked]:border-transparent has-data-[state=checked]:ring-3 has-data-[state=checked]:ring-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none"
            // className="border- h-20  has-[data-state=checked]:border-transparent has-[data-state=checked]:ring-3 has-[data-state=checked]:ring-primary/50 relative flex items-start  rounded-md border p-5 shadow-xs outline-none"
          >
            <FormControl>
              <RadioGroupItem
                value={method.id}
                id={`payment-method-${method.id}-radio`}
                aria-describedby={`payment-method-${method.id}-description`}
                className="order-1 after:absolute after:inset-0"
              />
            </FormControl>
            <div className="font-normal flex grow items-center gap-4">
              <div 
                className="bg-accent rounded-lg p-2 size-8 flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${method.color}25` }}
              >
                <method.icon className="size-4" style={{ color: method.color }} />
              </div>
              <div className="grid grow gap-2">
                <FormLabel htmlFor={`payment-method-${method.id}`}>
                  {method.label}
                </FormLabel>
                <p
                  id={`payment-method-${method.id}-description`}
                  className="text-muted-foreground text-xs"
                >
                  {method.id === 'pm_card_paypal' ? 'Paiement en ligne' : 'Carte bancaire'}
                </p>
                
              </div>
            </div>
          </FormItem>
        ))}
      </RadioGroup>
    </FormControl>
  );
};
