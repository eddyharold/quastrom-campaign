import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { cn } from "@/domain/utils/common";
import { X } from "lucide-react";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  closeButtonLabel?: string;
  className?: string;
  contentClassName?: string;
  size?: ModalSize;
  closeOnClickOutside?: boolean;
};

const sizeClassNames: Record<ModalSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  "5xl": "sm:max-w-5xl",
  "6xl": "sm:max-w-6xl",
  full: "sm:max-w-[calc(100vw-2rem)]",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  showCloseButton = false,
  closeButtonLabel = "Fermer",
  className,
  contentClassName,
  size = "md",
  closeOnClickOutside = true,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeOnClickOutside && onClose()}>
      <DialogContent className={cn(sizeClassNames[size], className)} onEscapeKeyDown={onClose}>
        {(title || description) && (
          <DialogHeader className={cn("space-y-1", contentClassName)}>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        <div className={cn("pt-4", contentClassName)}>{children}</div>

        {(footer || showCloseButton) && (
          <DialogFooter className={cn("flex items-center justify-end gap-2", contentClassName)}>
            {showCloseButton && (
              <Button variant="outline" onClick={onClose}>
                {closeButtonLabel}
              </Button>
            )}
            {footer}
          </DialogFooter>
        )}

        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

type ModalActionProps = {
  children: ReactNode;
  className?: string;
};

export function ModalActions({ children, className }: ModalActionProps) {
  return <div className={cn("flex items-center justify-end gap-2", className)}>{children}</div>;
}
