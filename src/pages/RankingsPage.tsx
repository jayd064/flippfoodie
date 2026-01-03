import { useState } from "react";
import { Trophy, ShoppingBag, Building2, Users, Crown, Share2, ExternalLink, AlertTriangle, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getVillains, getHeroes } from "@/data/GlobalStore";
import { getAffiliateLink, AMAZON_DISCLAIMER } from "@/lib/linkUtils";
import { useAdmin } from "@/contexts/AdminContext";

// Get real products from GlobalStore
const guiltyGems = getVillains().slice(0, 5).map((p, idx) => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  score: p.healthScore,
  scans: Math.floor(Math.random() * 15000) + 5000,
  image: p.image,
  affiliateUrl: p.affiliateUrl,
}));

const heroSwaps = getHeroes().slice(0, 5).map((p) => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  score: p.healthScore,
  affiliateUrl: p.affiliateUrl,
  image: p.image,
}));

const silentSwitches = [
  { id: 1, brand: "Nestle", product: "Maggi Masala", change: "Added more MSG", date: "2 weeks ago", severity: "warning" },
  { id: 2, brand: "Britannia", product: "Good Day", change: "Palm oil increased", date: "1 month ago", severity: "danger" },
];

const topBrands = [
  { id: 1, name: "Amul", avgScore: 72, products: 45, trend: "+3" },
  { id: 2, name: "Mother Dairy", avgScore: 68, products: 32, trend: "+1" },
  { id: 3, name: "The Whole Truth", avgScore: 85, products: 12, trend: "+5" },
  { id: 4, name: "Nestle", avgScore: 35, products: 89, trend: "-2" },
  { id: 5, name: "PepsiCo", avgScore: 28, products: 67, trend: "-1" },
];

const topDetectives = [
  { id: 1, name: "VeganVigilante", scans: 342, karma: 1250, level: 12, badge: "🏆" },
  { id: 2, name: "HealthHunter", scans: 289, karma: 980, level: 10, badge: "🥈" },
  { id: 3, name: "LabelLegend", scans: 256, karma: 870, level: 9, badge: "🥉" },
  { id: 4, name: "Jayesh_Foodie", scans: 12, karma: 45, level: 5, badge: "⭐" },
];

const topTribes = [
  { id: 1, name: "r/Amul", members: 12500, posts: 890, activity: "🔥 Hot" },
  { id: 2, name: "r/HealthySnacks", members: 8900, posts: 654, activity: "📈 Rising" },
  { id: 3, name: "r/VeganIndia", members: 6700, posts: 432, activity: "⚡ Active" },
];

const getScoreColor = (score: number) => {
  if (score >= 70) return "bg-score-good/20 text-score-good";
  if (score >= 40) return "bg-score-okay/20 text-score-okay";
  return "bg-score-bad/20 text-score-bad";
};

