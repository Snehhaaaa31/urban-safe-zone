import { useState } from "react";
import { motion } from "framer-motion";
import GoogleMapComponent from "@/components/GoogleMap";
import CollapsibleChatSidebar from "@/components/CollapsibleChatSidebar";
import SOSButton from "@/components/SOSButton";
import SafetyHeatmapControls from "@/components/SafetyHeatmapControls";
import NavigationControls from "@/components/NavigationControls";
import FloatingActionButtons from "@/components/FloatingActionButtons";
import { useToast } from "@/hooks/use-toast";

const MapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [heatmapEnabled, setHeatmapEnabled] = useState(true);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    safetyRating: "Safe" | "Moderate" | "Risky";
  } | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const { toast } = useToast();

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    console.log("Location selected:", location);
  };

  const handleCategoryToggle = (categoryId: string, enabled: boolean) => {
    console.log(`Category ${categoryId} ${enabled ? 'enabled' : 'disabled'}`);
    toast({
      title: `${categoryId} ${enabled ? 'enabled' : 'disabled'}`,
      description: `Safety category ${categoryId} has been ${enabled ? 'enabled' : 'disabled'} on the heatmap.`
    });
  };

  const handleHeatmapToggle = (enabled: boolean) => {
    setHeatmapEnabled(enabled);
    toast({
      title: enabled ? "Heatmap enabled" : "Heatmap disabled",
      description: enabled ? "Safety heatmap is now visible" : "Safety heatmap is now hidden"
    });
  };

  const handleRouteCalculate = async (from: string, to: string) => {
    setIsCalculatingRoute(true);
    
    // Simulate route calculation
    setTimeout(() => {
      const mockRouteInfo = {
        distance: "2.4 km",
        duration: "8 minutes",
        safetyRating: "Safe" as const
      };
      
      setRouteInfo(mockRouteInfo);
      setIsCalculatingRoute(false);
      
      toast({
        title: "Safe route calculated",
        description: `Found a ${mockRouteInfo.safetyRating.toLowerCase()} route taking ${mockRouteInfo.duration}`
      });
    }, 2000);
  };

  const handleLayerToggle = (layer: string) => {
    toast({
      title: `${layer} layer toggled`,
      description: `${layer} overlay has been toggled on the map`
    });
  };

  const handleEmergencyServices = () => {
    toast({
      title: "Emergency services contacted",
      description: "Your location has been shared with emergency services",
      variant: "destructive"
    });
  };

  const handleSafeRoute = () => {
    toast({
      title: "Safe route mode activated",
      description: "Showing safest available routes"
    });
  };

  const handleRouteHighlight = (route: any) => {
    console.log("Highlighting route:", route);
    toast({
      title: "Route highlighted",
      description: "AI assistant has highlighted a safe route on the map"
    });
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      {/* Full Screen Map */}
      <div className="h-full w-full relative">
        <GoogleMapComponent onLocationSelect={handleLocationSelect} />
        
        {/* Safety Heatmap Controls */}
        <SafetyHeatmapControls
          onCategoryToggle={handleCategoryToggle}
          onHeatmapToggle={handleHeatmapToggle}
          heatmapEnabled={heatmapEnabled}
        />

        {/* Navigation Controls */}
        <NavigationControls
          onRouteCalculate={handleRouteCalculate}
          isCalculating={isCalculatingRoute}
          routeInfo={routeInfo}
        />

        {/* Floating Action Buttons */}
        <FloatingActionButtons
          onLayerToggle={handleLayerToggle}
          onEmergencyServices={handleEmergencyServices}
          onSafeRoute={handleSafeRoute}
        />

        {/* Collapsible Chat Sidebar */}
        <CollapsibleChatSidebar onRouteHighlight={handleRouteHighlight} />

        {/* Location Info Overlay */}
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-80 bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-soft max-w-sm z-10"
          >
            <h3 className="font-semibold text-card-foreground mb-2">
              Selected Location
            </h3>
            <p className="text-sm text-muted-foreground">
              Latitude: {selectedLocation.lat.toFixed(6)}
            </p>
            <p className="text-sm text-muted-foreground">
              Longitude: {selectedLocation.lng.toFixed(6)}
            </p>
          </motion.div>
        )}

        {/* SOS Button - Fixed position */}
        <SOSButton />
      </div>
    </div>
  );
};

export default MapPage;