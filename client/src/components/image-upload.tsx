import React, { useCallback, useState, useRef, useEffect } from "react";
import { useState as useLocalState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageFile } from "@/types/image-editor";
import { CloudUpload, Image, X } from "lucide-react";
import { Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageUpload: (file: File) => Promise<void>;
  uploadedImage: ImageFile | null;
  onClearImage: () => void;
  handleAnalyzeImage: () => void;
  editionState: any;
  toggleSuggestion?: (suggestionId: string) => void;
}

export function ImageUpload({
  onImageUpload,
  uploadedImage,
  onClearImage,
  handleAnalyzeImage,
  editionState,
  toggleSuggestion,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  // For mask preview on pin hover/click
  const [activeSuggestion, setActiveSuggestion] = useLocalState<number | null>(null);
  // Ref for the image element to calculate actual display dimensions
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    displayedLeft: number;
    displayedTop: number;
    displayedWidth: number;
    displayedHeight: number;
  }>({ displayedLeft: 0, displayedTop: 0, displayedWidth: 100, displayedHeight: 100 });

  // Calculate actual displayed image dimensions when image loads or window resizes
  useEffect(() => {
    const calculateImageDimensions = () => {
      if (!imageRef.current || !uploadedImage) return;

      const imgElement = imageRef.current;
      const containerRect = imgElement.getBoundingClientRect();
      const naturalAspectRatio = uploadedImage.dimensions.width / uploadedImage.dimensions.height;
      const containerAspectRatio = containerRect.width / containerRect.height;

      let displayedLeft = 0;
      let displayedTop = 0;
      let displayedWidth = 100;
      let displayedHeight = 100;

      if (naturalAspectRatio > containerAspectRatio) {
        // Image is wider than container - letterboxing on top/bottom
        displayedWidth = 100;
        displayedHeight = (containerRect.width / naturalAspectRatio) / containerRect.height * 100;
        displayedLeft = 0;
        displayedTop = (100 - displayedHeight) / 2;
      } else {
        // Image is taller than container - pillarboxing on left/right
        displayedHeight = 100;
        displayedWidth = (containerRect.height * naturalAspectRatio) / containerRect.width * 100;
        displayedTop = 0;
        displayedLeft = (100 - displayedWidth) / 2;
      }

      setImageDimensions({
        displayedLeft,
        displayedTop,
        displayedWidth,
        displayedHeight,
      });
    };

    if (uploadedImage) {
      // Calculate on image load
      if (imageRef.current?.complete) {
        calculateImageDimensions();
      }

      // Recalculate on window resize
      window.addEventListener('resize', calculateImageDimensions);
      return () => window.removeEventListener('resize', calculateImageDimensions);
    }
  }, [uploadedImage]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setIsUploading(true);

      try {
        await onImageUpload(file);
      } catch (error) {
        toast({
          title: "Upload Failed",
          description:
            error instanceof Error
              ? error.message
              : "An error occurred during upload.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [onImageUpload, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: isUploading,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <CloudUpload className="mr-2 h-5 w-5 text-primary" />
          Upload Image
        </h2>

        {uploadedImage ? (
          <div className="space-y-4" data-testid="image-preview">
            <div className="relative">
              <img
                ref={imageRef}
                src={uploadedImage.url}
                alt="Uploaded image"
                className="w-full h-auto max-h-96 object-contain rounded-lg border border-border"
                onLoad={() => {
                  // Recalculate dimensions when image loads
                  if (imageRef.current && uploadedImage) {
                    const imgElement = imageRef.current;
                    const containerRect = imgElement.getBoundingClientRect();
                    const naturalAspectRatio = uploadedImage.dimensions.width / uploadedImage.dimensions.height;
                    const containerAspectRatio = containerRect.width / containerRect.height;

                    let displayedLeft = 0;
                    let displayedTop = 0;
                    let displayedWidth = 100;
                    let displayedHeight = 100;

                    if (naturalAspectRatio > containerAspectRatio) {
                      // Image is wider than container - letterboxing on top/bottom
                      displayedWidth = 100;
                      displayedHeight = (containerRect.width / naturalAspectRatio) / containerRect.height * 100;
                      displayedLeft = 0;
                      displayedTop = (100 - displayedHeight) / 2;
                    } else {
                      // Image is taller than container - pillarboxing on left/right
                      displayedHeight = 100;
                      displayedWidth = (containerRect.height * naturalAspectRatio) / containerRect.width * 100;
                      displayedTop = 0;
                      displayedLeft = (100 - displayedWidth) / 2;
                    }

                    setImageDimensions({
                      displayedLeft,
                      displayedTop,
                      displayedWidth,
                      displayedHeight,
                    });
                  }
                }}
              />
              {/* Pin overlays for suggestions with tooltip and mask preview */}
              {editionState.analysis && Array.isArray(editionState.analysis.suggestions) && editionState.analysis.suggestions.map((s: import("@/types/image-editor").AISuggestion, idx: number) => {
                if (!s.highlight || s.highlight === null) return null;
                const { x, y, width, height } = s.highlight;
                
                // Calculate highlight position within the actual displayed image area
                const highlightLeft = imageDimensions.displayedLeft + (x * imageDimensions.displayedWidth);
                const highlightTop = imageDimensions.displayedTop + (y * imageDimensions.displayedHeight);
                const highlightWidth = width * imageDimensions.displayedWidth;
                const highlightHeight = height * imageDimensions.displayedHeight;
                
                // Constrain pin position within image bounds (with margins)
                const pinCenterX = Math.max(0.05, Math.min(0.95, x + width / 2));
                const pinCenterY = Math.max(0.05, Math.min(0.95, y + height / 2));
                const pinLeft = imageDimensions.displayedLeft + (pinCenterX * imageDimensions.displayedWidth);
                const pinTop = imageDimensions.displayedTop + (pinCenterY * imageDimensions.displayedHeight);
                
                // Smart tooltip positioning to stay within bounds
                const tooltipRight = pinLeft > 60; // Show tooltip on left if pin is on right side
                const tooltipLeft = tooltipRight ? `calc(${pinLeft}% - 200px)` : `calc(${pinLeft}% + 25px)`;
                const tooltipTop = `calc(${Math.max(5, Math.min(85, pinTop))}% - 10px)`;
                
                return (
                  <React.Fragment key={s.id || idx}>
                    {/* Pin marker */}
                    <button
                      type="button"
                      className={`absolute z-30 flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white font-bold border-2 border-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/60 animate-bounce cursor-pointer`}
                      style={{
                        left: `calc(${pinLeft}% - 14px)`,
                        top: `calc(${pinTop}% - 14px)`,
                      }}
                      onMouseEnter={() => setActiveSuggestion(idx)}
                      onMouseLeave={() => setActiveSuggestion(null)}
                      onFocus={() => setActiveSuggestion(idx)}
                      onBlur={() => setActiveSuggestion(null)}
                      onClick={() => {
                        if (toggleSuggestion) {
                          toggleSuggestion(s.id);
                        }
                      }}
                      tabIndex={0}
                      aria-label={`Toggle suggestion: ${s.label}`}
                    >
                      {idx + 1}
                    </button>
                    {/* Tooltip */}
                    {activeSuggestion === idx && (
                      <div
                        className="absolute z-40 px-3 py-2 rounded-lg bg-background border border-border shadow-xl text-xs text-foreground max-w-xs animate-fade-in"
                        style={{
                          left: tooltipLeft,
                          top: tooltipTop,
                        }}
                      >
                        <div className="font-semibold text-primary mb-1">{s.label}</div>
                        <div className="text-muted-foreground mb-1">{s.description}</div>
                        <div className="text-[10px] text-muted-foreground">Click to select/apply</div>
                      </div>
                    )}
                    {/* Mask overlay for region preview - positioned according to actual image dimensions */}
                    {activeSuggestion === idx && (
                      <div
                        className="absolute z-20 rounded-md pointer-events-none"
                        style={{
                          left: `${Math.max(0, highlightLeft)}%`,
                          top: `${Math.max(0, highlightTop)}%`,
                          width: `${Math.min(100 - Math.max(0, highlightLeft), highlightWidth)}%`,
                          height: `${Math.min(100 - Math.max(0, highlightTop), highlightHeight)}%`,
                          background: 'rgba(99,102,241,0.25)',
                          border: '2px dashed #6366f1',
                          transition: 'background 0.2s',
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </React.Fragment>
                );
              })}
              {/* Overlay Analyze Image floating button */}
              <button
                onClick={handleAnalyzeImage}
                disabled={editionState.isLoading}
                className={
                  `absolute top-3 left-3 z-30 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full  text-white shadow-xl transition-all duration-300 hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-offset-2 backdrop-blur-sm ` +
                  (editionState.isLoading ? 'opacity-60 cursor-not-allowed animate-pulse' : 'hover:animate-none')
                }
                aria-label="Analyze Image with AI"
                data-testid="button-analyze-image-overlay"
                type="button"
              > 
                  <Eye className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold">
                  {editionState.isLoading ? 'Analyzing...' : 'Analyze'}
                </span>
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearImage}
                className="absolute top-2 right-2 shadow-lg z-30"
                data-testid="button-clear-image"
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
            {/* Show error/issue below the image if present */}
            {editionState.error && (
              <div className="mt-2 rounded bg-destructive/10 text-destructive px-4 py-2 text-xs text-center">
                {editionState.error}
              </div>
            )}
            <div
              className="flex items-center justify-between p-3 rounded-lg"
              data-testid="file-info"
            >
              <div className="flex items-center space-x-3">
                <Image className="h-5 w-5 text-primary" />
                <div>
                  <p
                    className="text-sm font-medium"
                    data-testid="text-filename"
                  >
                    {uploadedImage.file.name}
                  </p>
                  <p
                    className="text-xs text-muted-foreground"
                    data-testid="text-file-details"
                  >
                    {formatFileSize(uploadedImage.size)} •{" "}
                    {uploadedImage.dimensions.width}x
                    {uploadedImage.dimensions.height}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? "border-primary bg-accent scale-102"
                : "border-border hover:border-primary/50"
            } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            data-testid="upload-zone"
          >
            <input {...getInputProps()} />

            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <CloudUpload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-medium">
                  {isUploading
                    ? "Uploading..."
                    : isDragActive
                    ? "Drop your image here"
                    : "Drop your image here or click to browse"}
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Supports JPG, PNG, WebP • Max 10MB
                </p>
              </div>
              {!isUploading && (
                <Button
                  type="button"
                  className="px-4 py-2"
                  data-testid="button-choose-file"
                >
                  Choose File
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
