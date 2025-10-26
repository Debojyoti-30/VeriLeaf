import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapInterface } from "@/components/MapInterface";

const Verify = () => {
  return (
    <div className="min-h-screen bg-background font-['Inter']">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
              Satellite Analysis
            </div>
            <div className="text-sm font-medium text-primary border border-primary/50 px-3 py-1 rounded-full">
              AI Powered
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-['Space_Grotesk'] font-bold">
            Verify Environmental Impact
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Draw your project area on the map and analyze vegetation changes using Sentinel-2 satellite data
          </p>
        </div>

        {/* Map Interface Component */}
        <MapInterface />
      </main>

      <Footer />
    </div>
  );
};

export default Verify;
