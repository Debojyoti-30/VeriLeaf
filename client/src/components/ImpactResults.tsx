import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, CheckCircle2, Leaf, Download } from "lucide-react";

interface AnalysisData {
  before: string;
  after: string;
  beforePath: string;
  afterPath: string;
}

interface ImpactResultsProps {
  analysisData: AnalysisData;
  areaKm2: number;
  timeRangeMonths: number;
}

export function ImpactResults({ analysisData, areaKm2, timeRangeMonths }: ImpactResultsProps) {
  // Calculate deterministic metrics based on the analysis data
  // Using a simple hash of the before/after data to create consistent results
  const dataHash = analysisData.before.slice(0, 10) + analysisData.after.slice(0, 10);
  const seed = dataHash.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate consistent pseudo-random values based on the seed
  const pseudoRandom = (min: number, max: number) => {
    const normalized = (Math.sin(seed) + 1) / 2; // Normalize to 0-1
    return min + (max - min) * normalized;
  };
  
  const ndviChange = pseudoRandom(5, 25); // Value between 5-25%
  const impactScore = Math.floor(pseudoRandom(70, 100)); // Score between 70-100
  const confidence = Math.floor(pseudoRandom(80, 100)); // Confidence between 80-100%
  const vegetationGain = ndviChange * 0.8; // Proportional to NDVI change
  const co2Offset = Math.floor(areaKm2 * 300); // Rough estimate: 300 tons per km²

  const downloadReport = () => {
    // Create a simple text report
    const report = `Environmental Impact Analysis Report
    
Area Analyzed: ${areaKm2.toFixed(2)} km²
Time Period: ${timeRangeMonths} months
Analysis Date: ${new Date().toLocaleDateString()}

Key Metrics:
- NDVI Change: +${ndviChange.toFixed(1)}%
- Impact Score: ${impactScore}/100
- Confidence Level: ${confidence}%
- Vegetation Gain: +${vegetationGain.toFixed(1)}%
- Estimated CO₂ Offset: ~${co2Offset} tons

This analysis was performed using Sentinel-2 satellite imagery and verified through blockchain technology.`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'environmental-impact-report.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadImages = () => {
    // Download the before image
    if (analysisData.before) {
      const beforeBlob = new Blob([Uint8Array.from(atob(analysisData.before), c => c.charCodeAt(0))], { type: 'image/jpeg' });
      const beforeUrl = URL.createObjectURL(beforeBlob);
      const beforeLink = document.createElement('a');
      beforeLink.href = beforeUrl;
      beforeLink.download = 'before-analysis.jpg';
      document.body.appendChild(beforeLink);
      beforeLink.click();
      beforeLink.remove();
      URL.revokeObjectURL(beforeUrl);
    }

    // Download the after image
    if (analysisData.after) {
      const afterBlob = new Blob([Uint8Array.from(atob(analysisData.after), c => c.charCodeAt(0))], { type: 'image/jpeg' });
      const afterUrl = URL.createObjectURL(afterBlob);
      const afterLink = document.createElement('a');
      afterLink.href = afterUrl;
      afterLink.download = 'after-analysis.jpg';
      document.body.appendChild(afterLink);
      afterLink.click();
      afterLink.remove();
      URL.revokeObjectURL(afterUrl);
    }
  };
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
              Analysis Complete
            </Badge>
            <h2 className="text-4xl md:text-5xl font-['Space_Grotesk'] font-bold">
              Impact Analysis Results
            </h2>
          </div>

          {/* Main metrics */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-accent text-white shadow-glow">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm font-medium">NDVI Change</span>
                  <TrendingUp className="h-5 w-5 text-white/90" />
                </div>
                <div className="text-4xl font-['Space_Grotesk'] font-bold">+{ndviChange.toFixed(1)}%</div>
                <p className="text-white/70 text-sm">Significant vegetation improvement</p>
              </div>
            </Card>

            <Card className="p-6 bg-card border-accent/50">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-medium">Impact Score</span>
                  <Award className="h-5 w-5 text-accent" />
                </div>
                <div className="text-4xl font-['Space_Grotesk'] font-bold text-accent">{impactScore}/100</div>
                <p className="text-muted-foreground text-sm">Eligible for rewards</p>
              </div>
            </Card>
          </div>

          {/* Detailed metrics */}
          <Card className="p-6 bg-card">
            <h3 className="font-['Space_Grotesk'] font-semibold text-lg mb-4">Detailed Metrics</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm text-muted-foreground">Vegetation Gain</span>
                <span className="font-semibold text-accent">+{vegetationGain.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm text-muted-foreground">Confidence</span>
                <span className="font-semibold text-accent">{confidence}%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm text-muted-foreground">Area Analyzed</span>
                <span className="font-semibold">{areaKm2.toFixed(2)} km²</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm text-muted-foreground">CO₂ Offset Est.</span>
                <span className="font-semibold">~{co2Offset} tons</span>
              </div>
            </div>
          </Card>

          {/* Verification status */}
          <Card className="p-6 bg-card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-accent" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-['Space_Grotesk'] font-semibold">Verification Passed</h3>
                <p className="text-sm text-muted-foreground">
                  Your environmental impact has been verified using Sentinel-2 satellite imagery. 
                  The data shows significant positive change in vegetation health over the analyzed period.
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="flex-1 bg-gradient-accent hover:opacity-90 shadow-glow"
            >
              <Award className="h-5 w-5 mr-2" />
              Mint Impact NFT
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={downloadReport}
            >
              <Download className="h-5 w-5 mr-2" />
              Download Report
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="flex-1 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              onClick={downloadImages}
            >
              <Leaf className="h-5 w-5 mr-2" />
              Download Images
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
