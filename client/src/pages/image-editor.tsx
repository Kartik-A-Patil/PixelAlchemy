import React, { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ImagePreview } from "@/components/image-preview";
import { SettingsPanel } from "@/components/settings-panel";
import { ApiKeyModal } from "@/components/api-key-modal";
import { AISuggestions } from "@/components/ai-suggestions";
import { BeforeAfterPreview } from "@/components/before-after-preview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useImageEditor } from "@/hooks/use-image-editor";
import { useGemini } from "@/hooks/use-gemini";
import { PROMPT_SUGGESTIONS } from "@/types/image-editor";
import { Wand2, Key, Settings, Zap, Eye, CheckCircle } from "lucide-react";
import Logo from "@/components/logo";

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

  const handleQuickAction = async (actionPrompt: string) => {
    if (!uploadedImage) return;

    if (!isConfigured) {
      setApiKeyModalOpen(true);
      return;
    }

    const result = await processImageEdit(
      uploadedImage.file,
      actionPrompt,
      geminiConfig
    );

    if (result) {
      setEditedImageResult(result);
      addToHistory(actionPrompt, result);
    }
  };

  // Minimal, single-page flow: always show upload, analysis, and suggestions inline

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Logo/>

          <div className="flex items-center space-x-3">
            {/* Workflow Indicator */}
            {editingState.phase !== "upload" && uploadedImage && (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Upload</span>
                </div>
                <span>→</span>
                <div className="flex items-center space-x-1">
                  <CheckCircle
                    className={`h-3 w-3 ${
                      ["suggestions", "editing", "result"].includes(
                        editingState.phase
                      )
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span>Analysis</span>
                </div>
                <span>→</span>
                <div className="flex items-center space-x-1">
                  <Zap
                    className={`h-3 w-3 ${
                      editingState.phase === "editing"
                        ? "text-yellow-500"
                        : editingState.phase === "result"
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span>Edit</span>
                </div>
              </div>
            )}

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
          className={`flex-1 p-4 lg:p-6 transition-all duration-300 ${
            settingsPanelOpen ? "mr-80" : "mr-0"
          }`}
        >
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Error Display */}
            {editingState.error && (
              <div className="rounded bg-destructive/10 text-destructive px-4 py-2 text-sm">
                Error: {editingState.error}
              </div>
            )}

            {/* Minimal Upload & Analysis Flow */}
            <div className="space-y-4">
              <ImageUpload
                onImageUpload={handleUploadComplete}
                uploadedImage={uploadedImage}
                onClearImage={clearImage}
              />

              {/* Show Analyze button if image uploaded and no analysis yet */}
              {uploadedImage && !editingState.analysis && (
                <Button
                  onClick={handleAnalyzeImage}
                  disabled={editingState.isLoading}
                  className="w-full"
                  size="lg"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {editingState.isLoading
                    ? "Analyzing..."
                    : "Start AI Analysis"}
                </Button>
              )}

              {/* Show spinner while analyzing */}
              {editingState.phase === "analyzing" && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  <span className="ml-4 text-muted-foreground">
                    Analyzing image...
                  </span>
                </div>
              )}

              {/* Show AI Suggestions inline after analysis */}
              {editingState.analysis && (
                <div className="mt-2">
                  <AISuggestions
                    analysis={editingState.analysis}
                    selectedEdits={editingState.selectedEdits}
                    customPrompt={editingState.customPrompt}
                    onToggleSuggestion={toggleSuggestion}
                    onCustomPromptChange={setCustomPrompt}
                    onGenerateEdit={handleGenerateEditedImage}
                    isLoading={editingState.isLoading}
                  />
                </div>
              )}
            </div>

            {/* Minimal Natural Language Editor - always visible if image uploaded */}
            {uploadedImage && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Describe how you want to edit your image... (e.g., 'Remove the background and make it look like a professional headshot')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-20 pr-20 resize-none"
                  data-testid="textarea-prompt"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleProcessPrompt();
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-1">
                  {PROMPT_SUGGESTIONS.map((suggestion, index) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => setPrompt(suggestion)}
                      className="text-xs"
                      data-testid={`button-suggestion-${index}`}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={handleProcessPrompt}
                    disabled={!uploadedImage || !prompt.trim() || isProcessing}
                    className="shadow"
                    data-testid="button-generate"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    {isProcessing ? "Processing..." : "Generate"}
                  </Button>
                </div>
              </div>
            )}

            {/* Minimal Image Preview - always visible if image uploaded */}
            {uploadedImage && (
              <ImagePreview
                uploadedImage={uploadedImage}
                editedResult={editedImageResult}
                isProcessing={isProcessing}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={undo}
                onRedo={redo}
                onDownload={downloadEditedImage}
              />
            )}

            {/* Show before/after preview if edit is complete */}
            {editingState.phase === "result" &&
              uploadedImage &&
              editingState.editedImage && (
                <BeforeAfterPreview
                  originalImage={uploadedImage}
                  editedImage={editingState.editedImage}
                  appliedPrompt={buildPrompt()}
                  onStartNewEdit={startNewEdit}
                  onDownload={downloadEditedImage}
                />
              )}
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
