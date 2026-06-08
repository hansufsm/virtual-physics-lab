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
import GaussExperiment from "./pages/GaussExperiment.tsx";
import DipoleExperiment from "./pages/DipoleExperiment.tsx";
import PotentialExperiment from "./pages/PotentialExperiment.tsx";
import DoubleSlitExperiment from "./pages/DoubleSlitExperiment.tsx";
import ProjectileExperiment from "./pages/ProjectileExperiment.tsx";
import PendulumExperiment from "./pages/PendulumExperiment.tsx";
import IdealGasExperiment from "./pages/IdealGasExperiment.tsx";
import LensExperiment from "./pages/LensExperiment.tsx";
import CollisionExperiment from "./pages/CollisionExperiment.tsx";
import StandingWaveExperiment from "./pages/StandingWaveExperiment.tsx";
import CalorimetryExperiment from "./pages/CalorimetryExperiment.tsx";
import PhotoelectricExperiment from "./pages/PhotoelectricExperiment.tsx";
import RadioactiveDecayExperiment from "./pages/RadioactiveDecayExperiment.tsx";
import TransientLRExperiment from "./pages/TransientLRExperiment.tsx";
import MichelsonExperiment from "./pages/MichelsonExperiment.tsx";
import ComptonExperiment from "./pages/ComptonExperiment.tsx";
import RelativityExperiment from "./pages/RelativityExperiment.tsx";
import ZeemanExperiment from "./pages/ZeemanExperiment.tsx";
import DavissonExperiment from "./pages/DavissonExperiment.tsx";
import SternGerlachExperiment from "./pages/SternGerlachExperiment.tsx";
import QuantumHallExperiment from "./pages/QuantumHallExperiment.tsx";
import RutherfordExperiment from "./pages/RutherfordExperiment.tsx";
import FranckHertzExperiment from "./pages/FranckHertzExperiment.tsx";
import MillikanExperiment from "./pages/MillikanExperiment.tsx";
import NMRExperiment from "./pages/NMRExperiment.tsx";
import LaserExperiment from "./pages/LaserExperiment.tsx";
import BlackbodyExperiment from "./pages/BlackbodyExperiment.tsx";
import HydrogenExperiment from "./pages/HydrogenExperiment.tsx";
import TunnelExperiment from "./pages/TunnelExperiment.tsx";
import FoucaultExperiment from "./pages/FoucaultExperiment.tsx";
import GratingExperiment from "./pages/GratingExperiment.tsx";
import FreefallExperiment from "./pages/FreefallExperiment.tsx";
import InclineExperiment from "./pages/InclineExperiment.tsx";
import SpringExperiment from "./pages/SpringExperiment.tsx";
import ArchimedesExperiment from "./pages/ArchimedesExperiment.tsx";
import MirrorExperiment from "./pages/MirrorExperiment.tsx";
import ForcedOscillatorExperiment from "./pages/ForcedOscillatorExperiment.tsx";
import BeatsExperiment from "./pages/BeatsExperiment.tsx";
import CarnotExperiment from "./pages/CarnotExperiment.tsx";
import FourierExperiment from "./pages/FourierExperiment.tsx";
import MaxwellExperiment from "./pages/MaxwellExperiment.tsx";
import StefanExperiment from "./pages/StefanExperiment.tsx";

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
          <Route path="/experimentos/gauss" element={<GaussExperiment />} />
          <Route path="/experimentos/dipolo" element={<DipoleExperiment />} />
          <Route path="/experimentos/potencial" element={<PotentialExperiment />} />
          <Route path="/experimentos/fenda-dupla" element={<DoubleSlitExperiment />} />
          <Route path="/experimentos/projeteis" element={<ProjectileExperiment />} />
          <Route path="/experimentos/pendulo" element={<PendulumExperiment />} />
          <Route path="/experimentos/gas-ideal" element={<IdealGasExperiment />} />
          <Route path="/experimentos/lentes" element={<LensExperiment />} />
          <Route path="/experimentos/colisoes" element={<CollisionExperiment />} />
          <Route path="/experimentos/ondas-corda" element={<StandingWaveExperiment />} />
          <Route path="/experimentos/calorimetria" element={<CalorimetryExperiment />} />
          <Route path="/experimentos/fotoeletrico" element={<PhotoelectricExperiment />} />
          <Route path="/experimentos/decaimento" element={<RadioactiveDecayExperiment />} />
          <Route path="/experimentos/transitorio-lr-rlc" element={<TransientLRExperiment />} />
          <Route path="/experimentos/michelson" element={<MichelsonExperiment />} />
          <Route path="/experimentos/compton" element={<ComptonExperiment />} />
          <Route path="/experimentos/relatividade" element={<RelativityExperiment />} />
          <Route path="/experimentos/zeeman" element={<ZeemanExperiment />} />
          <Route path="/experimentos/davisson-germer" element={<DavissonExperiment />} />
          <Route path="/experimentos/stern-gerlach" element={<SternGerlachExperiment />} />
          <Route path="/experimentos/hall-quantico" element={<QuantumHallExperiment />} />
          <Route path="/experimentos/rutherford" element={<RutherfordExperiment />} />
          <Route path="/experimentos/franck-hertz" element={<FranckHertzExperiment />} />
          <Route path="/experimentos/millikan" element={<MillikanExperiment />} />
          <Route path="/experimentos/rmn" element={<NMRExperiment />} />
          <Route path="/experimentos/laser" element={<LaserExperiment />} />
          <Route path="/experimentos/corpo-negro" element={<BlackbodyExperiment />} />
          <Route path="/experimentos/hidrogenio" element={<HydrogenExperiment />} />
          <Route path="/experimentos/tunelamento" element={<TunnelExperiment />} />
          <Route path="/experimentos/foucault" element={<FoucaultExperiment />} />
          <Route path="/experimentos/rede-difracao" element={<GratingExperiment />} />
          <Route path="/experimentos/queda-livre" element={<FreefallExperiment />} />
          <Route path="/experimentos/plano-inclinado" element={<InclineExperiment />} />
          <Route path="/experimentos/mola-hooke" element={<SpringExperiment />} />
          <Route path="/experimentos/arquimedes" element={<ArchimedesExperiment />} />
          <Route path="/experimentos/espelhos-esfericos" element={<MirrorExperiment />} />
          <Route path="/experimentos/oscilacoes-forcadas" element={<ForcedOscillatorExperiment />} />
          <Route path="/experimentos/batimentos" element={<BeatsExperiment />} />
          <Route path="/experimentos/carnot" element={<CarnotExperiment />} />
          <Route path="/experimentos/conducao-calor" element={<FourierExperiment />} />
          <Route path="/experimentos/maxwell-boltzmann" element={<MaxwellExperiment />} />
          <Route path="/experimentos/radiacao-termica" element={<StefanExperiment />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
