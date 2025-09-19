import React, { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import { SettingsPanel } from "@/components/settings-panel";
import { ApiKeyModal } from "@/components/api-key-modal";
import { AISuggestions } from "@/components/ai-suggestions";
import { BeforeAfterPreview } from "@/components/before-after-preview";
import { TraditionalStyleSelector } from "@/components/traditional-style-selector";
import { TrendingStyleSelector } from "@/components/trending-style-selector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useImageEditor } from "@/hooks/use-image-editor";
import { useGemini } from "@/hooks/use-gemini";
import { StyleOption } from "@/types/styles";
import { Wand2, Key, Settings, Zap, Eye, CheckCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { getCategoryIcon, getCategoryColor } from "@/utils/category";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Logo from "@/components/logo";
import { Label } from "@/components/ui/label";

export default function ImageEditor() {
  const {
    uploadedImage,
    editedImageResult,
    geminiConfig,
    settingsPanelOpen,
    editingState,
    uploadImage,
    analyzeImage,
    toggleSuggestion,
    setCustomPrompt,
    generateEditedImage,
    startNewEdit,
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
  } = useImageEditor();

  const { processImageEdit, isProcessing, isConfigured } = useGemini();

  const [prompt, setPrompt] = useState("");
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);

  const handleUploadComplete = async (file: File) => {
    try {
      await uploadImage(file);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!isConfigured) {
      setApiKeyModalOpen(true);
      return;
    }

    try {
      await analyzeImage();
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  const handleGenerateEditedImage = async () => {
    if (!isConfigured) {
      setApiKeyModalOpen(true);
      return;
    }

    try {
      await generateEditedImage();
    } catch (error) {
      console.error("Generation failed:", error);
    }
  };

  const handleProcessPrompt = async () => {
    if (!uploadedImage || !prompt.trim()) return;

    if (!isConfigured) {
      setApiKeyModalOpen(true);
      return;
    }

    const result = await processImageEdit(
      uploadedImage.file,
      prompt.trim(),
      geminiConfig
    );

    if (result) {
      setEditedImageResult(result);
      addToHistory(prompt.trim(), result);
      setPrompt("");
    }
  };

  const handleStyleSelect = (style: StyleOption) => {
    setSelectedStyle(style);
    setCustomPrompt(style.prompt);
  };

  // Minimal, single-page flow: always show upload, analysis, and suggestions inline
  const isEditsSelected =
    editingState.selectedEdits.length > 0 ||
    editingState.customPrompt.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-4 flex items-center justify-between">
          <Logo />

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setApiKeyModalOpen(true)}
              data-testid="button-api-key-settings"
            >
              <Key className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettingsPanelOpen(!settingsPanelOpen)}
              data-testid="button-settings-toggle"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex relative">
        <main
          className={`flex-1 p-4 lg:p-6 transition-all duration-300 overflow-hidden ${
            settingsPanelOpen ? "xl:mr-80" : "mr-0"
          }`}
        >
          <div className="w-full h-full">
            
            <div className="flex flex-col xl:flex-row gap-6 min-h-0">
              {/* Left Column (40%) */}
              <div className="w-full xl:w-[40%] space-y-6">
                {/* Natural Language Editor & Analysis */}
                <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4 xl:sticky">
                  {!uploadedImage && (
                    <div className="text-sm text-muted-foreground">
                      Upload an image on the right to begin AI analysis and
                      natural language editing.
                    </div>
                  )}
                  <div className="space-y-3">
                    {uploadedImage && (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <Wand2 className="h-5 w-5 text-primary" />
                          <h3 className="text-base font-semibold">
                            AI Image Editor
                          </h3>
                        </div>

                        {/* Style Selectors */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="w-full sm:w-1/2">
                            <TraditionalStyleSelector
                              onStyleSelect={handleStyleSelect}
                              selectedStyle={selectedStyle}
                            />
                          </div>
                          <div className="w-full sm:w-1/2">
                            <TrendingStyleSelector
                              onStyleSelect={handleStyleSelect}
                              selectedStyle={selectedStyle}
                            />
                          </div>
                        </div>

                        <Textarea
                          placeholder="Describe your edit (e.g., 'Remove background, professional headshot')"
                          value={editingState.customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          rows={7}
                          className="min-h-24 resize-none text-sm"
                          data-testid="textarea-prompt"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                              e.preventDefault();
                              handleProcessPrompt();
                            }
                          }}
                        />
                        
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] text-muted-foreground">
                            Ctrl+Enter
                          </p>
                          <Button
                            onClick={handleGenerateEditedImage}
                            disabled={
                              !isEditsSelected || editingState.isLoading
                            }
                            size="lg"
                            className="shadow-sm px-16"
                            data-testid="button-generate"
                          >
                            <Wand2 className="mr-2 h-4 w-4" />
                            {isProcessing ? "Processing..." : "Generate"}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                  {editingState.phase === "analyzing" && (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                      <span className="ml-3 text-xs text-muted-foreground">
                        Analyzing image...
                      </span>
                    </div>
                  )}
                  {editingState.analysis && (
                    <Card className="shadow-lg border-2 border-primary/20">
                      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                        <div className="flex items-center gap-2">
                          <Wand2 className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg font-bold tracking-tight">
                            Suggested Edits
                          </CardTitle>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {editingState.analysis.suggestions.length} found
                        </span>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        {(() => {
                          // Group suggestions by category for innovative UI
                          type Suggestion =
                            (typeof editingState.analysis.suggestions)[number];
                          const grouped: Record<string, Suggestion[]> = {};
                          editingState.analysis.suggestions.forEach((s) => {
                            if (!grouped[s.category]) grouped[s.category] = [];
                            grouped[s.category].push(s);
                          });
                          return Object.entries(grouped).map(
                            ([category, suggestionsArr]) => (
                              <div
                                key={category}
                                className="rounded-lg border bg-muted/30 p-2"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${getCategoryColor(
                                      category
                                    )}`}
                                  >
                                    {getCategoryIcon(category)} {category}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {suggestionsArr.length} option
                                    {suggestionsArr.length > 1 ? "s" : ""}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  {suggestionsArr.map(
                                    (suggestion: Suggestion) => {
                                      const isSelected =
                                        editingState.selectedEdits.some(
                                          (edit) =>
                                            edit.suggestionId === suggestion.id
                                        );
                                      return (
                                        <div
                                          key={suggestion.id}
                                          className={`group flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                                            isSelected
                                              ? "bg-primary/10 border-primary"
                                              : "bg-background border-border hover:bg-primary/5"
                                          }`}
                                          tabIndex={0}
                                          role="button"
                                          onClick={() =>
                                            toggleSuggestion(suggestion.id)
                                          }
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "Enter" ||
                                              e.key === " "
                                            ) {
                                              e.preventDefault();
                                              toggleSuggestion(suggestion.id);
                                            }
                                          }}
                                        >
                                          <Checkbox
                                            id={suggestion.id}
                                            checked={isSelected}
                                            onCheckedChange={(val) =>
                                              typeof val === "boolean" &&
                                              toggleSuggestion(suggestion.id)
                                            }
                                            className="mt-1 flex-shrink-0"
                                          />
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                              <span className="font-semibold text-sm truncate">
                                                {suggestion.label}
                                              </span>
                                              {isSelected && (
                                                <CheckCircle className="h-4 w-4 text-green-500 animate-in fade-in flex-shrink-0" />
                                              )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                              {suggestion.description}
                                            </p>
                                          </div>
                                         
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )
                          );
                        })()}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Right Column (60%) */}
              <div className="w-full xl:w-[60%] space-y-6 min-w-0">
                <ImageUpload
                  onImageUpload={handleUploadComplete}
                  uploadedImage={uploadedImage}
                  onClearImage={clearImage}
                  handleAnalyzeImage={handleAnalyzeImage}
                  editionState={editingState}
                  toggleSuggestion={toggleSuggestion}
                />

                {editingState.analysis && (
                  <AISuggestions analysis={editingState.analysis} />
                )}

                {uploadedImage && editingState.editedImage && (
                  <BeforeAfterPreview
                    originalImage={uploadedImage}
                    editedImage={editingState.editedImage}
                    appliedPrompt={buildPrompt()}
                    onStartNewEdit={startNewEdit}
                    onDownload={downloadEditedImage}
                  />
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Settings Panel */}
        <SettingsPanel
          open={settingsPanelOpen}
          onOpenChange={setSettingsPanelOpen}
          config={geminiConfig}
          onConfigChange={updateConfig}
          onResetConfig={resetConfig}
        />
      </div>

      {/* API Key Modal */}
      <ApiKeyModal open={apiKeyModalOpen} onOpenChange={setApiKeyModalOpen} />
    </div>
  );
}
