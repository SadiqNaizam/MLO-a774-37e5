import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import your pages
import NotFound from "./pages/NotFound"; // Always Must Include
import LoginPage from "./pages/LoginPage";
import PasswordRecoveryPage from "./pages/PasswordRecoveryPage";
import EmailDiscoveryPage from "./pages/EmailDiscoveryPage";
import AccountCreationPage from "./pages/AccountCreationPage";
import TwoFactorAuthPage from "./pages/TwoFactorAuthPage";

// Example Dashboard/Homepage after login
const DashboardPage = () => {
  console.log("DashboardPage loaded");
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to the Dashboard!</h1>
      <p>You are successfully logged in.</p>
    </div>
  );
};


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Authentication Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
          <Route path="/email-discovery" element={<EmailDiscoveryPage />} />
          <Route path="/account-creation" element={<AccountCreationPage />} />
          <Route path="/two-factor-auth" element={<TwoFactorAuthPage />} />
          
          {/* Example protected route - assuming login redirects here */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Set a default route, e.g., to login or a public homepage */}
          <Route path="/" element={<LoginPage />} /> 

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} /> {/* Always Include This Line As It Is. */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;