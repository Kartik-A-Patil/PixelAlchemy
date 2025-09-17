import { useState, useCallback } from 'react';
import { geminiClient } from '@/lib/gemini-client';
import { GeminiConfig } from '@/types/image-editor';
import { useToast } from '@/hooks/use-toast';

export function useGemini() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processImageEdit = useCallback(async (
    imageFile: File,
    prompt: string,
    config: GeminiConfig
  ): Promise<string | null> => {
    if (!geminiClient.isConfigured()) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key in the settings.",
        variant: "destructive",
      });
      return null;
    }

    setIsProcessing(true);
    try {
      const result = await geminiClient.processImageEdit(imageFile, prompt, config);
      
      toast({
        title: "Image Analysis Complete",
        description: "Your image has been analyzed successfully.",
      });
      
      return result;
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const setApiKey = useCallback((apiKey: string) => {
    try {
      geminiClient.setApiKey(apiKey);
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved securely.",
      });
    } catch (error) {
      toast({
        title: "Invalid API Key",
        description: "Please check your API key and try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const clearApiKey = useCallback(() => {
    geminiClient.clearApiKey();
    toast({
      title: "API Key Cleared",
      description: "Your API key has been removed.",
    });
  }, [toast]);

  return {
    isProcessing,
    processImageEdit,
    setApiKey,
    clearApiKey,
    isConfigured: geminiClient.isConfigured(),
    currentApiKey: geminiClient.getApiKey(),
  };
}
