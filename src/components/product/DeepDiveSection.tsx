import { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Skull, 
  Droplets, 
  Dumbbell, 
  AlertTriangle,
  Clock,
  ArrowRight,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DeepDiveSectionProps {
  ingredientsText: string | null;
  healthScore: number | null;
  productName: string;
}

// Toxic keywords to scan for
const TOXIC_KEYWORDS = [
  { keyword: "palm oil", label: "Palm Oil", warning: "Heart attack helper 💔" },
  { keyword: "maltodextrin", label: "Maltodextrin", warning: "Spikes Insulin 📈" },
  { keyword: "high fructose corn syrup", label: "High Fructose Corn Syrup", warning: "Obesity fuel ⚠️" },
  { keyword: "hfcs", label: "HFCS", warning: "Hidden sugar bomb 💣" },
  { keyword: "sodium benzoate", label: "Sodium Benzoate", warning: "Preservative risk ☠️" },
  { keyword: "artificial", label: "Artificial Additives", warning: "Synthetic chemicals 🧪" },
  { keyword: "msg", label: "MSG", warning: "Flavor manipulator 🎭" },
  { keyword: "aspartame", label: "Aspartame", warning: "Artificial sweetener ⚡" },
];

// Mock version history data
const getMockVersionHistory = (productName: string) => [
  {
    version: "Current (2025)",
    ingredients: "Refined Wheat Flour (Maida), Palm Oil, Sugar, Salt, Preservatives",
    isCurrent: true,
  },
  {
    version: "Previous (2023)",
    ingredients: "Whole Wheat Flour, Butter, Brown Sugar, Sea Salt",
    isCurrent: false,
  },
];

const CHANGE_DETECTED = {
  message: "⚠️ They quietly swapped Butter for Palm Oil.",
  severity: "high",
};

// Sugar cube calculation (1 cube = 4g)
const calculateSugarCubes = (ingredientsText: string): number => {
  // Mock calculation based on keywords
  const sugarKeywords = ["sugar", "glucose", "fructose", "sucrose", "syrup"];
  const matches = sugarKeywords.filter(k => 
    ingredientsText.toLowerCase().includes(k)
  ).length;
  return Math.min(matches * 2 + 3, 12); // 3-12 cubes based on sugar mentions
};

// Check for palm oil
const hasPalmOil = (ingredientsText: string): boolean => {
  return ingredientsText.toLowerCase().includes("palm oil") ||
         ingredientsText.toLowerCase().includes("vegetable oil");
};

// Check for high protein
const hasHighProtein = (ingredientsText: string): boolean => {
  const proteinKeywords = ["protein", "whey", "casein", "soy", "pea"];
  return proteinKeywords.some(k => ingredientsText.toLowerCase().includes(k));
};

export const DeepDiveSection = ({ 
  ingredientsText, 
  healthScore,
  productName 
}: DeepDiveSectionProps) => {
  const isVillain = healthScore !== null && healthScore < 50;
  
  const analysisCards = useMemo(() => {
    if (!ingredientsText) return [];
    
    const cards = [];
    const sugarCubes = calculateSugarCubes(ingredientsText);
    const palmOilDetected = hasPalmOil(ingredientsText);
    const highProtein = hasHighProtein(ingredientsText);
    
    // Sugar Card
    cards.push({
      id: "sugar",
      title: "Sweet Tooth Alert",
      icon: "sugar",
      value: sugarCubes,
      unit: "cubes",
      color: sugarCubes > 6 ? "rose" : sugarCubes > 3 ? "amber" : "emerald",
      description: `~${sugarCubes * 4}g sugar detected`,
    });
    
    // Oil Card
    cards.push({
      id: "oil",
      title: palmOilDetected ? "Palm Oil Detected" : "Oil Check",
      icon: "oil",
      isPalmOil: palmOilDetected,
      color: palmOilDetected ? "rose" : "emerald",
      description: palmOilDetected ? "Heart-unfriendly fat" : "Clean oils used",
    });
    
    // Protein Card
    if (highProtein) {
      cards.push({
        id: "protein",
        title: "Protein Power",
        icon: "protein",
        color: "emerald",
        description: "Good protein source",
      });
    }
    
    return cards;
  }, [ingredientsText]);

  const toxicIngredients = useMemo(() => {
    if (!ingredientsText) return [];
    
    return TOXIC_KEYWORDS.filter(({ keyword }) => 
      ingredientsText.toLowerCase().includes(keyword)
    );
  }, [ingredientsText]);

  const versionHistory = useMemo(() => {
    return getMockVersionHistory(productName);
  }, [productName]);

  if (!ingredientsText) return null;

  return (
    <div className="space-y-6 mt-6">
      {/* Visual Analysis Section */}
      <div>
        <h3 className={cn(
          "text-sm font-semibold uppercase tracking-widest mb-4",
          isVillain ? "text-rose-400" : "text-emerald-400"
        )}>
          Visual Analysis 🔬
        </h3>
        
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-5 px-5 snap-x snap-mandatory">
          {analysisCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex-shrink-0 w-[160px] p-4 rounded-2xl border backdrop-blur-sm snap-start",
                isVillain 
                  ? "bg-white/5 border-white/10" 
                  : "bg-white/80 border-gray-200"
              )}
            >
              {/* Icon Area */}
              <div className="mb-3">
                {card.icon === "sugar" && (
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: Math.min(card.value || 0, 9) }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.1 + i * 0.05, type: "spring" }}
                        className={cn(
                          "w-5 h-5 rounded-sm",
                          card.color === "rose" 
                            ? "bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-500/30" 
                            : card.color === "amber"
                            ? "bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30"
                            : "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30"
                        )}
                        style={{ 
                          transform: `rotate(${Math.random() * 10 - 5}deg)`,
                        }}
                      />
                    ))}
                  </div>
                )}
                
                {card.icon === "oil" && (
                  <motion.div
                    animate={card.isPalmOil ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      card.isPalmOil 
                        ? "bg-rose-500/20" 
                        : "bg-emerald-500/20"
                    )}
                  >
                    <Droplets className={cn(
                      "w-7 h-7",
                      card.isPalmOil ? "text-rose-400" : "text-emerald-400"
                    )} />
                  </motion.div>
                )}
                
                {card.icon === "protein" && (
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Dumbbell className="w-7 h-7 text-emerald-400" />
                  </div>
                )}
              </div>
              
              <h4 className={cn(
                "font-semibold text-sm",
                isVillain ? "text-white" : "text-gray-900"
              )}>
                {card.title}
              </h4>
              <p className={cn(
                "text-xs mt-1",
                isVillain ? "text-zinc-400" : "text-gray-500"
              )}>
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Time Machine Section */}
      <div className={cn(
        "rounded-2xl p-5 border",
        isVillain 
          ? "bg-[#151515] border-white/10" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="flex items-center gap-2 mb-4">
          <Clock className={cn(
            "w-5 h-5",
            isVillain ? "text-amber-400" : "text-amber-600"
          )} />
          <h3 className={cn(
            "font-bold",
            isVillain ? "text-white" : "text-gray-900"
          )}>
            Formula History ⏳
          </h3>
        </div>
        
        {/* Timeline */}
        <div className="relative pl-6 space-y-4">
          {/* Timeline Line */}
          <div className={cn(
            "absolute left-2 top-2 bottom-2 w-px",
            isVillain ? "bg-white/20" : "bg-gray-300"
          )} />
          
          {versionHistory.map((version, index) => (
            <motion.div
              key={version.version}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className={cn(
                "absolute -left-4 top-1 w-3 h-3 rounded-full border-2",
                version.isCurrent
                  ? isVillain 
                    ? "bg-rose-500 border-rose-400" 
                    : "bg-amber-500 border-amber-400"
                  : isVillain
                    ? "bg-emerald-500 border-emerald-400"
                    : "bg-emerald-500 border-emerald-400"
              )} />
              
              <div className={cn(
                "p-3 rounded-xl",
                version.isCurrent
                  ? isVillain
                    ? "bg-rose-500/10 border border-rose-500/30"
                    : "bg-amber-500/10 border border-amber-500/30"
                  : isVillain
                    ? "bg-emerald-500/10 border border-emerald-500/30"
                    : "bg-emerald-50 border border-emerald-200"
              )}>
                <p className={cn(
                  "text-xs font-semibold uppercase tracking-wide mb-1",
                  version.isCurrent
                    ? isVillain ? "text-rose-400" : "text-amber-600"
                    : isVillain ? "text-emerald-400" : "text-emerald-600"
                )}>
                  {version.version}
                </p>
                <p className={cn(
                  "text-xs",
                  isVillain ? "text-zinc-300" : "text-gray-600"
                )}>
                  {version.ingredients}
                </p>
              </div>
              
              {/* Change Detected Badge (between versions) */}
              {index === 0 && versionHistory.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="my-3 flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4 text-rose-400" />
                  <div className="flex-1 px-3 py-2 bg-rose-500/20 border border-rose-500/40 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-rose-400" />
                      <p className="text-xs font-medium text-rose-300">
                        {CHANGE_DETECTED.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Red Flag Scanner / Toxic Report */}
      {toxicIngredients.length > 0 && (
        <div className={cn(
          "rounded-2xl p-5 border",
          isVillain 
            ? "bg-gradient-to-br from-rose-950/50 to-[#151515] border-rose-500/30" 
            : "bg-rose-50 border-rose-200"
        )}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h3 className={cn(
              "font-bold",
              isVillain ? "text-rose-400" : "text-rose-700"
            )}>
              Toxic Report ☣️
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {toxicIngredients.map((ingredient, index) => (
              <motion.div
                key={ingredient.keyword}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl border",
                  isVillain
                    ? "bg-rose-500/10 border-rose-500/40"
                    : "bg-rose-100 border-rose-300"
                )}
              >
                <Skull className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <div>
                  <p className={cn(
                    "text-sm font-semibold",
                    isVillain ? "text-rose-300" : "text-rose-700"
                  )}>
                    {ingredient.label}
                  </p>
                  <p className={cn(
                    "text-xs",
                    isVillain ? "text-rose-400/70" : "text-rose-600"
                  )}>
                    {ingredient.warning}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
