import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandSubsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories = [
  { id: null, label: "All" },
  { id: "snacks", label: "Snacks" },
  { id: "dairy", label: "Dairy" },
  { id: "beverages", label: "Beverages" },
];

const BrandSubsHeader = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}: BrandSubsHeaderProps) => {
  return (
    <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md pt-4 pb-3 px-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Find a Brand Tribe..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-12 pl-12 pr-4 bg-[#151515] border border-white/10 rounded-full text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id ?? "all"}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border",
              activeCategory === category.id
                ? "bg-white text-black border-white"
                : "bg-[#151515] text-zinc-400 border-white/10 hover:border-white/20"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrandSubsHeader;
