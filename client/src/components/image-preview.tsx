import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageFile } from '@/types/image-editor';
import { Image, Sparkles, Download, Undo, Redo } from 'lucide-react';

interface ImagePreviewProps {
  uploadedImage: ImageFile | null;
  editedResult: string | null;
  isProcessing: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onDownload: () => void;
}

export function ImagePreview({
  uploadedImage,
  editedResult,
  isProcessing,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onDownload
}: ImagePreviewProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
            Preview & Results
          </h2>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              data-testid="button-undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              data-testid="button-redo"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Image */}
          <div className="space-y-3">
            <h3 className="font-medium text-muted-foreground">Original</h3>
            <div className="aspect-square bg-muted rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
              {uploadedImage ? (
                <img
                  src={uploadedImage.url}
                  alt="Original uploaded image"
                  className="w-full h-full object-cover"
                  data-testid="img-original"
                />
              ) : (
                <div className="text-center text-muted-foreground" data-testid="placeholder-original">
                  <Image className="h-12 w-12 mx-auto mb-3" />
                  <p>Upload an image to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Edited Result */}
          <div className="space-y-3">
            <h3 className="font-medium text-muted-foreground">Analysis & Instructions</h3>
            <div className="aspect-square bg-muted rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
              {isProcessing ? (
                <div className="text-center text-muted-foreground" data-testid="loading-state">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p>Processing your edit...</p>
                </div>
              ) : editedResult ? (
                <div className="p-4 text-sm overflow-y-auto max-h-full" data-testid="text-edit-result">
                  <pre className="whitespace-pre-wrap text-foreground">{editedResult}</pre>
                </div>
              ) : (
                <div className="text-center text-muted-foreground" data-testid="placeholder-edited">
                  <Sparkles className="h-12 w-12 mx-auto mb-3" />
                  <p>Analysis results will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {editedResult && (
          <div className="mt-6 text-center">
            <Button
              onClick={onDownload}
              className="px-6 py-3"
              data-testid="button-download"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Instructions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
