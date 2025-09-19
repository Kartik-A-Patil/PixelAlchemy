import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGemini } from "@/hooks/use-gemini";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Info,
  ExternalLink,
  Wand2,
  Key,
  CheckCircle,
  Shield,
} from "lucide-react";

export default function Setup() {
  const [, setLocation] = useLocation();
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { setApiKey: saveApiKey, currentApiKey, isConfigured } = useGemini();
  const { toast } = useToast();

  useEffect(() => {
    // If already configured, redirect to editor
    if (isConfigured) {
      setLocation("/editor");
    }

    // Load existing API key if available
    if (currentApiKey) {
      setApiKey(currentApiKey);
    }
  }, [isConfigured, currentApiKey, setLocation]);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      saveApiKey(apiKey.trim());

      // Small delay to show saving state
      setTimeout(() => {
        setLocation("/editor");
      }, 1000);
    } catch (error) {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    setLocation("/");
  };

  return (
    <div className="h-[95vh] bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 flex items-start justify-center relative mt-8">
        <Button
          variant='outline'
          onClick={handleBack}
          className="hover:bg-accent mr-5 mt-5"
          data-testid="button-back-left"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="w-full max-w-2xl">
          {/* Setup Card */}
          <Card className="border-2">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Configure Your API Key</CardTitle>
              <p className="text-muted-foreground mt-2">
                Connect your Google Gemini API to start editing images with AI
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* API Key Input */}
              <div className="space-y-2">
                <Label htmlFor="api-key" className="text-base font-medium">
                  Gemini API Key
                </Label>
                <div className="relative">
                  <Input
                    id="api-key"
                    type={showApiKey ? "text" : "password"}
                    placeholder="Enter your Gemini API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="h-12 text-base pr-12"
                    data-testid="input-api-key"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSave();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowApiKey(!showApiKey)}
                    data-testid="button-toggle-visibility"
                  >
                    {showApiKey ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-200 dark:border-green-500/20">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-green-800 dark:text-green-200 mb-1">
                      Your data is secure
                    </p>
                    <p className="text-green-700 dark:text-green-300">
                      Your API key is stored locally in your browser and never
                      sent to our servers. We only use it to make requests
                      directly to Google's Gemini API on your behalf.
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-2">How to get your API key:</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Visit Google AI Studio</li>
                      <li>Sign in with your Google account</li>
                      <li>Click "Get API Key" and create a new key</li>
                      <li>Copy and paste it here</li>
                    </ol>
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline mt-3 font-medium"
                      data-testid="link-api-key-source"
                    >
                      Open Google AI Studio
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button
                className="w-full h-12 text-base"
                onClick={handleSave}
                disabled={!apiKey.trim() || isSaving}
                data-testid="button-save-and-continue"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Save & Continue to Editor
                  </>
                )}
              </Button>

              {/* Skip Option */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Don't have an API key yet?
                </p>
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="text-sm"
                  data-testid="button-skip-setup"
                >
                  I'll set it up later
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Need help? The API key is free to get and allows you to make
              requests to Google's AI models.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
