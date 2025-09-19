import React, { useState } from "react";
import { StyleOption, TRENDING_STYLES } from "@/types/styles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TrendingUp,
  Sparkles,
  Wand2,
  Zap,
  Camera,
  Gamepad2,
  Rainbow,
  Waves,
  Box,
  Instagram,
  Circle,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendingStyleSelectorProps {
  onStyleSelect: (style: StyleOption) => void;
  selectedStyle?: StyleOption | null;
  className?: string;
}

// Map style IDs to appropriate icons
const getStyleIcon = (styleId: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    "studio-ghibli": <Sparkles className="h-5 w-5" />,
    "3d-figurine": <Box className="h-5 w-5" />,
    "instagram-aesthetic": <Instagram className="h-5 w-5" />,
    "neon-cyberpunk": <Zap className="h-5 w-5" />,
    holographic: <Rainbow className="h-5 w-5" />,
    vaporwave: <Waves className="h-5 w-5" />,
    "pixel-art": <Gamepad2 className="h-5 w-5" />,
    glassmorphism: <Circle className="h-5 w-5" />,
    polaroid: <Camera className="h-5 w-5" />,
  };
  return iconMap[styleId] || <Wand2 className="h-5 w-5" />;
};

const getStyleColor = (styleId: string) => {
  const colorMap: Record<string, string> = {
    "studio-ghibli": "text-emerald-600 bg-emerald-50",
    "3d-figurine": "text-blue-600 bg-blue-50 ",
    "instagram-aesthetic": "text-pink-600 bg-pink-50",
    "neon-cyberpunk": "text-cyan-600 bg-cyan-50 ",
    "holographic": "text-violet-600 bg-violet-50 ",
    "vaporwave": "text-fuchsia-600 bg-fuchsia-50",
    "pixel-art": "text-green-600 bg-green-50",
    "glassmorphism": "text-slate-600 bg-slate-50",
    "polaroid": "text-amber-600 bg-amber-50",
  };
  return colorMap[styleId] || "text-primary bg-primary/10";
};

export function TrendingStyleSelector({
  onStyleSelect,
  selectedStyle,
  className,
}: TrendingStyleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStyleSelect = (style: StyleOption) => {
    onStyleSelect(style);
    setIsOpen(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Trending Styles</h3>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start h-auto p-3.5 hover:bg-muted/50 transition-colors border-2 border-dashed hover:border-primary/50"
          >
            <div className="flex items-center gap-3 w-full min-w-0">
              {selectedStyle && selectedStyle.type === "trending" ? (
                <>
                  <div
                    className={cn(
                      "p-2 rounded-lg border",
                      getStyleColor(selectedStyle.id)
                    )}
                  >
                    {getStyleIcon(selectedStyle.id)}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {selectedStyle.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {selectedStyle.description}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 rounded-lg border-2 border-dashed bg-gradient-to-br from-pink-50 to-violet-50 text-gradient">
                    <TrendingUp className="h-5 w-5 text-pink-600" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      Choose Trending Style
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      Latest viral styles like Studio Ghibli, 3D figurines, etc.
                    </div>
                  </div>
                </>
              )}
            </div>
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Trending Art Styles
              
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {TRENDING_STYLES.length} viral styles taking the internet by storm
            </div>

            {/* Styles Grid with Custom Cards */}
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TRENDING_STYLES.map((style) => (
                  <div
                    key={style.id}
                    className="group cursor-pointer p-4 rounded-xl border bg-card hover:bg-muted/50 hover:border-primary/50 transition-all duration-200 hover:shadow-md relative overflow-hidden"
                    onClick={() => handleStyleSelect(style)}
                  >
                    {/* Trending glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex items-start gap-3 relative z-10">
                      <div
                        className={cn(
                          "p-3 rounded-lg border transition-colors",
                          getStyleColor(style.id)
                        )}
                      >
                        {getStyleIcon(style.id)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {style.name}
                          </h4>
                          <Sparkles className="h-3 w-3 text-pink-500 flex-shrink-0" />
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                          {style.description}
                        </p>
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
