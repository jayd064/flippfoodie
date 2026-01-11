import { CheckCircle, Users, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Brand {
  id: string;
  name: string;
  logo: string;
  memberCount: number;
  newPosts: number;
  isVerified?: boolean;
  category: string;
}

interface BrandDirectoryProps {
  searchQuery: string;
  activeCategory: string | null;
  onJoin: (brandId: string) => void;
  joinedBrands: string[];
}

const brands: Brand[] = [
  {
    id: "amul",
    name: "Amul",
    logo: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop",
    memberCount: 15200,
    newPosts: 234,
    isVerified: true,
    category: "dairy",
  },
  {
    id: "nestle",
    name: "Nestlé",
    logo: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=200&fit=crop",
    memberCount: 12800,
    newPosts: 189,
    isVerified: true,
    category: "snacks",
  },
  {
    id: "parle",
    name: "Parle",
    logo: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop",
    memberCount: 8900,
    newPosts: 145,
    isVerified: false,
    category: "snacks",
  },
  {
    id: "britannia",
    name: "Britannia",
    logo: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&h=200&fit=crop",
    memberCount: 7600,
    newPosts: 98,
    isVerified: true,
    category: "snacks",
  },
  {
    id: "haldirams",
    name: "Haldiram's",
    logo: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&h=200&fit=crop",
    memberCount: 6400,
    newPosts: 76,
    isVerified: false,
    category: "snacks",
  },
  {
    id: "mother-dairy",
    name: "Mother Dairy",
    logo: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop",
    memberCount: 5200,
    newPosts: 54,
    isVerified: true,
    category: "dairy",
  },
  {
    id: "coca-cola",
    name: "Coca-Cola",
    logo: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200&h=200&fit=crop",
    memberCount: 9800,
    newPosts: 167,
    isVerified: true,
    category: "beverages",
  },
  {
    id: "pepsi",
    name: "Pepsi",
    logo: "https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=200&h=200&fit=crop",
    memberCount: 8700,
    newPosts: 143,
    isVerified: true,
    category: "beverages",
  },
  {
    id: "lays",
    name: "Lay's",
    logo: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop",
    memberCount: 11200,
    newPosts: 210,
    isVerified: false,
    category: "snacks",
  },
  {
    id: "dabur",
    name: "Dabur",
    logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
    memberCount: 4300,
    newPosts: 32,
    isVerified: true,
    category: "beverages",
  },
];

const formatCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

const BrandDirectory = ({
  searchQuery,
  activeCategory,
  onJoin,
  joinedBrands,
}: BrandDirectoryProps) => {
  const filteredBrands = brands.filter((brand) => {
    const matchesSearch =
      !searchQuery ||
      brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !activeCategory || brand.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="px-4 py-4">
      <h2 className="text-base font-semibold text-white mb-4">Brand Directory</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {filteredBrands.map((brand) => {
          const isJoined = joinedBrands.includes(brand.id);
          
          return (
            <div
              key={brand.id}
              className={cn(
                "rounded-2xl p-4",
                "bg-white/5 border border-white/10",
                "flex flex-col items-center gap-3",
                "transition-all duration-300 hover:bg-white/10"
              )}
            >
              {/* Logo with Verified Badge */}
              <div className="relative">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10"
                />
                {brand.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
                    <CheckCircle className="w-3 h-3 text-black" />
                  </div>
                )}
              </div>

              {/* Brand Name */}
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-white">{brand.name}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{formatCount(brand.memberCount)}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{brand.newPosts} New</span>
                </div>
              </div>

              {/* Join Button */}
              <button
                onClick={() => onJoin(brand.id)}
                className={cn(
                  "w-full py-2 rounded-full text-xs font-medium transition-all",
                  isJoined
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                    : "bg-transparent text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/10"
                )}
              >
                {isJoined ? "Joined" : "Join"}
              </button>
            </div>
          );
        })}
      </div>

      {filteredBrands.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500">No brands found</p>
        </div>
      )}
    </div>
  );
};

export default BrandDirectory;
