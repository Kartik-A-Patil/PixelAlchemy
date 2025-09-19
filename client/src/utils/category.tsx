import React from "react";
import { Lightbulb, Image, Palette, Wrench } from "lucide-react";


const getCategoryIcon = (category: string) => {
  switch (category) {
    case "enhancement":
      return <Palette className="h-4 w-4" />;
    case "removal":
      return <Image className="h-4 w-4" />;
    case "style":
      return <Lightbulb className="h-4 w-4" />;
    case "fix":
      return <Wrench className="h-4 w-4" />;
    default:
      return <Lightbulb className="h-4 w-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "enhancement":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "removal":
      return "bg-red-100 text-red-800 border-red-200";
    case "style":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "fix":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export { getCategoryIcon, getCategoryColor };
