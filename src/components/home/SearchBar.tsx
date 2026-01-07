import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, X, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProductResult {
  barcode: string;
  name: string;
  brand: string | null;
  front_image_url: string | null;
  health_score: number | null;
}

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length >= 2) {
        const { data, error } = await supabase
          .from("products")
          .select("barcode, name, brand, front_image_url, health_score")
          .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
          .limit(6);

        if (!error && data) {
          setResults(data);
          setIsOpen(true);
        }
      } else {
        setResults([]);
        setIsOpen(false);
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

  const handleSelect = (product: ProductResult) => {
    setQuery("");
    setIsOpen(false);
    navigate(`/product/${product.barcode}`);
  };

  const getScoreColor = (score: number | null) => {
    if (!score || score < 40) return "text-red-400 bg-red-500/20";
    if (score < 70) return "text-amber-400 bg-amber-500/20";
    return "text-emerald-400 bg-emerald-500/20";
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input - CRED Style */}
      <div className="flex items-center gap-3 bg-card/90 backdrop-blur-sm rounded-2xl px-5 py-3.5 shadow-xl border border-border/30">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Maggi, Lays, Nutella..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
        />
        {query && (
          <button 
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }} 
            className="p-1.5 rounded-full hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Premium Portal Dropdown - z-[99999] above everything */}
      {isOpen && createPortal(
        <div 
          className="fixed rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            zIndex: 99999,
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
          }}
        >
          {/* Premium Glass Background with Heavy Shadow */}
          <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {results.length > 0 ? (
              <div className="max-h-[60vh] overflow-y-auto">
                {results.map((product, index) => (
                  <button
                    key={product.barcode}
                    onClick={() => handleSelect(product)}
                    className={`w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-all duration-200 ${
                      index !== results.length - 1 ? "border-b border-white/5" : ""
                    }`}
                  >
                    {/* Product Image */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/5 flex-shrink-0">
                      <img
                        src={product.front_image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 text-left min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-zinc-500">{product.brand || "Unknown"}</p>
                    </div>
                    
                    {/* Score Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getScoreColor(
                          product.health_score
                        )}`}
                      >
                        {product.health_score || "?"}
                      </span>
                      <ChevronRight className="w-4 h-4 text-zinc-600" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-zinc-500">No products found</p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
