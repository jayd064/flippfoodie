import { Flame, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendingTribe {
  id: string;
  name: string;
  logo: string;
  onlineCount: number;
  isHot?: boolean;
}

interface TrendingTribesProps {
  onTribeClick: (tribeId: string) => void;
}

const trendingTribes: TrendingTribe[] = [
  {
    id: "maggi-lovers",
    name: "Maggi Lovers",
    logo: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=200&h=200&fit=crop",
    onlineCount: 1247,
    isHot: true,
  },
  {
    id: "amul-gold",
    name: "Amul Gold",
    logo: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop",
    onlineCount: 892,
    isHot: true,
  },
  {
    id: "gym-rats",
    name: "Gym Rats",
    logo: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop",
    onlineCount: 2103,
    isHot: true,
  },
  {
    id: "sugar-busters",
    name: "Sugar Busters",
    logo: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=200&h=200&fit=crop",
    onlineCount: 456,
  },
  {
    id: "desi-snacks",
    name: "Desi Snacks",
    logo: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&h=200&fit=crop",
    onlineCount: 678,
  },
];

const TrendingTribes = ({ onTribeClick }: TrendingTribesProps) => {
  return (
    <div className="py-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-5 mb-3">
        <Flame className="w-5 h-5 text-orange-500" />
        <h2 className="text-base font-semibold text-white">Hot Communities</h2>
      </div>

      {/* Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide snap-x snap-mandatory">
        {trendingTribes.map((tribe) => (
          <button
            key={tribe.id}
            onClick={() => onTribeClick(tribe.id)}
            className={cn(
              "flex-shrink-0 w-[140px] h-[100px] rounded-2xl p-3",
              "bg-white/5 backdrop-blur-xl border border-white/10",
              "flex flex-col items-center justify-center gap-2",
              "transition-all duration-300 hover:bg-white/10 hover:border-white/20",
              "snap-start"
            )}
          >
            {/* Logo with Hot Badge */}
            <div className="relative">
              <img
                src={tribe.logo}
                alt={tribe.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
              />
              {tribe.isHot && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <Flame className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>

            {/* Name */}
            <p className="text-xs font-medium text-white truncate w-full text-center">
              {tribe.name}
            </p>

            {/* Online Count */}
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500">
                {tribe.onlineCount >= 1000
                  ? `${(tribe.onlineCount / 1000).toFixed(1)}k`
                  : tribe.onlineCount}{" "}
                Online
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingTribes;
