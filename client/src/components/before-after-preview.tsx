import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageFile } from '@/types/image-editor';
import { ArrowRight, Download, RefreshCw, Sparkles } from 'lucide-react';

interface BeforeAfterPreviewProps {
  originalImage: ImageFile;
  editedImage: string;
  appliedPrompt: string;
  onStartNewEdit: () => void;
  onDownload: () => void;
  isLoading?: boolean;
}

export const BeforeAfterPreview: React.FC<BeforeAfterPreviewProps> = ({
  originalImage,
  editedImage,
  appliedPrompt,
  onStartNewEdit,
  onDownload,
  isLoading = false,
}) => {
  return (
    <div className="space-y-6">
      {/* Applied Changes Badge */}
      <div className="flex justify-center">
        <Badge variant="default" className="px-3 py-1">
          <Sparkles className="h-3 w-3 mr-1" />
          Edit Applied
        </Badge>
      </div>

      {/* Before/After Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Before & After</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Before */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-center">Original</h3>
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={originalImage.url}
                  alt="Original image"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center md:hidden">
              <ArrowRight className="h-8 w-8 text-muted-foreground rotate-90 md:rotate-0" />
            </div>
            <div className="hidden md:flex justify-center">
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
            </div>

            {/* After */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-center">Edited</h3>
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : (
                  <img
                    src={editedImage}
                    alt="Edited image"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applied Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Applied Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            {appliedPrompt}
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={onStartNewEdit}
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Make More Edits
        </Button>
        <Button
          onClick={onDownload}
          className="w-full"
          disabled={isLoading}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Result
        </Button>
      </div>
    </div>
  );
};