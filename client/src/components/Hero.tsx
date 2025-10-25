import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
// PrismaticBurst moved to page-level background (Index.tsx)

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-transparent">
      
      {/* Prismatic background is now applied at the page level (Index) */}

      

      
      
      <div className="container mx-auto px-4 py-20 relative z-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border/50 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-sm font-medium">Powered by Celo & AI</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-['Space_Grotesk'] font-bold leading-tight">
            Verify & Monetize
            <span className="block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mt-2">
              Environmental Impact
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Use satellite data and AI to prove your reforestation, restoration, or conservation projects. 
            Mint verified impact NFTs and earn rewards on the Celo blockchain.
          </p>

          {/* Features */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            {[
              "Satellite-Verified Data",
              "AI Impact Analysis",
              "Instant Rewards",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-accent hover:opacity-90 transition-opacity shadow-glow group"
            >
              <Link to="/verify" className="flex items-center gap-2">
                Start Verification
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Link to="/explorer">View Explorer</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            {[
              { value: "1.2K+", label: "Verified Projects" },
              { value: "48M", label: "Trees Tracked" },
              { value: "892", label: "NFTs Minted" },
            ].map((stat, i) => (
              <div
                key={i}
                className="space-y-1 group cursor-default"
              >
                <div className="text-3xl font-['Space_Grotesk'] font-bold text-accent group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
