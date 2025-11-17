import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import SelectUsername from "./pages/SelectUsername";
import Dashboard from "./pages/Dashboard";
import Tokens from "./pages/Tokens";
import Generator from "./pages/Generator";
import History from "./pages/History";
import Stats from "./pages/Stats";
import Premium from "./pages/Premium";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/select-username" element={<SelectUsername />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/tokens" element={<Tokens />} />
          <Route path="/dashboard/generator" element={<Generator />} />
          <Route path="/dashboard/history" element={<History />} />
          <Route path="/dashboard/stats" element={<Stats />} />
          <Route path="/dashboard/premium" element={<Premium />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/payment" element={<Payment />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
