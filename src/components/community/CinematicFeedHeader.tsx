import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface CinematicFeedHeaderProps {
  activeTab: "feed" | "tribes";
  onTabChange: (tab: "feed" | "tribes") => void;
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories = [
  { id: null, label: "For You" },
  { id: "hot", label: "🔥 Hot" },
  { id: "reviews", label: "Reviews" },
  { id: "rants", label: "Rants" },
];

const CinematicFeedHeader = ({
  activeTab,
  onTabChange,
  activeCategory,
  onCategoryChange,
}: CinematicFeedHeaderProps) => {
  return (
    <div className="absolute top-0 inset-x-0 z-50 pt-4 pb-3 px-4 space-y-4 bg-gradient-to-b from-black/80 to-transparent">
      {/* Segmented Control */}
      <div className="flex justify-center">
        <div className="flex bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10">
          <button
            onClick={() => onTabChange("feed")}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-semibold transition-all",
              activeTab === "feed"
                ? "bg-white text-black shadow-lg"
                : "text-white/70 hover:text-white"
            )}
          >
            Discover
          </button>
          <button
            onClick={() => onTabChange("tribes")}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-semibold transition-all",
              activeTab === "tribes"
                ? "bg-white text-black shadow-lg"
                : "text-white/70 hover:text-white"
            )}
          >
            Tribes
          </button>
        </div>
      </div>

      {/* Category Pills - Only show for Feed tab */}
      {activeTab === "feed" && (
        <div className="flex justify-center gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id ?? "foryou"}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all backdrop-blur-sm",
                activeCategory === category.id
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-black/30 text-white/60 border border-white/10 hover:text-white/80"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CinematicFeedHeader;
