import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Scan, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";

// Leaflet / React-Leaflet
import { MapContainer, TileLayer, useMapEvents, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export function MapInterface() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<[number, number][]>([]);
  const [tempPoint, setTempPoint] = useState<[number, number] | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  const startDrawing = () => {
    setPoints([]);
    setTempPoint(null);
    setDrawing(true);
  };

  const finishDrawing = () => {
    setDrawing(false);
    setTempPoint(null);
  };

  const clearPolygon = () => {
    setPoints([]);
    setTempPoint(null);
    setDrawing(false);
  };

  // memoized center
  const center = useMemo(() => [0, 0] as [number, number], []);

  function ClickHandler() {
    useMapEvents({
      click(e) {
        if (!drawing) return;
        setPoints(prev => [...prev, [e.latlng.lat, e.latlng.lng]]);
      },
      mousemove(e) {
        if (!drawing) return;
        setTempPoint([e.latlng.lat, e.latlng.lng]);
      }
    });
    return null;
  }

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-['Space_Grotesk'] font-bold">
              Verify Your Impact
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Draw your project area and analyze environmental changes
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map with drawing */}
            <Card className="lg:col-span-2 p-4 bg-card">
              <div className="aspect-video rounded-lg border-2 border-dashed border-border relative overflow-hidden">
                <MapContainer center={center} zoom={2} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <ClickHandler />
                  {/* show drawing polygon: include tempPoint to give rubberband while drawing */}
                  {points.length > 0 && (
                    <Polygon positions={points.map(p => [p[0], p[1]])} pathOptions={{ color: '#10b981' }} />
                  )}
                  {drawing && points.length > 0 && tempPoint && (
                    <Polygon
                      positions={[...points, tempPoint].map(p => [p[0], p[1]])}
                      pathOptions={{ dashArray: '6', color: '#34d399' }}
                    />
                  )}
                </MapContainer>
                <div className="absolute top-3 left-3 z-[9999] space-x-2 pointer-events-auto">
                  {!drawing ? (
                    <Button size="sm" onClick={startDrawing}>Start Drawing</Button>
                  ) : (
                    <>
                      <Button size="sm" onClick={finishDrawing} className="mr-2">Finish</Button>
                      <Button size="sm" variant="outline" onClick={clearPolygon}>Cancel</Button>
                    </>
                  )}
                </div>
                <div className="absolute top-3 right-3 z-[9999] pointer-events-auto">
                  <Button size="sm" variant="destructive" onClick={clearPolygon} disabled={points.length === 0}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Polygon
                  </Button>
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--accent)/0.02),transparent_70%)] pointer-events-none" />
              </div>
            </Card>

            {/* Controls */}
            <Card className="p-6 bg-card space-y-6">
              <div className="space-y-4">
                <h3 className="font-['Space_Grotesk'] font-semibold text-lg">Analysis Parameters</h3>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      Before Date
                    </label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                      defaultValue="2023-01-01"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      After Date
                    </label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                      defaultValue="2025-10-01"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Area Selected</span>
                  <span className="font-medium">0.42 km²</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Time Range</span>
                  <span className="font-medium">33 months</span>
                </div>
              </div>

              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-gradient-accent hover:opacity-90 shadow-eco"
              >
                {isAnalyzing ? (
                  <>
                    <Scan className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4 mr-2" />
                    Run Analysis
                  </>
                )}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
