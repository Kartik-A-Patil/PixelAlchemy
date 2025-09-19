import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { GeminiConfig, PRESET_MODES } from "@/types/image-editor";
import { Settings, X, RotateCcw, Check } from "lucide-react";

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: GeminiConfig;
  onConfigChange: (config: Partial<GeminiConfig>) => void;
  onResetConfig: () => void;
}

export function SettingsPanel({
  open,
  onOpenChange,
  config,
  onConfigChange,
  onResetConfig,
}: SettingsPanelProps) {
  const [activePreset, setActivePreset] = React.useState<string | null>(
    "Stable"
  );

  const applyPreset = (presetName: string) => {
    const preset = PRESET_MODES.find((p) => p.name === presetName);
    if (preset) {
      onConfigChange(preset.config);
      setActivePreset(presetName);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed right-0 top-0 bottom-0 w-96 bg-card border-l border-border p-6 overflow-y-auto z-50 transform transition-transform duration-300"
      data-testid="settings-panel"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Gemini Settings
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            data-testid="button-close-panel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Quick Presets
          </h3>

          <div className="grid grid-cols-1 gap-2">
            {PRESET_MODES.map((preset) => (
              <Button
                key={preset.name}
                variant={activePreset === preset.name ? "default" : "outline"}
                className="p-3 h-auto text-left justify-start"
                onClick={() => applyPreset(preset.name)}
                data-testid={`button-preset-${preset.name
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {preset.description}
                    </div>
                  </div>
                  {activePreset === preset.name && (
                    <Check className="h-4 w-4" />
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Model Parameters */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Model Parameters
          </h3>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Temperature</Label>
              <span
                className="text-muted-foreground text-sm"
                data-testid="text-temperature"
              >
                {config.temperature}
              </span>
            </div>
            <Slider
              value={[config.temperature]}
              onValueChange={([value]) => {
                onConfigChange({ temperature: value });
                setActivePreset(null);
              }}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
              data-testid="slider-temperature"
            />
            <p className="text-xs text-muted-foreground">
              Controls creativity vs consistency
            </p>
          </div>

          {/* Top P */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Top P</Label>
              <span
                className="text-muted-foreground text-sm"
                data-testid="text-top-p"
              >
                {config.topP}
              </span>
            </div>
            <Slider
              value={[config.topP]}
              onValueChange={([value]) => {
                onConfigChange({ topP: value });
                setActivePreset(null);
              }}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
              data-testid="slider-top-p"
            />
            <p className="text-xs text-muted-foreground">
              Nucleus sampling parameter
            </p>
          </div>

          {/* Top K */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Top K</Label>
            <Input
              type="number"
              value={config.topK}
              onChange={(e) => {
                onConfigChange({ topK: parseInt(e.target.value) || 0 });
                setActivePreset(null);
              }}
              className="w-full"
              data-testid="input-top-k"
            />
            <p className="text-xs text-muted-foreground">
              Limits vocabulary size
            </p>
          </div>

          {/* Max Output Tokens */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Max Output Tokens</Label>
            <Input
              type="number"
              value={config.maxOutputTokens}
              onChange={(e) => {
                onConfigChange({
                  maxOutputTokens: parseInt(e.target.value) || 0,
                });
                setActivePreset(null);
              }}
              className="w-full"
              data-testid="input-max-tokens"
            />
            <p className="text-xs text-muted-foreground">
              Maximum response length
            </p>
          </div>

          {/* Safety Settings */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Safety Level</Label>
            <Select
              value={config.safetyLevel}
              onValueChange={(value: "default" | "strict" | "none") => {
                onConfigChange({ safetyLevel: value });
                setActivePreset(null);
              }}
            >
              <SelectTrigger
                className="bg-background border-border hover:bg-accent/10 focus:bg-accent/10 transition-colors"
                data-testid="select-safety-level"
              >
                <SelectValue placeholder="Select safety level" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border shadow-lg">
                <SelectItem
                  value="default"
                  className="hover:bg-accent focus:bg-accent cursor-pointer"
                >
                  Default
                </SelectItem>
                <SelectItem
                  value="strict"
                  className="hover:bg-accent focus:bg-accent cursor-pointer"
                >
                  Strict
                </SelectItem>
                <SelectItem
                  value="none"
                  className="hover:bg-accent focus:bg-accent cursor-pointer"
                >
                  None
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Content filtering level
            </p>
          </div>

          {/* Model Version */}
          <div className="space-y-1">
            <div className="flex flex-col">
              <Label className="text-sm font-medium leading-tight">
                Model Version{" "}
                <span className="block text-xs font-normal text-muted-foreground">
                  (Only for Analysis)
                </span>
              </Label>
              <span className="text-xs text-muted-foreground mt-0.5">
                Image Editing only uses{" "}
                <span className="font-semibold">
                  gemini-2.5-flash-image-preview
                </span>
              </span>
            </div>
            <div className="mt-1">
              <Select
                value={config.modelVersion}
                onValueChange={(
                  value: "gemini-2.5-flash" | "gemini-pro" | "gemini-pro-vision"
                ) => {
                  onConfigChange({ modelVersion: value });
                  setActivePreset(null);
                }}
              >
                <SelectTrigger
                  className="bg-background border-border hover:bg-accent/10 focus:bg-accent/10 transition-colors"
                  data-testid="select-model-version"
                >
                  <SelectValue placeholder="Select model version" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border shadow-lg">
                  <SelectItem
                    value="gemini-2.5-flash-lite"
                    className="hover:bg-accent focus:bg-accent cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span>Gemini 2.5 Flash Lite</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="gemini-2.5-flash"
                    className="hover:bg-accent focus:bg-accent cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span>Gemini 2.5 Flash</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="gemini-pro"
                    className="hover:bg-accent focus:bg-accent cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span>Gemini Pro</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="gemini-pro-vision"
                    className="hover:bg-accent focus:bg-accent cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span>Gemini Pro Vision</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => {
            onResetConfig();
            setActivePreset("Stable");
          }}
          data-testid="button-reset-settings"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
