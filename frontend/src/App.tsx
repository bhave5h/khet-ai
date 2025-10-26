import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CropRecommendation from "./pages/CropRecommendation";
import YieldPrediction from "./pages/YieldPrediction";
import FertilizerSuggestion from "./pages/FertilizerSuggestion";
import PriceEstimation from "./pages/PriceEstimation";
import DiseaseDetection from "./pages/DiseaseDetection";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/crop-recommendation" element={<CropRecommendation />} />
          <Route path="/yield-prediction" element={<YieldPrediction />} />
          <Route path="/fertilizer-suggestion" element={<FertilizerSuggestion />} />
          <Route path="/price-estimation" element={<PriceEstimation />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
