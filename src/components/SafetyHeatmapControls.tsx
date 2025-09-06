import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Car, Users, Building2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SafetyCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  enabled: boolean;
}

interface SafetyHeatmapControlsProps {
  onCategoryToggle: (categoryId: string, enabled: boolean) => void;
  onHeatmapToggle: (enabled: boolean) => void;
  heatmapEnabled: boolean;
}

const SafetyHeatmapControls = ({ 
  onCategoryToggle, 
  onHeatmapToggle, 
  heatmapEnabled 
}: SafetyHeatmapControlsProps) => {
  const [categories, setCategories] = useState<SafetyCategory[]>([
    {
      id: "thefts",
      name: "Thefts",
      icon: Shield,
      color: "hsl(var(--danger-red))",
      enabled: true,
    },
    {
      id: "accidents",
      name: "Accidents", 
      icon: Car,
      color: "hsl(var(--warning-yellow))",
      enabled: true,
    },
    {
      id: "assaults",
      name: "Assaults",
      icon: Users,
      color: "hsl(var(--destructive))",
      enabled: true,
    },
    {
      id: "vandalism",
      name: "Vandalism",
      icon: Building2,
      color: "hsl(var(--accent))",
      enabled: false,
    },
  ]);

  const handleCategoryToggle = (categoryId: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, enabled: !cat.enabled }
          : cat
      )
    );
    
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      onCategoryToggle(categoryId, !category.enabled);
    }
  };

  const handleHeatmapToggle = () => {
    onHeatmapToggle(!heatmapEnabled);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-4 left-4 z-20"
    >
      <Card className="p-4 bg-card/95 backdrop-blur-sm border border-border shadow-soft">
        <div className="space-y-3">
          {/* Heatmap Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-card-foreground">
              Safety Heatmap
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHeatmapToggle}
              className={`p-1 h-8 w-8 ${
                heatmapEnabled 
                  ? "text-primary hover:text-primary/80" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {heatmapEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>

          {/* Category Toggles */}
          {heatmapEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2 border-t border-border pt-3"
            >
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Categories
              </span>
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={category.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent 
                        className="h-3 w-3" 
                        style={{ color: category.enabled ? category.color : "hsl(var(--muted-foreground))" }}
                      />
                      <span className={`text-xs ${
                        category.enabled ? "text-card-foreground" : "text-muted-foreground"
                      }`}>
                        {category.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCategoryToggle(category.id)}
                      className={`p-1 h-6 w-6 ${
                        category.enabled 
                          ? "text-primary hover:text-primary/80" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {category.enabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </Button>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default SafetyHeatmapControls;