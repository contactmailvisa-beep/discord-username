import { useEffect } from "react";
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
import GlobalAccount from "./pages/GlobalAccount";
import ManualCheck from "./pages/ManualCheck";
import History from "./pages/History";
import Stats from "./pages/Stats";
import Premium from "./pages/Premium";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import AddPremium from "./pages/admin/AddPremium";
import RemovePremium from "./pages/admin/RemovePremium";
import FounderLogs from "./pages/admin/FounderLogs";
import Docs from "./pages/Docs";
import SavedUsernames from "./pages/SavedUsernames";

const queryClient = new QueryClient();

const App = () => {

  // حذف Lovable Badge من DOM بشكل كامل وقوي
  useEffect(() => {
    const removeLovableBadge = () => {
      // حذف جميع العناصر المرتبطة بـ lovable
      const selectors = [
        '[id*="lovable-badge"]',
        '[class*="lovable-badge"]',
        '[id^="lovable-"]',
        'a[href*="lovable.dev"]',
        'button[id*="lovable"]',
        '#lovable-cover',
        '[data-lovable]',
        '.lovable-badge'
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });

      // حذف أي سكربت يحتوي على كود lovable
      const scripts = document.querySelectorAll('script');
      scripts.forEach(script => {
        const content = script.textContent || script.innerHTML || '';
        if (content.includes('lovable-badge') || 
            content.includes('lovable.dev') ||
            content.includes('lovable-cover')) {
          script.remove();
        }
      });
    };

    // تشغيل فوري
    removeLovableBadge();

    // مراقبة التغييرات في DOM
    const observer = new MutationObserver(() => {
      removeLovableBadge();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['id', 'class']
    });

    // فحص دوري كل 50ms للتأكد
    const interval = setInterval(removeLovableBadge, 50);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);
  
  return (
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
          <Route path="/dashboard/global" element={<GlobalAccount />} />
          <Route path="/dashboard/manual-check" element={<ManualCheck />} />
          <Route path="/dashboard/history" element={<History />} />
            <Route path="/dashboard/stats" element={<Stats />} />
            <Route path="/dashboard/saved" element={<SavedUsernames />} />
            <Route path="/dashboard/premium" element={<Premium />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/admin/premium/add" element={<AddPremium />} />
            <Route path="/admin/premium/remove" element={<RemovePremium />} />
            <Route path="/admin/founder-logs" element={<FounderLogs />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
