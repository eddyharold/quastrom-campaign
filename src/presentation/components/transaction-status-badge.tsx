import { Transaction } from "@/domain/entities/transaction";
import { Badge } from "./ui/badge";
import { CheckCircle2, Loader, XCircle } from "lucide-react";
import { useMemo } from "react";

export const TransactionStatusBadge = ({
  transaction,
  className,
}: {
  transaction: Transaction;
  className?: string;
}) => {
  const variant = useMemo(() => {
    switch (transaction.status) {
      case "pending":
        return "warning";
      case "failed":
        return "destructive";
      case "success":
        return "success";
    }
  }, [transaction]);

  const icon = useMemo(() => {
    switch (transaction.status) {
      case "pending":
        return <Loader />;
      case "failed":
        return <XCircle />;
      case "success":
        return <CheckCircle2 />;
    }
  }, [transaction]);

  const label = useMemo(() => {
    switch (transaction.status) {
      case "pending":
        return "Pending";
      case "failed":
        return "Failed";
      case "success":
        return "Done";
    }
  }, [transaction]);

  return (
    <Badge variant={variant} className={className}>
      {icon}
      {label}
    </Badge>
  );
};
