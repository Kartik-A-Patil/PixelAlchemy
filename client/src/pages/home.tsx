import { useEffect } from "react";
import { useLocation } from "wouter";
import { useGemini } from "@/hooks/use-gemini";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/logo";
import {
  Wand2,
  Key,
  ArrowRight,
  Sparkles,
  Image,
  Brush,
  Zap,
  Bot,
} from "lucide-react";
import { Cover } from "@/components/ui/cover";
import {TextGenerateEffect} from "@/components/ui/text-generate-effect";
import { BackgroundLines } from "@/components/ui/background-lines";
import { cn } from "@/lib/utils";
export default function Home() {
  const [, setLocation] = useLocation();
  const { isConfigured } = useGemini();

  useEffect(() => {
    // If API key is already configured, redirect to editor
    if (isConfigured) {
      setLocation("/editor");
    }
  }, [isConfigured, setLocation]);

  const handleGetStarted = () => {
    setLocation("/setup");
  };

  const handleGoToEditor = () => {
    setLocation("/editor");
  };

  return (
    <BackgroundLines className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 z-0">
      {/* Header */}
      
      <header className="px-4 sm:px-6 lg:px-8 py-6 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 z-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2 bg-primary/5 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-base font-medium text-primary">
                <span className="text-blue-500 dark:text-blue-500">
                  AI-Powered{" "}
                </span>
                Image Editing
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Transform Images with
              <br />
              <Cover>Natural Language</Cover>
            </h2>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Describe your vision and watch AI bring it to life. No complex
              tools needed—just tell us what you want to change.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isConfigured ? (
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="h-12 px-8 text-base z-50"
                  data-testid="button-get-started"
                >
                  <Key className="mr-2 h-5 w-5 " />
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleGoToEditor}
                  className="h-12 px-8 text-base"
                  data-testid="button-open-editor"
                >
                  <Wand2 className="mr-2 h-5 w-5" />
                  Open Editor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 z-50">
            <Card className="border-2 border-muted/50 hover:border-primary/20 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Image className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle className="text-lg">Smart Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm">
                  Advanced AI understands your images and provides intelligent
                  editing suggestions based on content and context.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-muted/50 hover:border-primary/20 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brush className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-lg">Natural Language</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm">
                  Simply describe what you want to change. No need to learn
                  complex editing tools or techniques.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-muted/50 hover:border-primary/20 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle className="text-lg">Instant Results</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm">
                  Get professional editing instructions and guidance in seconds,
                  powered by Google's latest nano banana modal AI technology.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gradient-to-r from-yellow-400/50 to-orange-500/50 hover:border-gradient-to-r hover:from-yellow-400 hover:to-orange-500 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-orange-500/5"></div>
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 relative">
                  <Bot className="h-6 w-6 text-yellow-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                </div>
                <CardTitle className="text-lg bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Nano Banana Modal
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <p className="text-muted-foreground text-sm">
                  Powered by Google's cutting-edge nano banana modal technology
                  for the most advanced image understanding and editing
                  capabilities.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Example Prompts */}
          <Card className="mb-12 shadow-xl border-0 bg-gradient-to-br from-primary/5 to-muted/30">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-extrabold bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
                Viral AI Editing Prompts
              </CardTitle>
              <p className="text-center text-muted-foreground mt-2 text-base">
                Unleash your creativity—click a prompt to copy!
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Turn this selfie into Pixar-style 3D art with dreamy lighting and big expressive eyes",
                  "Make me look like a cyberpunk hero: neon city background, glowing tattoos, and holographic glasses",
                  "Transform this photo into a vintage 90s magazine cover with bold fonts and retro color grading",
                  "Cartoonize my pet as a superhero with a cape, mask, and comic book effects",
                  "Give this landscape a magical Studio Ghibli vibe: lush colors, floating lights, and soft haze",
                  "Create a viral meme: add a dramatic zoom, top text 'Expectation', bottom text 'Reality'",
                  "Make it look like a Polaroid snapshot from the 80s: faded tones, instant film border, handwritten caption",
                  "Swap the background for a trending viral location (e.g., Barbie Dreamhouse, Oppenheimer explosion, or Met Gala red carpet)",
                  "Add a cinematic rain effect with neon reflections and moody atmosphere, Blade Runner style",
                ].map((prompt, index) => (
                  <button
                    key={prompt}
                    className="group relative p-4 dark:bg-muted/70 rounded-xl shadow-md border border-primary/10 hover:border-primary transition-all flex flex-col items-center justify-center cursor-pointer "
                    style={{ minHeight: "110px" }}
                    onClick={() => {
                      navigator.clipboard.writeText(prompt);
                    }}
                    data-testid={`example-prompt-${index}`}
                  >
                    <TextGenerateEffect words={prompt} />
                    <span className="absolute top-2 right-2 opacity-0 bg-white group-hover:opacity-100 transition-opacity text-black text-xs font-bold px-2 py-1 rounded">
                      Copy
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Message */}
          {!isConfigured && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                You'll need to provide your Google Gemini API key to get
                started.
                <br />
                Don't worry—it's stored securely in your browser and never sent
                to our servers.
              </p>
            </div>
          )}
        </div>
      </main>
    </BackgroundLines>
  );
}
