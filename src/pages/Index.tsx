import { ScanButton } from "@/components/home/ScanButton";
import { TrendingScans } from "@/components/home/TrendingScans";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-5 pt-12 pb-6 animate-fade-up">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Flip</h1>
            <p className="text-sm text-muted-foreground">Know what you eat</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center pt-8">
        <ScanButton />
      </div>

      {/* Trending Section */}
      <TrendingScans />

      {/* Quick Stats */}
      <section className="px-5 mt-8 animate-fade-up animation-delay-300">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-soft">
            <p className="text-3xl font-bold text-primary">12</p>
            <p className="text-sm text-muted-foreground mt-1">Products scanned</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-soft">
            <p className="text-3xl font-bold text-foreground">5</p>
            <p className="text-sm text-muted-foreground mt-1">Better choices made</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
