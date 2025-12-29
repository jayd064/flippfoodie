import { ArrowRight, Leaf } from "lucide-react";
import { HealthScore } from "./HealthScore";

interface AlternativeProduct {
  name: string;
  brand: string;
  score: number;
  image: string;
}

interface BetterAlternativeProps {
  product: AlternativeProduct;
}

export const BetterAlternative = ({ product }: BetterAlternativeProps) => {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 animate-fade-up animation-delay-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-full bg-primary/10">
          <Leaf className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">Better Alternative</h3>
      </div>
      
      <div className="flex items-center gap-4 p-3 bg-card rounded-xl border border-border/50">
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 rounded-xl object-cover"
        />
        
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{product.name}</p>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          
          <div className="mt-2">
            <HealthScore score={product.score} size="sm" />
          </div>
        </div>
        
        <button className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
