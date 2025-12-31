import { Skull, CheckCircle } from "lucide-react";

interface VillainsSectionProps {
  ingredientsText: string | null;
  isLoading?: boolean;
}

// Villain keywords with witty roasts
const VILLAIN_ROASTS: Record<string, { emoji: string; roast: string }> = {
  "sugar": { emoji: "☠️", roast: "Sweet but toxic" },
  "palm oil": { emoji: "💔", roast: "Heart attack helper" },
  "maida": { emoji: "🤢", roast: "Glue for your gut" },
  "refined flour": { emoji: "🤢", roast: "Nutritionally dead" },
  "maltodextrin": { emoji: "📈", roast: "Blood sugar spike" },
  "high fructose": { emoji: "🍬", roast: "Liquid diabetes" },
  "high fructose corn syrup": { emoji: "🍬", roast: "Liquid diabetes" },
  "corn syrup": { emoji: "🍬", roast: "Sneaky sugar" },
  "hydrogenated": { emoji: "🧪", roast: "Frankenstein fat" },
  "artificial": { emoji: "🤖", roast: "Lab-made mystery" },
  "preservative": { emoji: "🧟", roast: "Zombie ingredient" },
  "sodium": { emoji: "🧂", roast: "Salt bomb alert" },
};

interface Villain {
  name: string;
  emoji: string;
  roast: string;
}

// Extract villains from ingredients text with roasts
const extractVillains = (ingredientsText: string): Villain[] => {
  const lowerText = ingredientsText.toLowerCase();
  const foundVillains: Villain[] = [];
  const addedKeywords = new Set<string>();

  Object.entries(VILLAIN_ROASTS).forEach(([keyword, { emoji, roast }]) => {
    if (lowerText.includes(keyword) && !addedKeywords.has(keyword)) {
      // Avoid duplicates (e.g., "high fructose" and "high fructose corn syrup")
      const isSubstring = Array.from(addedKeywords).some(
        (added) => added.includes(keyword) || keyword.includes(added)
      );
      
      if (!isSubstring) {
        const displayName = keyword
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        
        foundVillains.push({ name: displayName, emoji, roast });
        addedKeywords.add(keyword);
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
        <div className="space-y-2">
          {villains.map((villain, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-xl"
            >
              <span className="text-xl">{villain.emoji}</span>
              <div>
                <p className="font-bold text-destructive text-sm">{villain.name}</p>
                <p className="text-xs text-destructive/80">{villain.roast}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
