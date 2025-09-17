import React from 'react';
import { AIAnalysis, SelectedEdit } from '@/types/image-editor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, Image, Palette, Wrench } from 'lucide-react';

interface AISuggestionsProps {
  analysis: AIAnalysis;
  selectedEdits: SelectedEdit[];
  customPrompt: string;
  onToggleSuggestion: (suggestionId: string) => void;
  onCustomPromptChange: (prompt: string) => void;
  onGenerateEdit: () => void;
  isLoading: boolean;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'enhancement':
      return <Palette className="h-4 w-4" />;
    case 'removal':
      return <Image className="h-4 w-4" />;
    case 'style':
      return <Lightbulb className="h-4 w-4" />;
    case 'fix':
      return <Wrench className="h-4 w-4" />;
    default:
      return <Lightbulb className="h-4 w-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'enhancement':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'removal':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'style':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'fix':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const AISuggestions: React.FC<AISuggestionsProps> = ({
  analysis,
  selectedEdits,
  customPrompt,
  onToggleSuggestion,
  onCustomPromptChange,
  onGenerateEdit,
  isLoading,
}) => {
  const isEditsSelected = selectedEdits.length > 0 || customPrompt.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Analysis
          </CardTitle>
          <CardDescription>
            Here's what I found in your image
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{analysis.description}</p>
          </div>

          {analysis.objects.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Objects Detected</h4>
              <div className="flex flex-wrap gap-1">
                {analysis.objects.map((object, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {object}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">Style</h4>
            <Badge variant="outline">{analysis.style}</Badge>
          </div>

          {analysis.issues.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Potential Issues</h4>
              <div className="flex flex-wrap gap-1">
                {analysis.issues.map((issue, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {issue}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Edits</CardTitle>
          <CardDescription>
            Select the edits you'd like to apply to your image
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis.suggestions.map((suggestion) => {
            const isSelected = selectedEdits.some(edit => edit.suggestionId === suggestion.id);
            
            return (
              <div
                key={suggestion.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                  isSelected 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-background border-border hover:bg-muted/50'
                }`}
              >
                <Checkbox
                  id={suggestion.id}
                  checked={isSelected}
                  onCheckedChange={() => onToggleSuggestion(suggestion.id)}
                  className="mt-0.5"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={suggestion.id}
                      className="font-medium cursor-pointer"
                    >
                      {suggestion.label}
                    </label>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getCategoryColor(suggestion.category)}`}
                    >
                      <span className="flex items-center gap-1">
                        {getCategoryIcon(suggestion.category)}
                        {suggestion.category}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Custom Prompt */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Edits</CardTitle>
          <CardDescription>
            Add your own editing instructions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="custom-prompt">Additional Instructions</Label>
            <Textarea
              id="custom-prompt"
              placeholder="e.g., Make the sky more dramatic, add warm sunset colors..."
              value={customPrompt}
              onChange={(e) => onCustomPromptChange(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={onGenerateEdit}
          disabled={!isEditsSelected || isLoading}
          size="lg"
          className="w-full max-w-sm"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
              Generating...
            </>
          ) : (
            `Generate Edited Image${selectedEdits.length > 0 ? ` (${selectedEdits.length} edit${selectedEdits.length > 1 ? 's' : ''})` : ''}`
          )}
        </Button>
      </div>

      {selectedEdits.length > 0 && (
        <div className="mt-4">
          <Separator className="my-4" />
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Selected Edits:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedEdits.map((edit) => (
                <Badge key={edit.suggestionId} variant="default" className="text-xs">
                  {edit.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};