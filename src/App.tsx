import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import CapacitorExperiment from "./pages/CapacitorExperiment.tsx";
import OhmExperiment from "./pages/OhmExperiment.tsx";
import RCExperiment from "./pages/RCExperiment.tsx";
import CoilExperiment from "./pages/CoilExperiment.tsx";
import FaradayExperiment from "./pages/FaradayExperiment.tsx";
import TransformerExperiment from "./pages/TransformerExperiment.tsx";
import RLCExperiment from "./pages/RLCExperiment.tsx";
import MotorExperiment from "./pages/MotorExperiment.tsx";
import ChargeExperiment from "./pages/ChargeExperiment.tsx";
import HallExperiment from "./pages/HallExperiment.tsx";
import AmpereExperiment from "./pages/AmpereExperiment.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/experimentos/capacitor" element={<CapacitorExperiment />} />
          <Route path="/experimentos/ohm" element={<OhmExperiment />} />
          <Route path="/experimentos/rc" element={<RCExperiment />} />
          <Route path="/experimentos/bobina" element={<CoilExperiment />} />
          <Route path="/experimentos/inducao" element={<FaradayExperiment />} />
          <Route path="/experimentos/transformador" element={<TransformerExperiment />} />
          <Route path="/experimentos/rlc" element={<RLCExperiment />} />
          <Route path="/experimentos/motor" element={<MotorExperiment />} />
          <Route path="/experimentos/carga-em-campos" element={<ChargeExperiment />} />
          <Route path="/experimentos/hall" element={<HallExperiment />} />
          <Route path="/experimentos/ampere" element={<AmpereExperiment />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
