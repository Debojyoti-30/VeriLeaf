import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Scan, TrendingUp, Award, Download, Leaf, Upload, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { vegetationAnalysisService, AnalysisResults, ImpactAnalysis } from "@/services/vegetationAnalysis";

const Verify = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedArea, setSelectedArea] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [beforeImagePreview, setBeforeImagePreview] = useState<string | null>(null);
  const [afterImagePreview, setAfterImagePreview] = useState<string | null>(null);
  
  const beforeFileRef = useRef<HTMLInputElement>(null);
  const afterFileRef = useRef<HTMLInputElement>(null);

  // Cleanup blob URLs on component unmount
  useEffect(() => {
    return () => {
      if (beforeImagePreview) {
        URL.revokeObjectURL(beforeImagePreview);
      }
      if (afterImagePreview) {
        URL.revokeObjectURL(afterImagePreview);
      }
    };
  }, [beforeImagePreview, afterImagePreview]);

  const handleImageUpload = (file: File, type: 'before' | 'after') => {
    // Revoke previous blob URLs to prevent memory leaks
    if (type === 'before' && beforeImagePreview) {
      URL.revokeObjectURL(beforeImagePreview);
    }
    if (type === 'after' && afterImagePreview) {
      URL.revokeObjectURL(afterImagePreview);
    }

    if (type === 'before') {
      setBeforeImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBeforeImagePreview(result);
      };
      reader.readAsDataURL(file);
    } else {
      setAfterImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAfterImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
    setError(null);
    // Hide results when new images are uploaded
    setShowResults(false);
    setAnalysisResults(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.files?.[0]) {
      handleImageUpload(e.target.files[0], type);
    }
  };

  const handleAnalyze = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (!beforeImage || !afterImage) {
      setError("Please upload both before and after images");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setShowResults(false);

    try {
      const results = await vegetationAnalysisService.analyzeVegetation(beforeImage, afterImage);
      setAnalysisResults(results);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUseSampleImages = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    setIsAnalyzing(true);
    setError(null);
    setShowResults(false);

    try {
      // Use the existing before.jpg and after.jpg files
      const results = await vegetationAnalysisService.analyzeVegetationByPaths({
        before_path: "before.jpg",
        after_path: "after.jpg"
      });
      setAnalysisResults(results);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Image Upload Interface */}
          <Card className="lg:col-span-2 p-6 bg-card shadow-eco">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-['Space_Grotesk'] font-semibold">Upload Images</h2>
                <div className="text-sm text-muted-foreground">
                  Or use sample images below
                </div>
              </div>

              {/* Image Upload Areas */}
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-4">
                {/* Before Image */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Before Image</label>
                  <div 
                    className="aspect-video border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-accent transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      beforeFileRef.current?.click();
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => e.preventDefault()}
                  >
                    {beforeImagePreview ? (
                      <img 
                        src={beforeImagePreview} 
                        alt="Before" 
                        className="w-full h-full object-cover rounded-lg"
                        draggable={false}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDragStart={(e) => e.preventDefault()}
                      />
                    ) : (
                      <div className="text-center space-y-2">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">Click to upload</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={beforeFileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'before')}
                    className="hidden"
                  />
                </div>

                {/* After Image */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">After Image</label>
                  <div 
                    className="aspect-video border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-accent transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      afterFileRef.current?.click();
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => e.preventDefault()}
                  >
                    {afterImagePreview ? (
                      <img 
                        src={afterImagePreview} 
                        alt="After" 
                        className="w-full h-full object-cover rounded-lg"
                        draggable={false}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDragStart={(e) => e.preventDefault()}
                      />
                    ) : (
                      <div className="text-center space-y-2">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">Click to upload</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={afterFileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'after')}
                    className="hidden"
                  />
                </div>
                </div>
              </form>

              {/* Error Display */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Analysis Controls */}
          <Card className="p-6 bg-card space-y-6 h-fit">
            <div className="space-y-4">
              <h3 className="font-['Space_Grotesk'] font-semibold text-lg">Analysis Parameters</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    Before Date (T0)
                  </label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-accent transition-all"
                    defaultValue="2023-01-15"
                  />
                  <p className="text-xs text-muted-foreground">Initial state of the project</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    After Date (T1)
                  </label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-accent transition-all"
                    defaultValue="2025-10-20"
                  />
                  <p className="text-xs text-muted-foreground">Current state after intervention</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Area Selected</span>
                <span className="font-semibold text-accent">{selectedArea ? "0.42 km²" : "None"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Time Range</span>
                <span className="font-semibold">33 months</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated Cost</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                type="button"
                onClick={handleUseSampleImages}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Scan className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4 mr-2" />
                    Use Sample Images
                  </>
                )}
              </Button>
              
              <Button 
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!beforeImage || !afterImage)}
                className="w-full bg-gradient-accent hover:opacity-90 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Scan className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Images...
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4 mr-2" />
                    Run Analysis
                  </>
                )}
              </Button>
            </div>

            {isAnalyzing && (
              <div className="space-y-2 animate-fade-in">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-accent animate-[slide-in-right_2s_ease-in-out_infinite]" style={{ width: "60%" }} />
                </div>
                <p className="text-xs text-center text-muted-foreground">Processing vegetation analysis...</p>
              </div>
            )}

            {/* Analysis Status */}
            {isAnalyzing && (
              <div className="mt-8 p-6 bg-card border border-accent/20 rounded-lg">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center">
                    <Scan className="h-8 w-8 text-accent animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold">Analyzing Images</h3>
                  <p className="text-sm text-muted-foreground">
                    Calculating vegetation indices and impact scores...
                  </p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* No Results Message */}
        {!showResults && !isAnalyzing && (
          <div className="mt-12 text-center">
            <div className="p-8 bg-card border border-border rounded-lg">
              <div className="space-y-3">
                <Scan className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold text-muted-foreground">Ready for Analysis</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Upload your before and after images or use the sample images to start the vegetation analysis.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {showResults && analysisResults && (
          <div className="mt-12 space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <Badge className={vegetationAnalysisService.getImpactCategoryBadgeVariant(analysisResults.impact_analysis.category)}>
                ✓ Analysis Complete
              </Badge>
              <h2 className="text-3xl md:text-4xl font-['Space_Grotesk'] font-bold">
                Impact Analysis Results
              </h2>
              <p className="text-muted-foreground">
                {vegetationAnalysisService.generateAnalysisSummary(analysisResults)}
              </p>
            </div>

            {/* Main Metrics */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-gradient-accent text-white shadow-glow hover:shadow-eco transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm font-medium">NDVI Change</span>
                    <TrendingUp className="h-6 w-6 text-white/90 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-5xl font-['Space_Grotesk'] font-bold">
                    {analysisResults.impact_analysis.ndvi_change_percent > 0 ? '+' : ''}{analysisResults.impact_analysis.ndvi_change_percent.toFixed(1)}%
                  </div>
                  <p className="text-white/70 text-sm">
                    {analysisResults.impact_analysis.ndvi_change_percent > 0 ? 'Vegetation improvement detected' : 'Vegetation decline detected'}
                  </p>
                </div>
              </Card>

              <Card className="p-6 bg-card border-2 border-accent/50 hover:border-accent transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm font-medium">Impact Score</span>
                    <Award className="h-6 w-6 text-accent group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-5xl font-['Space_Grotesk'] font-bold text-accent">
                    {vegetationAnalysisService.formatImpactScore(analysisResults.impact_analysis.impact_score)}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {analysisResults.impact_analysis.category} Impact
                  </p>
                </div>
              </Card>

              <Card className="p-6 bg-card hover:shadow-eco transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm font-medium">Confidence</span>
                    <Leaf className="h-6 w-6 text-accent group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-5xl font-['Space_Grotesk'] font-bold">
                    {analysisResults.impact_analysis.confidence.toFixed(1)}%
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {analysisResults.impact_analysis.confidence >= 80 ? 'High confidence' : 
                     analysisResults.impact_analysis.confidence >= 60 ? 'Moderate confidence' : 'Low confidence'}
                  </p>
                </div>
              </Card>
            </div>

            {/* Detailed Metrics */}
            <Card className="p-8 bg-card">
              <h3 className="text-xl font-['Space_Grotesk'] font-semibold mb-6">Detailed Environmental Metrics</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                  <div className="text-sm text-muted-foreground mb-1">EVI Change</div>
                  <div className="text-2xl font-semibold text-accent">
                    {analysisResults.impact_analysis.evi_change_percent > 0 ? '+' : ''}{analysisResults.impact_analysis.evi_change_percent.toFixed(1)}%
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                  <div className="text-sm text-muted-foreground mb-1">FVC Change</div>
                  <div className="text-2xl font-semibold">
                    {analysisResults.impact_analysis.fvc_change_percent > 0 ? '+' : ''}{analysisResults.impact_analysis.fvc_change_percent.toFixed(1)}%
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                  <div className="text-sm text-muted-foreground mb-1">LAI Change</div>
                  <div className="text-2xl font-semibold">
                    {analysisResults.impact_analysis.lai_change_percent > 0 ? '+' : ''}{analysisResults.impact_analysis.lai_change_percent.toFixed(1)}%
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                  <div className="text-sm text-muted-foreground mb-1">CO₂ Offset Est.</div>
                  <div className="text-2xl font-semibold">
                    ~{vegetationAnalysisService.calculateCO2Offset(analysisResults.impact_analysis.impact_score, 0.42)} tons
                  </div>
                </div>
              </div>
            </Card>

            {/* Before/After Comparison */}
            <Card className="p-8 bg-card">
              <h3 className="text-xl font-['Space_Grotesk'] font-semibold mb-6">Before vs After Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">Metric</th>
                      <th className="text-right py-3 px-4 font-medium">Before</th>
                      <th className="text-right py-3 px-4 font-medium">After</th>
                      <th className="text-right py-3 px-4 font-medium">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['ndvi', 'evi', 'ndwi', 'savi', 'lai', 'fvc'].map((metric) => {
                      const beforeVal = analysisResults.before_metrics[`${metric}_mean` as keyof typeof analysisResults.before_metrics] as number;
                      const afterVal = analysisResults.after_metrics[`${metric}_mean` as keyof typeof analysisResults.after_metrics] as number;
                      const change = afterVal - beforeVal;
                      return (
                        <tr key={metric} className="border-b border-border/50">
                          <td className="py-3 px-4 font-medium">{metric.toUpperCase()}</td>
                          <td className="py-3 px-4 text-right">{beforeVal.toFixed(3)}</td>
                          <td className="py-3 px-4 text-right">{afterVal.toFixed(3)}</td>
                          <td className={`py-3 px-4 text-right ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? '+' : ''}{change.toFixed(3)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <Button size="lg" className="flex-1 bg-gradient-accent hover:opacity-90 shadow-glow">
                <Award className="h-5 w-5 mr-2" />
                Mint Impact NFT
              </Button>
              <Button size="lg" variant="outline" className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Download className="h-5 w-5 mr-2" />
                Download Report
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  setShowResults(false);
                  setAnalysisResults(null);
                }}
              >
                Clear Results
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Verify;
