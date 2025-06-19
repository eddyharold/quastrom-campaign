import { Breadcrumb } from "@/domain/types/common";
import { Component, createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from "react";

interface LayoutContextType {
  breadcrumb: Breadcrumb[];
  isReloading: boolean;
  openNotification: boolean;
  updateBreadcrumb: (value: Breadcrumb[]) => void;
  updateReloadingState: (value: boolean) => void;
  updateNotificationState: (value: boolean) => void;
}

const defaultContextValue: LayoutContextType = {
  breadcrumb: [],
  isReloading: false,
  openNotification: false,
  updateBreadcrumb: () => {},
  updateReloadingState: () => {},
  updateNotificationState: () => {},
};

export const LayoutContext = createContext<LayoutContextType>(defaultContextValue);

interface LayoutProviderProps {
  children: ReactNode;
  initialBreadcrumb?: Breadcrumb[];
  initialLoadingState?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error) {
    console.error("LayoutProvider Error:", error);
  }

  public render() {
    if (this.state.hasError) {
      return <div>Something went wrong in the LayoutProvider. Please try again.</div>;
    }

    return this.props.children;
  }
}

export const LayoutProvider: FC<LayoutProviderProps> = ({
  children,
  initialBreadcrumb = [],
  initialLoadingState = false,
}) => {
  const [breadcrumb, setBreadcrumb] = useState<Breadcrumb[]>(initialBreadcrumb);
  const [isReloading, setIsReloading] = useState<boolean>(initialLoadingState);
  const [openNotification, setOpenNotification] = useState<boolean>(false);

  const updateBreadcrumb = useCallback((value: Breadcrumb[]) => {
    try {
      setBreadcrumb(Array.isArray(value) ? [...value] : []);
    } catch (error) {
      console.error("Error updating breadcrumb:", error);
    }
  }, []);

  const updateReloadingState = useCallback((value: boolean) => {
    try {
      setIsReloading(Boolean(value));
    } catch (error) {
      console.error("Error updating loading state:", error);
    }
  }, []);

  const updateNotificationState = useCallback((value: boolean) => {
    try {
      setOpenNotification(Boolean(value));
    } catch (error) {
      console.error("Error updating notification state:", error);
    }
  }, []);

  const providerValue = useMemo<LayoutContextType>(
    () => ({
      breadcrumb,
      isReloading,
      openNotification,
      updateBreadcrumb,
      updateReloadingState,
      updateNotificationState,
    }),
    [breadcrumb, isReloading, openNotification, updateBreadcrumb, updateReloadingState, updateNotificationState]
  );

  return (
    <ErrorBoundary>
      <LayoutContext.Provider value={providerValue}>{children}</LayoutContext.Provider>
    </ErrorBoundary>
  );
};

export const useLayoutContext = (): LayoutContextType => {
  const context = useContext(LayoutContext);

  if (context === defaultContextValue) {
    console.warn("useLayoutContext is being used outside of LayoutProvider. Using default context values.");
  }

  return context;
};
