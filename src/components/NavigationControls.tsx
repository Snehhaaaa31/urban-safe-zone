import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigation, MapPin, Route, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NavigationControlsProps {
  onRouteCalculate: (from: string, to: string) => void;
  isCalculating?: boolean;
  routeInfo?: {
    distance: string;
    duration: string;
    safetyRating: "Safe" | "Moderate" | "Risky";
  };
}

const NavigationControls = ({ 
  onRouteCalculate, 
  isCalculating = false,
  routeInfo 
}: NavigationControlsProps) => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Auto-detect current location
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    setIsGettingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Use reverse geocoding (you might want to implement this with Google Maps API)
      setCurrentLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    } catch (error) {
      console.error("Error getting location:", error);
      setCurrentLocation("Location unavailable");
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Auto-detect location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleCalculateRoute = () => {
    if (currentLocation && destination) {
      onRouteCalculate(currentLocation, destination);
    }
  };

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case "Safe": return "hsl(var(--success-green))";
      case "Moderate": return "hsl(var(--warning-yellow))";
      case "Risky": return "hsl(var(--danger-red))";
      default: return "hsl(var(--muted-foreground))";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 right-4 z-20 w-80 max-w-[calc(100vw-2rem)]"
    >
      <Card className="p-4 bg-card/95 backdrop-blur-sm border border-border shadow-soft">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-card-foreground">Safe Navigation</h3>
          </div>

          {/* Current Location Input */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wide">
              From
            </label>
            <div className="flex gap-2">
              <Input
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder="Enter starting location..."
                className="flex-1 text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="px-2"
              >
                {isGettingLocation ? (
                  <Navigation className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Destination Input */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wide">
              To
            </label>
            <Input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination..."
              className="text-sm"
            />
          </div>

          {/* Calculate Route Button */}
          <Button
            onClick={handleCalculateRoute}
            disabled={!currentLocation || !destination || isCalculating}
            className="w-full"
          >
            {isCalculating ? (
              <>
                <Navigation className="h-4 w-4 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Route className="h-4 w-4 mr-2" />
                Find Safe Route
              </>
            )}
          </Button>

          {/* Route Information */}
          {routeInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="border-t border-border pt-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-card-foreground">
                    {routeInfo.duration}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {routeInfo.distance}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">Safety Rating:</span>
                <Badge
                  variant="secondary"
                  style={{ 
                    backgroundColor: `${getSafetyColor(routeInfo.safetyRating)}20`,
                    color: getSafetyColor(routeInfo.safetyRating),
                    border: `1px solid ${getSafetyColor(routeInfo.safetyRating)}40`
                  }}
                >
                  {routeInfo.safetyRating}
                </Badge>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default NavigationControls;