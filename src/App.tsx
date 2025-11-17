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
import ManualCheck from "./pages/ManualCheck";
import History from "./pages/History";
import Stats from "./pages/Stats";
import Premium from "./pages/Premium";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import AddPremium from "./pages/admin/AddPremium";
import RemovePremium from "./pages/admin/RemovePremium";

const queryClient = new QueryClient();

const App = () => {

useEffect(() => {
  // 1) بناء طبقة تغطي مكان البادج قبل ظهوره
  const cover = document.createElement("div");
  cover.id = "lovable-cover";
  cover.style.position = "fixed";
  cover.style.bottom = "0";
  cover.style.right = "0";
  cover.style.width = "300px";
  cover.style.height = "300px";
  cover.style.zIndex = "999999";
  cover.style.background = "transparent"; 
  cover.style.pointerEvents = "none";
  document.body.appendChild(cover);

  // Selectors تحذف البادج
  const selectors = [
    '#lovable-badge',
    '[id*="lovable"]',
    '[class*="lovable"]',
    'a[href*="lovable"]',
    'iframe[src*="lovable"]',
    'script[src*="lovable"]',
    '[data-testid*="lovable"]'
  ];

  const removeLovable = () => {
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach(el => el.remove());
    });
  };

  // 2) إزالة قوية + متكررة
  removeLovable();
  Promise.resolve().then(removeLovable);

  let rafId: number;
  const loop = () => {
    removeLovable();
    rafId = requestAnimationFrame(loop);
  };
  loop();

  // 3) MutationObserver يراقب DOM ويحذف لحظيًا
  const observer = new MutationObserver(() => {
    removeLovable();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // 4) بعد التأكد من مسح البادج بالكامل… نخفي الـ Cover بسلاسة
  setTimeout(() => {
    cover.style.transition = "opacity 200ms ease-out";
    cover.style.opacity = "0";

    setTimeout(() => cover.remove(), 250);
  }, 500);

  return () => {
    cancelAnimationFrame(rafId);
    observer.disconnect();
    cover.remove();
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
            <Route path="/dashboard/manual-check" element={<ManualCheck />} />
            <Route path="/dashboard/history" element={<History />} />
            <Route path="/dashboard/stats" element={<Stats />} />
            <Route path="/dashboard/premium" element={<Premium />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/admin/premium/add" element={<AddPremium />} />
            <Route path="/admin/premium/remove" element={<RemovePremium />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
