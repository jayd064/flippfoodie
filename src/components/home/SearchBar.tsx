import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchProducts, Product } from "@/data/GlobalStore";

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length >= 2) {
      const found = searchProducts(query);
      setResults(found.slice(0, 5));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (product: Product) => {
    setQuery("");
    setIsOpen(false);
    navigate(`/category/${product.category}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-score-good text-white";
    if (score >= 40) return "bg-score-okay text-white";
    return "bg-score-bad text-white";
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-3 bg-card rounded-full px-5 py-3.5 shadow-xl border border-border/30">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Maggi, Lays, Nutella..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
        />
        {query && (
          <button onClick={() => setQuery("")} className="p-1">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl border border-border/30 shadow-xl overflow-hidden z-50">
          {results.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-border/30 flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground">{product.brand}</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${getScoreColor(
                  product.healthScore
                )}`}
              >
                {product.healthScore}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl border border-border/30 shadow-xl p-4 text-center z-50">
          <p className="text-sm text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  );
};
