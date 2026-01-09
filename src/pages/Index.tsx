import { SearchBar } from "@/components/home/SearchBar";
import { SpotlightCarousel } from "@/components/home/SpotlightCarousel";
import { Categories } from "@/components/home/Categories";
import { TrendingDiscussions } from "@/components/home/TrendingDiscussions";
import { DailyOps } from "@/components/home/DailyOps";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="px-5 pt-12 pb-4 animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Flip</h1>
            <p className="text-sm text-muted-foreground">Know what you eat</p>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-5 mb-6 animate-fade-up animation-delay-150">
        <SearchBar />
      </div>

      {/* Daily Ops - Mission Control */}
      <section className="animate-fade-up animation-delay-200">
        <DailyOps />
      </section>

      {/* Spotlight Carousel */}
      <section className="mb-8 animate-fade-up animation-delay-250">
        <div className="px-5 mb-4">
          <h2 className="text-lg font-semibold text-foreground">The Spotlight</h2>
        </div>
        <SpotlightCarousel />
      </section>

      {/* Categories */}
      <section className="mb-8 animate-fade-up animation-delay-300">
        <Categories />
      </section>

      {/* Trending Discussions */}
      <section className="animate-fade-up animation-delay-300">
        <TrendingDiscussions />
      </section>
    </div>
  );
};

export default Index;
