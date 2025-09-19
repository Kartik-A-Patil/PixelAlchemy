import React, { useState } from 'react';
import { StyleOption, STYLE_OPTIONS, STYLE_CATEGORIES } from '@/types/styles';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Palette, Check, Sparkles, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StyleSelectorProps {
  onStyleSelect: (style: StyleOption) => void;
  selectedStyle?: StyleOption | null;
  className?: string;
}

export function StyleSelector({ onStyleSelect, selectedStyle, className }: StyleSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isOpen, setIsOpen] = useState(false);

  const filteredStyles = selectedCategory === 'all' 
    ? STYLE_OPTIONS 
    : STYLE_OPTIONS.filter(style => style.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors = {
      artistic: 'bg-gradient-to-r from-purple-500 to-pink-500',
      photography: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      modern: 'bg-gradient-to-r from-green-500 to-emerald-500',
      vintage: 'bg-gradient-to-r from-amber-500 to-orange-500',
      fantasy: 'bg-gradient-to-r from-indigo-500 to-purple-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gradient-to-r from-gray-500 to-slate-500';
  };

  const handleStyleSelect = (style: StyleOption) => {
    onStyleSelect(style);
    setIsOpen(false);
  };

  const StyleCard = ({ style, isSelected }: { style: StyleOption; isSelected: boolean }) => (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg border-2 relative overflow-hidden",
        isSelected
          ? "border-primary shadow-lg ring-2 ring-primary/20"
          : "border-border hover:border-primary/50"
      )}
      onClick={() => handleStyleSelect(style)}
    >
      <div className={cn(
        "absolute inset-0 opacity-10 transition-opacity",
        getCategoryColor(style.category)
      )} />
      
      <CardContent className="p-3 relative">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden",
              getCategoryColor(style.category)
            )}>
              <img
                src={style.referenceImage}
                alt={style.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.textContent = style.name.charAt(0);
                  }
                }}
              />
            </div>
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h5 className="font-semibold text-sm truncate">{style.name}</h5>
              <Badge 
                variant="secondary" 
                className="text-xs bg-background/50 text-foreground/70 border-0"
              >
                {style.category}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-2">
              {style.description}
            </p>
            <div className="text-xs text-muted-foreground/80 bg-background/30 rounded px-2 py-1 italic line-clamp-1">
              "{style.prompt.substring(0, 45)}..."
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Style Presets</h3>
        </div>
        {selectedStyle && (
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
            <div className="flex items-center gap-3 w-full">
              {selectedStyle ? (
                <>
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm overflow-hidden",
                    getCategoryColor(selectedStyle.category)
                  )}>
                    <img
                      src={selectedStyle.referenceImage}
                      alt={selectedStyle.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.textContent = selectedStyle.name.charAt(0);
                        }
                      }}
                    />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{selectedStyle.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {selectedStyle.description}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">Choose a style preset</div>
                    <div className="text-xs text-muted-foreground">
                      Browse artistic, photography, and vintage styles
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
              Choose Your Style
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {STYLE_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                {filteredStyles.length} style{filteredStyles.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            {/* Styles Grid */}
            <div className="max-h-[50vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredStyles.map((style) => (
                  <StyleCard
                    key={style.id}
                    style={style}
                    isSelected={selectedStyle?.id === style.id}
                  />
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}