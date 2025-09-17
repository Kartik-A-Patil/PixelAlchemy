export interface GeminiConfig {
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens: number;
  safetyLevel: 'default' | 'strict' | 'none';
  modelVersion: 'gemini-2.5-flash' | 'gemini-2.5-flash-lite' | 'gemini-2.5-flash-image-preview' | 'gemini-pro' | 'gemini-pro-vision';
}

export interface EditHistoryItem {
  id: string;
  prompt: string;
  timestamp: Date;
  originalImage: string;
  editedImage: string;
}

export interface AIAnalysis {
  objects: string[];
  style: string;
  issues: string[];
  suggestions: AISuggestion[];
  description: string;
}

export interface AISuggestion {
  id: string;
  label: string;
  description: string;
  category: 'enhancement' | 'removal' | 'style' | 'fix';
  prompt: string;
}

export interface SelectedEdit {
  suggestionId: string;
  label: string;
  prompt: string;
}

export interface ImageEditingState {
  phase: 'upload' | 'analyzing' | 'suggestions' | 'editing' | 'result' | 'refining';
  originalImage?: ImageFile;
  analysis?: AIAnalysis;
  selectedEdits: SelectedEdit[];
  customPrompt: string;
  editedImage?: string;
  isLoading: boolean;
  error?: string;
}

export interface ImageFile {
  file: File;
  url: string;
  dimensions: { width: number; height: number };
  size: number;
}

export interface PresetMode {
  name: 'Stable' | 'Creative' | 'High Fidelity';
  description: string;
  config: Partial<GeminiConfig>;
}

export const PRESET_MODES: PresetMode[] = [
  {
    name: 'Stable',
    description: 'Consistent, predictable results',
    config: {
      temperature: 0.3,
      topP: 0.8,
      topK: 40,
      modelVersion: 'gemini-2.5-flash-lite',
    }
  },
  {
    name: 'Creative',
    description: 'More artistic and experimental',
    config: {
      temperature: 0.9,
      topP: 0.95,
      topK: 100,
      modelVersion: 'gemini-2.5-flash',
    }
  },
  {
    name: 'High Fidelity',
    description: 'Maximum quality and detail',
    config: {
      temperature: 0.1,
      topP: 0.7,
      topK: 20,
      modelVersion: 'gemini-2.5-flash',
    }
  }
];

export const DEFAULT_CONFIG: GeminiConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 2048,
  safetyLevel: 'default',
  modelVersion: 'gemini-2.5-flash-lite'
};

export const QUICK_ACTIONS = [
  { name: 'Remove Background', icon: 'fas fa-eraser', prompt: 'Remove the background from this image completely, making it transparent' },
  { name: 'Enhance Colors', icon: 'fas fa-palette', prompt: 'Enhance the colors in this image to make them more vibrant and appealing' },
  { name: 'Fix Lighting', icon: 'fas fa-lightbulb', prompt: 'Improve the lighting in this image to make it look more professional and well-lit' },
  { name: 'Artistic Style', icon: 'fas fa-brush', prompt: 'Apply an artistic style to this image, making it look like a painting or artistic rendition' }
];

export const PROMPT_SUGGESTIONS = [
  'Remove background',
  'Make it Pixar style',
  'Enhance lighting',
  'Add vintage filter',
  'Make it black and white',
  'Increase contrast'
];
