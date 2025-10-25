// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { InteractiveCursor } from "@/components/InteractiveCursor";
// import Index from "./pages/Index";
// import Verify from "./pages/Verify";
// import NFTs from "./pages/NFTs";
// import Explorer from "./pages/Explorer";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <InteractiveCursor />
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Index />} />
//           <Route path="/verify" element={<Verify />} />
//           <Route path="/nfts" element={<NFTs />} />
//           <Route path="/explorer" element={<Explorer />} />
//           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;



import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InteractiveCursor } from "@/components/InteractiveCursor";

import Index from "./pages/Index";
import Verify from "./pages/Verify";
import NFTs from "./pages/NFTs";
import Explorer from "./pages/Explorer";
import NotFound from "./pages/NotFound";

import { RainbowKitWrapper } from "@/lib/rainbowkit"; // 🌈 import your provider wrapper

const App = () => (
  <RainbowKitWrapper>
    <TooltipProvider>
      <InteractiveCursor />
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/nfts" element={<NFTs />} />
          <Route path="/explorer" element={<Explorer />} />
          {/* Keep custom routes above catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </RainbowKitWrapper>
);

export default App;
