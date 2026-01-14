import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, X, ChevronRight, Cookie, Milk, Wine, Flame, TrendingUp, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface ProductResult {
  barcode: string;
  name: string;
  brand: string | null;
  front_image_url: string | null;
  health_score: number | null;
  negative_points: string[] | null;
}

interface TrendingProduct {
  barcode: string;
  name: string;
  front_image_url: string | null;
  scan_count: number;
}

const QUICK_CRAVINGS = [
  { id: "snacks", label: "Snacks", icon: Cookie, color: "amber", gradient: "from-amber-500/20 to-amber-600/10" },
  { id: "dairy", label: "Dairy", icon: Milk, color: "blue", gradient: "from-blue-500/20 to-blue-600/10" },
  { id: "drinks", label: "Drinks", icon: Wine, color: "purple", gradient: "from-purple-500/20 to-purple-600/10" },
  { id: "instant", label: "Instant", icon: Flame, color: "red", gradient: "from-red-500/20 to-red-600/10" },
];

const FEATURED_PRODUCT = {
  barcode: "featured-wickedgud",
  name: "WickedGud Cookies",
  brand: "WickedGud",
  front_image_url: "https://m.media-amazon.com/images/I/71QxqV2HGXL._SL1500_.jpg",
  health_score: 78,
  isFeatured: true,
};

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [trending, setTrending] = useState<TrendingProduct[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const navigate = useNavigate();

  // Fetch trending products on mount
  useEffect(() => {
    const fetchTrending = async () => {
      const { data } = await supabase
        .from("products")
        .select("barcode, name, front_image_url")
        .limit(3);
      
      if (data) {
        setTrending(data.map((p, i) => ({
          ...p,
          scan_count: Math.floor(Math.random() * 2000) + 500, // Simulated scan count
        })));
      }
    };
    fetchTrending();
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length >= 2) {
        const { data, error } = await supabase
          .from("products")
          .select("barcode, name, brand, front_image_url, health_score, negative_points")
          .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
          .limit(6);

        if (!error && data) {
          setResults(data);
        }
      } else {
        setResults([]);
      }
    };
    
    const debounce = setTimeout(searchProducts, 200);
    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    if (containerRef.current && isOpen) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (product: ProductResult | typeof FEATURED_PRODUCT) => {
    setQuery("");
    setIsOpen(false);
    if ('isFeatured' in product) {
      navigate(`/category/biscuits`);
    } else {
      navigate(`/product/${product.barcode}`);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setQuery("");
    setIsOpen(false);
    navigate(`/category/${categoryId}`);
  };

  const getScoreColor = (score: number | null) => {
    if (!score || score < 40) return "bg-rose-500";
    if (score < 70) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getSavageSubtitle = (product: ProductResult) => {
    if (!product.health_score || product.health_score >= 40) return null;
    if (product.negative_points && product.negative_points.length > 0) {
      return `⚠️ ${product.negative_points[0]}`;
    }
    return "⚠️ High Sugar";
  };

  const shouldShowFeatured = query.toLowerCase().includes("biscuit") || 
                              query.toLowerCase().includes("cookie");

  const showZeroState = isOpen && query.length < 2;
  const showResults = isOpen && query.length >= 2;

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input - CRED Style */}
      <div className="flex items-center gap-3 bg-card/90 backdrop-blur-sm rounded-2xl px-5 py-3.5 shadow-xl border border-border/30">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search Maggi, Lays, Nutella..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
        />
        {query && (
          <button 
            onClick={() => {
              setQuery("");
              setResults([]);
            }} 
            className="p-1.5 rounded-full hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Premium Portal Dropdown */}
      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed rounded-2xl overflow-hidden"
            style={{
              zIndex: 99999,
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
            }}
          >
            <div className="bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-[70vh] overflow-y-auto">
              
              {/* Zero State - Visual Discovery */}
              {showZeroState && (
                <div className="p-4 space-y-6">
                  {/* Quick Craving Grid */}
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
                      Quick Craving
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {QUICK_CRAVINGS.map((craving) => {
                        const Icon = craving.icon;
                        return (
                          <motion.button
                            key={craving.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCategoryClick(craving.id)}
                            className={`relative overflow-hidden p-4 rounded-xl bg-gradient-to-br ${craving.gradient} border border-white/5 group`}
                          >
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 bg-${craving.color}-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                            
                            <div className="relative flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-${craving.color}-500/20`}>
                                <Icon className={`w-5 h-5 text-${craving.color}-400`} />
                              </div>
                              <span className="font-medium text-white">{craving.label}</span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Community Radar */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                        Trending Now 🚀
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {trending.map((product) => (
                        <button
                          key={product.barcode}
                          onClick={() => navigate(`/product/${product.barcode}`)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                            <img
                              src={product.front_image_url || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-medium text-white truncate">{product.name}</p>
                            <p className="text-xs text-emerald-400">{(product.scan_count / 1000).toFixed(1)}k Scans today</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-600" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Live Search Results */}
              {showResults && (
                <div className="p-2">
                  {/* Featured Result */}
                  {shouldShowFeatured && (
                    <motion.button
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handleSelect(FEATURED_PRODUCT)}
                      className="w-full flex items-center gap-4 p-4 mb-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-yellow-500/30 hover:border-yellow-500/50 transition-all"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-800 border border-yellow-500/20 flex-shrink-0">
                        <img
                          src={FEATURED_PRODUCT.front_image_url}
                          alt={FEATURED_PRODUCT.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Sparkles className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-yellow-400 font-medium">Featured Alternative</span>
                        </div>
                        <h3 className="font-semibold text-white truncate">{FEATURED_PRODUCT.name}</h3>
                        <p className="text-xs text-zinc-500">{FEATURED_PRODUCT.brand}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getScoreColor(FEATURED_PRODUCT.health_score)} shadow-lg shadow-emerald-500/50`} />
                        <ChevronRight className="w-4 h-4 text-zinc-600" />
                      </div>
                    </motion.button>
                  )}

                  {/* Regular Results */}
                  {results.length > 0 ? (
                    <div className="space-y-1">
                      {results.map((product, index) => {
                        const savageSubtitle = getSavageSubtitle(product);
                        return (
                          <motion.button
                            key={product.barcode}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSelect(product)}
                            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all"
                          >
                            {/* Product Thumbnail */}
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 border border-white/5 flex-shrink-0">
                              <img
                                src={product.front_image_url || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Product Info */}
                            <div className="flex-1 text-left min-w-0">
                              <h3 className="font-medium text-white truncate">{product.name}</h3>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-zinc-500">{product.brand || "Unknown"}</p>
                                {savageSubtitle && (
                                  <span className="text-xs text-zinc-600">{savageSubtitle}</span>
                                )}
                              </div>
                            </div>
                            
                            {/* Instant Score Dot */}
                            <div className="flex items-center gap-2">
                              <div 
                                className={`w-3 h-3 rounded-full ${getScoreColor(product.health_score)} ${
                                  product.health_score && product.health_score < 40 
                                    ? 'shadow-lg shadow-rose-500/50 animate-pulse' 
                                    : ''
                                }`} 
                              />
                              <ChevronRight className="w-4 h-4 text-zinc-600" />
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center space-y-4">
                      <p className="text-zinc-400">No products found for "{query}"</p>
                      <button
                        onClick={() => {
                          setQuery("");
                          setIsOpen(false);
                          navigate("/add-product");
                        }}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-300"
                      >
                        ✨ Request this Product
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};