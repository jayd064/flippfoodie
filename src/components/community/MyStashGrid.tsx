import { cn } from "@/lib/utils";

interface Brand {
  id: string;
  name: string;
  logo: string;
  followerCount: number;
  isFollowing: boolean;
}

interface MyStashGridProps {
  brands: Brand[];
  onToggleFollow: (id: string) => void;
}

const mockBrands: Brand[] = [
  {
    id: "1",
    name: "Amul",
    logo: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop",
    followerCount: 12400,
    isFollowing: true,
  },
  {
    id: "2",
    name: "Nestle",
    logo: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=200&fit=crop",
    followerCount: 8900,
    isFollowing: true,
  },
  {
    id: "3",
    name: "Parle",
    logo: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop",
    followerCount: 6700,
    isFollowing: true,
  },
  {
    id: "4",
    name: "Britannia",
    logo: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&h=200&fit=crop",
    followerCount: 5400,
    isFollowing: true,
  },
  {
    id: "5",
    name: "Haldiram's",
    logo: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&h=200&fit=crop",
    followerCount: 4200,
    isFollowing: true,
  },
  {
    id: "6",
    name: "MTR",
    logo: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&h=200&fit=crop",
    followerCount: 3100,
    isFollowing: true,
  },
];

const MyStashGrid = ({ brands = mockBrands, onToggleFollow }: MyStashGridProps) => {
  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Your Followed Brands</h2>
        <span className="text-sm text-zinc-500">{brands.length} brands</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex flex-col items-center gap-3 p-4 bg-[#151515] rounded-2xl border border-white/5 hover:border-white/10 transition-all"
          >
            <div className="relative">
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10"
              />
              {brand.isFollowing && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
              )}
            </div>

            <div className="text-center">
              <h3 className="text-sm font-semibold text-white truncate max-w-full">
                {brand.name}
              </h3>
              <p className="text-xs text-zinc-500">
                {(brand.followerCount / 1000).toFixed(1)}k followers
              </p>
            </div>

            <button
              onClick={() => onToggleFollow(brand.id)}
              className={cn(
                "w-full py-1.5 rounded-full text-xs font-medium transition-all",
                brand.isFollowing
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-emerald-500 text-black hover:bg-emerald-400"
              )}
            >
              {brand.isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>

      {/* Discover More */}
      <div className="mt-8 p-4 bg-[#151515] rounded-2xl border border-white/5 text-center">
        <p className="text-zinc-400 text-sm mb-3">
          Discover more brands to follow
        </p>
        <button className="px-6 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium hover:bg-emerald-500/30 transition-colors">
          Explore Brands
        </button>
      </div>
    </div>
  );
};

export default MyStashGrid;
