import { Toaster } from "./presentation/components/ui/sonner";
import { router } from "./presentation/routes/app-routing";

import { RouterProvider } from "react-router";
import { AuthProvider } from "./presentation/providers/auth-provider";
import { TooltipProvider } from "./presentation/components/ui/tooltip";
import { ThemeProvider } from "./presentation/providers/theme-provider";
import { LayoutProvider } from "./presentation/providers/layout-provider";
import { QueryClientProvider } from "./presentation/providers/query-client-provider";

function App() {
  return (
    <QueryClientProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <LayoutProvider>
          <AuthProvider>
            <TooltipProvider>
              <RouterProvider router={router} />
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </LayoutProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
