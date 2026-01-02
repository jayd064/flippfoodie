import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubsHeaderProps {
  activeTab: "discover" | "stash";
  onTabChange: (tab: "discover" | "stash") => void;
  activeTribe: string | null;
  onTribeChange: (tribe: string | null) => void;
}

const tribes = [
  { id: "vegan", label: "Vegan", emoji: "🌱" },
  { id: "gym", label: "Gym", emoji: "💪" },
  { id: "junk", label: "Junk", emoji: "🍟" },
  { id: "keto", label: "Keto", emoji: "🥑" },
  { id: "sugar-free", label: "Sugar Free", emoji: "🚫" },
  { id: "organic", label: "Organic", emoji: "🌿" },
];

const SubsHeader = ({ activeTab, onTabChange, activeTribe, onTribeChange }: SubsHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 pb-4">
      {/* Search Bar */}
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search brands like Amul, Nestle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-[#151515] border border-white/10 rounded-full text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
      </div>

      {/* Toggle Switch */}
      <div className="px-4 pb-3">
        <div className="flex bg-[#151515] rounded-full p-1 border border-white/5">
          <button
            onClick={() => onTabChange("discover")}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-300",
              activeTab === "discover"
                ? "bg-white/10 text-white shadow-lg"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Discover
          </button>
          <button
            onClick={() => onTabChange("stash")}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-300",
              activeTab === "stash"
                ? "bg-white/10 text-white shadow-lg"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            My Stash
          </button>
        </div>
      </div>

      {/* Tribes Rail */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4 pb-1">
          {tribes.map((tribe) => (
            <button
              key={tribe.id}
              onClick={() => onTribeChange(activeTribe === tribe.id ? null : tribe.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 min-w-[60px] transition-all duration-200",
                activeTribe === tribe.id ? "scale-105" : ""
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300",
                  activeTribe === tribe.id
                    ? "bg-emerald-500/20 ring-2 ring-emerald-500"
                    : "bg-[#1a1a1a] ring-1 ring-white/10 hover:ring-white/20"
                )}
              >
                {tribe.emoji}
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  activeTribe === tribe.id ? "text-emerald-400" : "text-zinc-500"
                )}
              >
                {tribe.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubsHeader;
