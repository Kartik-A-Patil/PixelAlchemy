import { useState, useCallback, useEffect } from 'react';
import { ImageFile, EditHistoryItem, GeminiConfig, DEFAULT_CONFIG, AIAnalysis, SelectedEdit, ImageEditingState } from '@/types/image-editor';
import { geminiClient } from '@/lib/gemini-client';

export function useImageEditor() {
  const [uploadedImage, setUploadedImage] = useState<ImageFile | null>(null);
  const [editedImageResult, setEditedImageResult] = useState<string | null>(null);
  const [editHistory, setEditHistory] = useState<EditHistoryItem[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [geminiConfig, setGeminiConfig] = useState<GeminiConfig>(DEFAULT_CONFIG);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  
  // New AI workflow state
  const [editingState, setEditingState] = useState<ImageEditingState>({
    phase: 'upload',
    selectedEdits: [],
    customPrompt: '',
    isLoading: false,
  });

  // Load saved state from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('gemini-config');
    if (savedConfig) {
      try {
        setGeminiConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Error loading saved config:', error);
      }
    }

    const savedPanelState = localStorage.getItem('settings-panel-open');
    if (savedPanelState) {
      setSettingsPanelOpen(savedPanelState === 'true');
    }
  }, []);

  // Save config to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gemini-config', JSON.stringify(geminiConfig));
  }, [geminiConfig]);

  // Save panel state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('settings-panel-open', settingsPanelOpen.toString());
  }, [settingsPanelOpen]);

  const uploadImage = useCallback(async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        reject(new Error('Unsupported file format. Please use JPG, PNG, or WebP.'));
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        reject(new Error('File too large. Maximum size is 10MB.'));
        return;
      }

      const url = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = () => {
        const imageFile: ImageFile = {
          file,
          url,
          dimensions: { width: img.width, height: img.height },
          size: file.size,
        };
        
        setUploadedImage(imageFile);
        setEditedImageResult(null);
        setEditingState({
          phase: 'upload',
          originalImage: imageFile,
          selectedEdits: [],
          customPrompt: '',
          isLoading: false,
        });
        resolve();
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image.'));
      };
      
      img.src = url;
    });
  }, []);

  const analyzeImage = useCallback(async (): Promise<void> => {
    if (!uploadedImage || !geminiClient.isConfigured()) {
      throw new Error('Image not uploaded or Gemini API not configured');
    }

    setEditingState(prev => ({ ...prev, phase: 'analyzing', isLoading: true, error: undefined }));

    try {
      const analysis = await geminiClient.analyzeImage(uploadedImage.file);
      setEditingState(prev => ({
        ...prev,
        phase: 'suggestions',
        analysis,
        isLoading: false,
      }));
    } catch (error) {
      setEditingState(prev => ({
        ...prev,
        phase: 'upload',
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to analyze image',
      }));
      throw error;
    }
  }, [uploadedImage]);

  const toggleSuggestion = useCallback((suggestionId: string) => {
    setEditingState(prev => {
      if (!prev.analysis) return prev;

      const suggestion = prev.analysis.suggestions.find(s => s.id === suggestionId);
      if (!suggestion) return prev;

      const isSelected = prev.selectedEdits.some(edit => edit.suggestionId === suggestionId);
      
      if (isSelected) {
        // Remove the suggestion
        return {
          ...prev,
          selectedEdits: prev.selectedEdits.filter(edit => edit.suggestionId !== suggestionId),
        };
      } else {
        // Add the suggestion
        const newEdit: SelectedEdit = {
          suggestionId: suggestion.id,
          label: suggestion.label,
          prompt: suggestion.prompt,
        };
        return {
          ...prev,
          selectedEdits: [...prev.selectedEdits, newEdit],
        };
      }
    });
  }, []);

  const buildPrompt = useCallback((): string => {
    const { selectedEdits, customPrompt } = editingState;
    
    const suggestionPrompts = selectedEdits.map(edit => edit.prompt);
    const allPrompts = [...suggestionPrompts];
    
    if (customPrompt.trim()) {
      allPrompts.push(customPrompt.trim());
    }
    
    if (allPrompts.length === 0) {
      return '';
    }
    
    if (allPrompts.length === 1) {
      return allPrompts[0];
    }
    
    return allPrompts.join('. ') + '.';
  }, [editingState]);

  const generateEditedImage = useCallback(async (): Promise<void> => {
    if (!uploadedImage || !geminiClient.isConfigured()) {
      throw new Error('Image not uploaded or Gemini API not configured');
    }

    const prompt = buildPrompt();
    if (!prompt) {
      throw new Error('No edits selected or custom prompt provided');
    }

    setEditingState(prev => ({ ...prev, phase: 'editing', isLoading: true, error: undefined }));

    try {
      const editedImageDataUrl = await geminiClient.generateEditedImage(
        uploadedImage.file,
        prompt,
        geminiConfig
      );
      
      setEditedImageResult(editedImageDataUrl);
      setEditingState(prev => ({
        ...prev,
        phase: 'result',
        editedImage: editedImageDataUrl,
        isLoading: false,
      }));

      // Add to history
      addToHistory(prompt, editedImageDataUrl);
    } catch (error) {
      setEditingState(prev => ({
        ...prev,
        phase: 'suggestions',
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate edited image',
      }));
      throw error;
    }
  }, [uploadedImage, buildPrompt, geminiConfig]);

  const setCustomPrompt = useCallback((prompt: string) => {
    setEditingState(prev => ({ ...prev, customPrompt: prompt }));
  }, []);

  const startNewEdit = useCallback(() => {
    setEditingState(prev => ({
      ...prev,
      phase: 'suggestions',
      selectedEdits: [],
      customPrompt: '',
      error: undefined,
    }));
  }, []);

  const resetWorkflow = useCallback(() => {
    setEditingState(prev => ({
      ...prev,
      phase: 'upload',
      analysis: undefined,
      selectedEdits: [],
      customPrompt: '',
      editedImage: undefined,
      error: undefined,
    }));
    setEditedImageResult(null);
  }, []);

  const addToHistory = useCallback((prompt: string, result: string) => {
    if (!uploadedImage) return;

    const newHistoryItem: EditHistoryItem = {
      id: Date.now().toString(),
      prompt,
      timestamp: new Date(),
      originalImage: uploadedImage.url,
      editedImage: result,
    };

    setEditHistory(prev => [...prev.slice(0, currentHistoryIndex + 1), newHistoryItem]);
    setCurrentHistoryIndex(prev => prev + 1);
  }, [uploadedImage, currentHistoryIndex]);

  const undo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(prev => prev - 1);
      const previousItem = editHistory[currentHistoryIndex - 1];
      setEditedImageResult(previousItem.editedImage);
    } else {
      setCurrentHistoryIndex(-1);
      setEditedImageResult(null);
    }
  }, [currentHistoryIndex, editHistory]);

  const redo = useCallback(() => {
    if (currentHistoryIndex < editHistory.length - 1) {
      setCurrentHistoryIndex(prev => prev + 1);
      const nextItem = editHistory[currentHistoryIndex + 1];
      setEditedImageResult(nextItem.editedImage);
    }
  }, [currentHistoryIndex, editHistory]);

  const canUndo = currentHistoryIndex >= 0;
  const canRedo = currentHistoryIndex < editHistory.length - 1;

  const clearImage = useCallback(() => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage.url);
    }
    setUploadedImage(null);
    setEditedImageResult(null);
    setEditHistory([]);
    setCurrentHistoryIndex(-1);
    resetWorkflow();
  }, [uploadedImage, resetWorkflow]);

  const updateConfig = useCallback((newConfig: Partial<GeminiConfig>) => {
    setGeminiConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const resetConfig = useCallback(() => {
    setGeminiConfig(DEFAULT_CONFIG);
  }, []);

  const downloadEditedImage = useCallback(() => {
    if (editedImageResult && editedImageResult.startsWith('data:image/')) {
      // Convert data URL to blob and download
      fetch(editedImageResult)
        .then(res => res.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'edited-image.png';
          a.click();
          URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('Error downloading image:', error);
        });
    }
  }, [editedImageResult]);

  return {
    // State
    uploadedImage,
    editedImageResult,
    editHistory,
    geminiConfig,
    settingsPanelOpen,
    editingState,

    // Actions
    uploadImage,
    analyzeImage,
    toggleSuggestion,
    setCustomPrompt,
    generateEditedImage,
    startNewEdit,
    resetWorkflow,
    buildPrompt,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    clearImage,
    updateConfig,
    resetConfig,
    setSettingsPanelOpen,
    downloadEditedImage,
    setEditedImageResult,
  };
}
