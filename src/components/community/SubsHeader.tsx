import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubsHeaderProps {
  activeTab: "discover" | "stash";
  onTabChange: (tab: "discover" | "stash") => void;
  activeTribe: string | null;
  onTribeChange: (tribe: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const tribes = [
  { id: "vegan", label: "Vegan", emoji: "🥬" },
  { id: "gym", label: "Gym", emoji: "💪" },
  { id: "junk", label: "Junk", emoji: "🍟" },
  { id: "keto", label: "Keto", emoji: "🥑" },
  { id: "desi", label: "Desi", emoji: "🇮🇳" },
  { id: "baby", label: "Baby", emoji: "👶" },
];

const SubsHeader = ({
  activeTab,
  onTabChange,
  activeTribe,
  onTribeChange,
  searchQuery,
  onSearchChange,
}: SubsHeaderProps) => {
  return (
    <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md pt-4 pb-3 px-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search brands like Amul, Nestle..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-12 pl-12 pr-4 bg-[#151515] border border-white/10 rounded-full text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
        />
      </div>

      {/* Toggle Switch */}
      <div className="flex bg-[#151515] rounded-full p-1 border border-white/10">
        <button
          onClick={() => onTabChange("discover")}
          className={cn(
            "flex-1 py-2.5 rounded-full text-sm font-medium transition-all",
            activeTab === "discover"
              ? "bg-white text-black"
              : "text-zinc-400 hover:text-white"
          )}
        >
          Discover
        </button>
        <button
          onClick={() => onTabChange("stash")}
          className={cn(
            "flex-1 py-2.5 rounded-full text-sm font-medium transition-all",
            activeTab === "stash"
              ? "bg-white text-black"
              : "text-zinc-400 hover:text-white"
          )}
        >
          My Stash
        </button>
      </div>

      {/* Tribes Rail */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        <button
          onClick={() => onTribeChange(null)}
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border",
            activeTribe === null
              ? "bg-white text-black border-white"
              : "bg-[#151515] text-zinc-400 border-white/10 hover:border-white/20"
          )}
        >
          All
        </button>
        {tribes.map((tribe) => (
          <button
            key={tribe.id}
            onClick={() => onTribeChange(tribe.id === activeTribe ? null : tribe.id)}
            className={cn(
              "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border",
              activeTribe === tribe.id
                ? "bg-white text-black border-white"
                : "bg-[#151515] text-zinc-400 border-white/10 hover:border-white/20"
            )}
          >
            <span>{tribe.emoji}</span>
            <span>{tribe.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubsHeader;
