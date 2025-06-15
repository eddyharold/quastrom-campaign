import { useState } from "react";

export function useModal<T = unknown>() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null | undefined>(undefined);

  const open = (modalData?: T | null) => {
    setIsOpen(true);
    setData(modalData);
  };

  const close = () => {
    setIsOpen(false);
  };

  const toggle = () => {
    setIsOpen((prev) => {
      if (!prev) {
        return true;
      } else {
        setData(undefined);
        return false;
      }
    });
  };

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
  };
}
