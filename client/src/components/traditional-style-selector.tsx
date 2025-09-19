import React, { useState } from 'react';
import { StyleOption, TRADITIONAL_STYLES } from '@/types/styles';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Palette, 
  Brush, 
  Camera, 
  Gamepad2, 
  Eye, 
  Film, 
  CircleDot, 
  Clock, 
  Image as ImageIcon,
  Coffee
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TraditionalStyleSelectorProps {
  onStyleSelect: (style: StyleOption) => void;
  selectedStyle?: StyleOption | null;
  className?: string;
}

// Map style IDs to appropriate icons
const getStyleIcon = (styleId: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'oil-painting': <Brush className="h-5 w-5" />,
    'watercolor': <Palette className="h-5 w-5" />,
    'cartoon': <Gamepad2 className="h-5 w-5" />,
    'anime': <Eye className="h-5 w-5" />,
    'professional-portrait': <Camera className="h-5 w-5" />,
    'cinematic': <Film className="h-5 w-5" />,
    'black-white': <CircleDot className="h-5 w-5" />,
    'retro-80s': <Clock className="h-5 w-5" />,
    'vintage-film': <ImageIcon className="h-5 w-5" />,
    'sepia': <Coffee className="h-5 w-5" />
  };
  return iconMap[styleId] || <Palette className="h-5 w-5" />;
};

const getStyleColor = (styleId: string) => {
  const colorMap: Record<string, string> = {
    'oil-painting': 'text-amber-600 bg-amber-50 border-amber-200',
    'watercolor': 'text-blue-600 bg-blue-50 border-blue-200',
    'cartoon': 'text-green-600 bg-green-50 border-green-200',
    'anime': 'text-pink-600 bg-pink-50 border-pink-200',
    'professional-portrait': 'text-slate-600 bg-slate-50 border-slate-200',
    'cinematic': 'text-purple-600 bg-purple-50 border-purple-200',
    'black-white': 'text-gray-600 bg-gray-50 border-gray-200',
    'retro-80s': 'text-cyan-600 bg-cyan-50 border-cyan-200',
    'vintage-film': 'text-orange-600 bg-orange-50 border-orange-200',
    'sepia': 'text-yellow-600 bg-yellow-50 border-yellow-200'
  };
  return colorMap[styleId] || 'text-primary bg-primary/10 border-primary/20';
};

export function TraditionalStyleSelector({ onStyleSelect, selectedStyle, className }: TraditionalStyleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStyleSelect = (style: StyleOption) => {
    onStyleSelect(style);
    setIsOpen(false);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Traditional Styles</h3>
        </div>
        {selectedStyle && selectedStyle.type === 'traditional' && (
          <Badge variant="outline" className="text-xs">
            {selectedStyle.name}
          </Badge>
        )}
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start h-auto p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 w-full min-w-0">
              {selectedStyle && selectedStyle.type === 'traditional' ? (
                <>
                  <div className={cn("p-2 rounded-lg border", getStyleColor(selectedStyle.id))}>
                    {getStyleIcon(selectedStyle.id)}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{selectedStyle.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {selectedStyle.description}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 rounded-lg border bg-muted">
                    <Palette className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">Choose Traditional Style</div>
                    <div className="text-xs text-muted-foreground truncate">
                      Classic art styles like oil painting, watercolor, etc.
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
              <Palette className="h-5 w-5 text-primary" />
              Traditional Art Styles
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {TRADITIONAL_STYLES.length} classic styles available
            </div>
            
            {/* Styles Grid with Custom Cards */}
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TRADITIONAL_STYLES.map((style) => (
                  <div
                    key={style.id}
                    className="group cursor-pointer p-4 rounded-xl border bg-card hover:bg-muted/50 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
                    onClick={() => handleStyleSelect(style)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("p-3 rounded-lg border transition-colors", getStyleColor(style.id))}>
                        {getStyleIcon(style.id)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                          {style.name}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
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