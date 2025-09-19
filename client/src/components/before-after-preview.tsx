import React, { useCallback, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageFile } from '@/types/image-editor';
import { ArrowRight, Download, RefreshCw, Sparkles } from 'lucide-react';

interface BeforeAfterPreviewProps {
  originalImage: ImageFile;
  editedImage: string | null;
  appliedPrompt: string;
  onStartNewEdit: () => void;
  onDownload: () => void;
  isLoading?: boolean;
  enableSlider?: boolean; // show overlay slider comparison
}

export const BeforeAfterPreview: React.FC<BeforeAfterPreviewProps> = ({
  originalImage,
  editedImage,
  appliedPrompt,
  onStartNewEdit,
  onDownload,
  isLoading = false,
  enableSlider = true,
}) => {
  const [sliderValue, setSliderValue] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(e.target.value));
  }, []);

  const showSlider = enableSlider && !isLoading && editedImage;

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Badge variant="default" className="px-3 py-1">
          <Sparkles className="h-3 w-3 mr-1" />
          {isLoading ? 'Applying Edit…' : 'Edit Applied'}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Before & After</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Side by side (desktop) */}
            <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-center">Original</h3>
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={originalImage.url}
                    alt={originalImage.file?.name || 'Original image'}
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-center">Edited</h3>
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                  ) : editedImage ? (
                    <img
                      src={editedImage}
                      alt="Edited image"
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No edit produced yet</div>
                  )}
                </div>
              </div>
            </div>

            {/* Stacked (mobile) */}
            <div className="md:hidden space-y-8">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-center">Original</h3>
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={originalImage.url}
                    alt={originalImage.file?.name || 'Original image'}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="h-8 w-8 text-muted-foreground rotate-90" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-center">Edited</h3>
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                  ) : editedImage ? (
                    <img
                      src={editedImage}
                      alt="Edited image"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No edit produced yet</div>
                  )}
                </div>
              </div>
            </div>

            {/* Overlay slider comparison */}
            {showSlider && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-center">Interactive Comparison</h3>
                <div
                  ref={containerRef}
                  className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden select-none"
                >
                  <img
                    src={originalImage.url}
                    alt="Original image"
                    className="absolute inset-0 w-full h-full object-contain"
                    draggable={false}
                  />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderValue}%` }}
                  >
                    <img
                      src={editedImage!}
                      alt="Edited image overlay"
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                  {/* Divider */}
                  <div
                    className="absolute top-0 bottom-0" 
                    style={{ left: `${sliderValue}%` }}
                  >
                    <div className="w-px h-full bg-primary/70 shadow-[0_0_4px_rgba(0,0,0,0.4)]" />
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sliderValue}
                  onChange={handleSlider}
                  aria-label="Comparison slider"
                  className="w-full cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-wide text-muted-foreground px-1">
                  <span>Original</span>
                  <span>Edited</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Applied Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg whitespace-pre-wrap break-words">
            {appliedPrompt || '—'}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        <Button
          onClick={onDownload}
          className="w-full"
          disabled={isLoading || !editedImage}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Result
        </Button>
      </div>
    </div>
  );
};