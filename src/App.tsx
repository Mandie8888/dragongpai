import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback"; // ✅ NEW: Import AuthCallback
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import Privacy from "./pages/Privacy";
import RefundPolicy from "./pages/RefundPolicy";
import Unsubscribe from "./pages/Unsubscribe";
import AIStocks from "./pages/AIStocks";
import Watchlist from "./pages/Watchlist";
import AIGames from "./pages/AIGames";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} /> {/* ✅ NEW: Google OAuth callback route */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/ai-stocks" element={<AIStocks />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/ai-games" element={<AIGames />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;