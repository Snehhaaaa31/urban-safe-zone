import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Layers, 
  Shield, 
  Navigation, 
  Hospital, 
  Phone, 
  MapPin,
  Eye,
  Route
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FloatingActionButtonsProps {
  onLayerToggle: (layer: string) => void;
  onEmergencyServices: () => void;
  onSafeRoute: () => void;
}

const FloatingActionButtons = ({
  onLayerToggle,
  onEmergencyServices,
  onSafeRoute
}: FloatingActionButtonsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actionButtons = [
    {
      id: "heatmap",
      icon: Layers,
      label: "Toggle Heatmap",
      color: "hsl(var(--primary))",
      action: () => onLayerToggle("heatmap")
    },
    {
      id: "safe-routes",
      icon: Route,
      label: "Safe Routes",
      color: "hsl(var(--success-green))",
      action: onSafeRoute
    },
    {
      id: "police",
      icon: Shield,
      label: "Police Stations",
      color: "hsl(var(--safety-blue))",
      action: () => onLayerToggle("police")
    },
    {
      id: "hospitals",
      icon: Hospital,
      label: "Hospitals",
      color: "hsl(var(--danger-red))",
      action: () => onLayerToggle("hospitals")
    },
    {
      id: "emergency",
      icon: Phone,
      label: "Emergency Services",
      color: "hsl(var(--destructive))",
      action: onEmergencyServices
    }
  ];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-24 left-6 z-50">
      <div className="flex flex-col-reverse items-start gap-3">
        {/* Action Buttons */}
        <AnimatePresence>
          {isExpanded && (
            <>
              {actionButtons.map((button, index) => {
                const IconComponent = button.icon;
                return (
                  <motion.div
                    key={button.id}
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      transition: { delay: index * 0.1 }
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.5, 
                      y: 20,
                      transition: { delay: (actionButtons.length - 1 - index) * 0.05 }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card className="p-0 border border-border shadow-soft">
                      <Button
                        onClick={button.action}
                        variant="ghost"
                        size="lg"
                        className="h-12 w-12 rounded-lg hover:bg-muted/50"
                      >
                        <IconComponent 
                          className="h-5 w-5" 
                          style={{ color: button.color }}
                        />
                      </Button>
                    </Card>
                  </motion.div>
                );
              })}
              
              {/* Labels */}
              {actionButtons.map((button, index) => (
                <motion.div
                  key={`label-${button.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: { delay: index * 0.1 + 0.2 }
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: -10,
                    transition: { delay: (actionButtons.length - 1 - index) * 0.05 }
                  }}
                  className="absolute left-16"
                  style={{ 
                    top: `${(actionButtons.length - 1 - index) * 60}px`
                  }}
                >
                  <Card className="px-3 py-2 bg-card/95 backdrop-blur-sm border border-border shadow-soft">
                    <span className="text-xs font-medium text-card-foreground whitespace-nowrap">
                      {button.label}
                    </span>
                  </Card>
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={toggleExpanded}
            size="lg"
            className={`h-14 w-14 rounded-full transition-all duration-300 ${
              isExpanded
                ? "bg-destructive hover:bg-destructive/90 shadow-danger"
                : "bg-primary hover:bg-primary/90 shadow-glow"
            }`}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="h-6 w-6" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default FloatingActionButtons;