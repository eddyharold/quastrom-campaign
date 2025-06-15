import { ReactNode } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { cn } from "@/domain/utils/common";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  classNames?: {
    title?: string;
    subtitle?: string;
    className?: string;
    children?: string;
  };
  hideBackButton?: boolean;
};

export function PageHeader({ title, subtitle, children, classNames = {}, hideBackButton = false }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={`flex items-center justify-between gap-4 ${classNames?.className}`}>
      <div className="inline-flex items-start gap-3">
        {!hideBackButton && (
          <Button
            size="icon"
            onClick={handleGoBack}
            className={cn("size-7 shrink-0 transform translate-y-0.5", subtitle && "translate-y-1.5")}
            aria-label="Go back"
          >
            <ChevronLeft />
          </Button>
        )}
        <div className="space-y-1">
          <h1 className={cn("text-2xl font-semibold", classNames?.title)}>{title}</h1>
          {subtitle && <p className={cn("text-sm text-muted-foreground", classNames?.subtitle)}>{subtitle}</p>}
        </div>
      </div>
      <div className={cn("flex items-center gap-2", classNames?.children)}>{children}</div>
    </div>
  );
}
