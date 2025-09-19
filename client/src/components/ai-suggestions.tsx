import React from "react";
import { AIAnalysis, SelectedEdit } from "@/types/image-editor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";
import { Lightbulb } from "lucide-react";

interface AISuggestionsProps {
  analysis: AIAnalysis;
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({
  analysis,
}) => {
  return (
    <div className="space-y-6">
      {/* Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Analysis
          </CardTitle>
          <CardDescription>Here's what I found in your image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">
              {analysis.description}
            </p>
          </div>

          {analysis.objects.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Objects Detected</h4>
              <div className="flex flex-wrap gap-1">
                {analysis.objects.map((object, index) => (
                  <Badge key={index} variant='outline' className="text-xs">
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
    </div>
  );
};
