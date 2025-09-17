import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageFile } from '@/types/image-editor';
import { CloudUpload, Image, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUpload: (file: File) => Promise<void>;
  uploadedImage: ImageFile | null;
  onClearImage: () => void;
}

export function ImageUpload({ onImageUpload, uploadedImage, onClearImage }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);

    try {
      await onImageUpload(file);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [onImageUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: isUploading
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                src={uploadedImage.url}
                alt="Uploaded image"
                className="w-full h-auto max-h-96 object-contain rounded-lg border border-border"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={onClearImage}
                className="absolute top-2 right-2 shadow-lg"
                data-testid="button-clear-image"
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg" data-testid="file-info">
              <div className="flex items-center space-x-3">
                <Image className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium" data-testid="text-filename">
                    {uploadedImage.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid="text-file-details">
                    {formatFileSize(uploadedImage.size)} • {uploadedImage.dimensions.width}x{uploadedImage.dimensions.height}
                  </p>
                </div>
              </div>
              <div
                {...getRootProps()}
                className="cursor-pointer"
              >
                <input {...getInputProps()} />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  data-testid="button-replace-image"
                >
                  {isUploading ? 'Uploading...' : 'Replace'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-primary bg-accent scale-102'
                : 'border-border hover:border-primary/50'
            } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    ? 'Uploading...'
                    : isDragActive
                    ? 'Drop your image here'
                    : 'Drop your image here or click to browse'}
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
