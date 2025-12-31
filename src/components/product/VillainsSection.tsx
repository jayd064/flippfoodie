import { Skull, CheckCircle } from "lucide-react";

interface VillainsSectionProps {
  ingredientsText: string | null;
  isLoading?: boolean;
}

// Keywords to detect as "villains"
const VILLAIN_KEYWORDS = [
  "sugar",
  "palm oil",
  "maida",
  "refined flour",
  "maltodextrin",
  "high fructose",
  "high fructose corn syrup",
  "corn syrup",
  "hydrogenated",
  "artificial",
  "preservative",
  "sodium",
];

// Extract villains from ingredients text
const extractVillains = (ingredientsText: string): string[] => {
  const lowerText = ingredientsText.toLowerCase();
  const foundVillains: string[] = [];

  VILLAIN_KEYWORDS.forEach((keyword) => {
    if (lowerText.includes(keyword)) {
      // Capitalize first letter of each word for display
      const displayName = keyword
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      
      // Avoid duplicates (e.g., "high fructose" and "high fructose corn syrup")
      if (!foundVillains.some((v) => v.toLowerCase().includes(keyword) || keyword.includes(v.toLowerCase()))) {
        foundVillains.push(displayName);
      }
    }
  });

  return foundVillains;
};

export const VillainsSection = ({ ingredientsText, isLoading = false }: VillainsSectionProps) => {
  const villains = ingredientsText ? extractVillains(ingredientsText) : [];
  const isClean = villains.length === 0 && ingredientsText;

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-soft animate-fade-up">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-full bg-destructive/10">
            <Skull className="w-4 h-4 text-destructive" />
          </div>
          <h3 className="font-bold text-foreground">💀 The Villains</h3>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Detecting villains...</span>
        </div>
      </div>
    );
  }

  if (!ingredientsText) {
    return (
      <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-soft animate-fade-up">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-full bg-muted">
            <Skull className="w-4 h-4 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-foreground">💀 The Villains</h3>
        </div>
        <p className="text-muted-foreground text-sm">No ingredient data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-soft animate-fade-up">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-full ${isClean ? 'bg-success/10' : 'bg-destructive/10'}`}>
          {isClean ? (
            <CheckCircle className="w-4 h-4 text-success" />
          ) : (
            <Skull className="w-4 h-4 text-destructive" />
          )}
        </div>
        <h3 className="font-bold text-foreground">
          {isClean ? "✅ Clean Label" : "💀 The Villains"}
        </h3>
      </div>

      {isClean ? (
        <p className="text-success text-sm font-medium">
          No harmful ingredients detected! This looks clean.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {villains.map((villain, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-destructive/10 text-destructive border border-destructive/30 rounded-full text-sm font-semibold"
            >
              🚨 {villain}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
