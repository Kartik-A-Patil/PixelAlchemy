import { GoogleGenAI } from '@google/genai';
import { GeminiConfig, AIAnalysis, AISuggestion } from '@/types/image-editor';

export class GeminiClient {
  private client: GoogleGenAI | null = null;
  private apiKey: string | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    const storedKey = localStorage.getItem('gemini-api-key');
    if (storedKey) {
      this.apiKey = storedKey;
      this.client = new GoogleGenAI({
        apiKey: storedKey,
      });
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new GoogleGenAI({
      apiKey: apiKey,
    });
    localStorage.setItem('gemini-api-key', apiKey);
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  clearApiKey() {
    this.apiKey = null;
    this.client = null;
    localStorage.removeItem('gemini-api-key');
  }

  isConfigured(): boolean {
    return this.client !== null && this.apiKey !== null;
  }

  async analyzeImage(imageFile: File): Promise<AIAnalysis> {
    if (!this.client) {
      throw new Error('Gemini API client not configured. Please set your API key.');
    }

    try {
      const imageBase64 = await this.fileToBase64(imageFile);
      const mimeType = imageFile.type;

      const analysisPrompt = `
        Analyze this image thoroughly and provide a JSON response with the following structure:
        {
          "objects": ["list of main objects, people, animals detected"],
          "style": "description of the photo style (e.g., 'casual outdoor photo', 'professional portrait', 'artistic composition')",
          "issues": ["list of potential issues like 'background clutter', 'low contrast', 'overexposed', 'blurry', 'poor lighting'"],
          "description": "detailed description of what's in the image",
          "suggestions": [
            {
              "id": "unique_id",
              "label": "Remove background clutter",
              "description": "Clean up distracting elements in the background",
              "category": "removal",
              "prompt": "Remove clutter and distracting objects from the background"
            }
          ]
        }

        For suggestions, use these categories:
        - "enhancement": improving quality, colors, lighting
        - "removal": removing unwanted objects or elements  
        - "style": applying artistic effects or filters
        - "fix": correcting exposure, blur, or other technical issues

        Provide 3-6 specific, actionable suggestions based on what you observe.
        Only return the JSON, no additional text.
      `;

      // Use gemini-2.5-flash-lite for analysis - it's faster and more cost-effective for analysis tasks
      const config = {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
      };

      const contents = [
        {
          role: 'user' as const,
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType,
              },
            },
            {
              text: analysisPrompt,
            },
          ],
        },
      ];

      const result = await this.client.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        config,
        contents,
      });

      if (!result.candidates || !result.candidates[0] || !result.candidates[0].content) {
        throw new Error('No response received from Gemini API');
      }

      const textPart = result.candidates[0].content.parts?.find(part => 'text' in part);
      if (!textPart || !('text' in textPart) || !textPart.text) {
        throw new Error('No text response received from Gemini API');
      }

      const text = textPart.text;

      // Clean up the response to extract JSON
      const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      try {
        const analysis = JSON.parse(jsonText);
        
        // Ensure suggestions have unique IDs
        if (analysis.suggestions) {
          analysis.suggestions = analysis.suggestions.map((suggestion: any, index: number) => ({
            ...suggestion,
            id: suggestion.id || `suggestion_${index + 1}`
          }));
        }

        return analysis;
      } catch (parseError) {
        console.error('Failed to parse analysis JSON:', jsonText);
        throw new Error('Failed to parse analysis response');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error(`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateEditedImage(
    imageFile: File,
    prompt: string,
    config: GeminiConfig
  ): Promise<string> {
    if (!this.client) {
      throw new Error('Gemini API client not configured. Please set your API key.');
    }

    try {
      const imageBase64 = await this.fileToBase64(imageFile);
      const mimeType = imageFile.type;

      // Use gemini-2.5-flash-image-preview for actual image generation/editing
      const apiConfig = {
        responseModalities: ['IMAGE', 'TEXT'],
      };

      const contents = [
        {
          role: 'user' as const,
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ];

      const response = await this.client.models.generateContentStream({
        model: 'gemini-2.5-flash-image-preview',
        config: apiConfig,
        contents,
      });

      // Process the stream to find image data
      for await (const chunk of response) {
        if (!chunk.candidates || !chunk.candidates[0]?.content?.parts) {
          continue;
        }

        for (const part of chunk.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const imageData = part.inlineData.data;
            const responseMimeType = part.inlineData.mimeType || 'image/png';
            return `data:${responseMimeType};base64,${imageData}`;
          }
        }
      }

      throw new Error('No image data received from Gemini API');
    } catch (error) {
      console.error('Error generating edited image:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('429') || error.message.includes('rate limit')) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        if (error.message.includes('quota')) {
          throw new Error('API quota exceeded. Please check your Gemini API usage limits.');
        }
      }
      
      throw new Error(`Failed to generate edited image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async processImageEdit(
    imageFile: File,
    prompt: string,
    config: GeminiConfig
  ): Promise<string> {
    if (!this.client) {
      throw new Error('Gemini API client not configured. Please set your API key.');
    }

    try {
      // Convert image to base64
      const imageBase64 = await this.fileToBase64(imageFile);
      const mimeType = imageFile.type;

      const editPrompt = `
        Analyze this image and provide detailed instructions for editing it based on the following request: "${prompt}"
        
        Please provide:
        1. A detailed description of what changes should be made
        2. Step-by-step editing instructions
        3. Technical parameters or settings that would achieve the desired result
        4. Any color, lighting, or composition adjustments needed
        
        Be specific and technical in your response to help achieve professional results.
      `;

      const apiConfig = {
        temperature: config.temperature,
        topP: config.topP,
        topK: config.topK,
        maxOutputTokens: config.maxOutputTokens,
      };

      const contents = [
        {
          role: 'user' as const,
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType,
              },
            },
            {
              text: editPrompt,
            },
          ],
        },
      ];

      const result = await this.client.models.generateContent({
        model: 'gemini-2.5-flash-lite', // Use lite version for text analysis
        config: apiConfig,
        contents,
      });

      if (!result.candidates || !result.candidates[0] || !result.candidates[0].content) {
        throw new Error('No response received from Gemini API');
      }

      const textPart = result.candidates[0].content.parts?.find(part => 'text' in part);
      if (!textPart || !('text' in textPart) || !textPart.text) {
        throw new Error('No text response received from Gemini API');
      }

      return textPart.text;
    } catch (error) {
      console.error('Error processing image edit:', error);
      throw new Error(`Failed to process image edit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private getSafetySettings(level: 'default' | 'strict' | 'none') {
    // Note: This is a simplified implementation
    // In a real app, you'd configure actual safety settings based on the level
    return [];
  }
}

export const geminiClient = new GeminiClient();
