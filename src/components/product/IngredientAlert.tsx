import { AlertTriangle } from "lucide-react";

interface Ingredient {
  name: string;
  concern: string;
}

interface IngredientAlertProps {
  ingredients: Ingredient[];
}

export const IngredientAlert = ({ ingredients }: IngredientAlertProps) => {
  return (
    <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4 animate-fade-up animation-delay-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-full bg-destructive/10">
          <AlertTriangle className="w-4 h-4 text-destructive" />
        </div>
        <h3 className="font-semibold text-foreground">Ingredient Alerts</h3>
      </div>
      
      <div className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <div 
            key={index} 
            className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border/50"
          >
            <div className="w-2 h-2 mt-1.5 rounded-full bg-destructive flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">{ingredient.name}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {ingredient.concern}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