const RankingsPage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const { getLinkOverride } = useAdmin();

  const handleBuyProduct = (product: { name: string; affiliateUrl: string }) => {
    const adminOverride = getLinkOverride(product.name);
    const affiliateLink = getAffiliateLink(product.name, product.affiliateUrl, adminOverride);
    
    toast.success("Opening Amazon...", { description: `Redirecting to ${product.name}` });
    setTimeout(() => window.open(affiliateLink, "_blank"), 1000);
  };

  const handleShareRank = () => {
    if (navigator.share) {
      navigator.share({
        title: "My FlippFoodie Rank",
        text: "I'm ranked #4 on FlippFoodie! 🏆 Join me in exposing unhealthy foods!",
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32">
      {/* Header */}
      <header className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Rankings</h1>
            <p className="text-xs text-muted-foreground">Who's winning the health game?</p>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-5">
        <TabsList className="w-full bg-card/50 border border-border/30 p-1 h-auto">
          <TabsTrigger value="products" className="flex-1 text-xs py-2 data-[state=active]:bg-primary/20">
            <ShoppingBag className="w-3.5 h-3.5 mr-1" />
            Products
          </TabsTrigger>
          <TabsTrigger value="brands" className="flex-1 text-xs py-2 data-[state=active]:bg-primary/20">
            <Building2 className="w-3.5 h-3.5 mr-1" />
            Brands
          </TabsTrigger>
          <TabsTrigger value="detectives" className="flex-1 text-xs py-2 data-[state=active]:bg-primary/20">
            <Crown className="w-3.5 h-3.5 mr-1" />
            Detectives
          </TabsTrigger>
          <TabsTrigger value="tribes" className="flex-1 text-xs py-2 data-[state=active]:bg-primary/20">
            <Users className="w-3.5 h-3.5 mr-1" />
            Tribes
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="mt-4 space-y-6">
          {/* Guilty Gems */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <span className="text-lg">😈</span> Guilty Gems
              <span className="text-xs text-muted-foreground/60">Most scanned low-score</span>
            </h3>
            <div className="space-y-2">
              {guiltyGems.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-card/50 rounded-xl border border-border/30">
                  <span className="text-lg font-bold text-muted-foreground w-6">#{idx + 1}</span>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-border/30 flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.brand} • {product.scans.toLocaleString()} scans</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getScoreColor(product.score)}`}>
                    {product.score}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Hero Swaps */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <span className="text-lg">🦸</span> Hero Swaps
              <span className="text-xs text-muted-foreground/60">Healthy alternatives</span>
            </h3>
            <div className="space-y-2">
              {heroSwaps.map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-card/50 rounded-xl border border-border/30">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-border/30 flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getScoreColor(product.score)}`}>
                    {product.score}
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-score-good hover:bg-score-good/90 text-xs h-8 px-3"
                    onClick={() => handleBuyProduct(product)}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Buy
                  </Button>
                </div>
              ))}
            </div>
            
            {/* Amazon Disclaimer */}
            <p className="text-[10px] text-muted-foreground text-center mt-4 opacity-70">
              {AMAZON_DISCLAIMER}
            </p>
          </section>

          {/* Silent Switches */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <span className="text-lg">🔕</span> Silent Switches
              <span className="text-xs text-muted-foreground/60">Ingredient changes</span>
            </h3>
            <div className="space-y-2">
              {silentSwitches.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-card/50 rounded-xl border border-border/30">
                  <div className={`p-2 rounded-lg ${item.severity === 'danger' ? 'bg-destructive/20' : 'bg-score-okay/20'}`}>
                    <AlertTriangle className={`w-4 h-4 ${item.severity === 'danger' ? 'text-destructive' : 'text-score-okay'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{item.brand} - {item.product}</p>
                    <p className="text-xs text-muted-foreground">{item.change}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>

        {/* Brands Tab */}
        <TabsContent value="brands" className="mt-4">
          <div className="space-y-2">
            {topBrands.map((brand, idx) => (
              <div key={brand.id} className="flex items-center gap-3 p-4 bg-card/50 rounded-xl border border-border/30">
                <span className={`text-xl font-bold ${idx < 3 ? 'text-amber-400' : 'text-muted-foreground'}`}>
                  #{idx + 1}
                </span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{brand.name}</p>
                  <p className="text-xs text-muted-foreground">{brand.products} products</p>
                </div>
                <div className="text-right">
                  <div className={`px-2.5 py-1 rounded-lg text-sm font-bold ${getScoreColor(brand.avgScore)}`}>
                    {brand.avgScore}
                  </div>
                  <p className={`text-xs mt-1 ${brand.trend.startsWith('+') ? 'text-score-good' : brand.trend.startsWith('-') ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {brand.trend !== '0' && <TrendingUp className="w-3 h-3 inline mr-0.5" />}
                    {brand.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Detectives Tab */}
        <TabsContent value="detectives" className="mt-4">
          <div className="space-y-2">
            {topDetectives.map((user, idx) => (
              <div 
                key={user.id} 
                className={`flex items-center gap-3 p-4 rounded-xl border ${
                  user.name === 'Jayesh_Foodie' 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'bg-card/50 border-border/30'
                }`}
              >
                <span className="text-2xl">{user.badge}</span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-lg">
                  🔍
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    {user.name}
                    {user.name === 'Jayesh_Foodie' && <span className="text-xs text-primary">(You)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">Lvl {user.level} • {user.scans} scans • {user.karma} karma</p>
                </div>
                <span className="text-lg font-bold text-muted-foreground">#{idx + 1}</span>
              </div>
            ))}
          </div>

          {/* Share My Rank Button */}
          <Button
            onClick={handleShareRank}
            className="w-full mt-6 bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90 h-12 text-base font-semibold"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share My Rank
          </Button>
        </TabsContent>

        {/* Tribes Tab */}
        <TabsContent value="tribes" className="mt-4">
          <div className="space-y-2">
            {topTribes.map((tribe, idx) => (
              <div key={tribe.id} className="flex items-center gap-3 p-4 bg-card/50 rounded-xl border border-border/30">
                <span className={`text-xl font-bold ${idx < 3 ? 'text-amber-400' : 'text-muted-foreground'}`}>
                  #{idx + 1}
                </span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-violet-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{tribe.name}</p>
                  <p className="text-xs text-muted-foreground">{tribe.members.toLocaleString()} members • {tribe.posts} posts</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-card border border-border/50">
                  {tribe.activity}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RankingsPage;
