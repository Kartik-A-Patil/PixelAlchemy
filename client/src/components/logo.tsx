import React from "react";
import { Wand2 } from "lucide-react";
import { Badge } from "./ui/badge";

const Logo = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
        <Wand2 className="h-6 w-6 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-app-title">
          Pixel Alchemy
        </h1>
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary text-xs"
        >
          Powered by Google's Nano Banana Modal
        </Badge>
      </div>
    </div>
  );
};

export default Logo;
