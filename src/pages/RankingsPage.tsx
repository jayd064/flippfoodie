import { useState } from "react";
import { Trophy, ShoppingBag, Building2, Users, Crown, Share2, ExternalLink, AlertTriangle, TrendingUp, Shield, Skull, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getVillains, getHeroes } from "@/data/GlobalStore";
import { getAffiliateLink, AMAZON_DISCLAIMER } from "@/lib/linkUtils";
import { useAdmin } from "@/contexts/AdminContext";
import { CinematicBattleCard } from "@/components/profile/CinematicBattleCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

// Updated Detectives with Saints (high score scanners) and Critics (low score scanners)
const theSaints = [
  { id: "1", name: "YogaQueen", heroScans: 89, karma: 1450, level: 14, theme: "gold", avatarUrl: "" },
  { id: "2", name: "CleanEater", heroScans: 76, karma: 1200, level: 12, theme: "default", avatarUrl: "" },
  { id: "3", name: "HealthHunter", heroScans: 65, karma: 980, level: 10, theme: "cyberpunk", avatarUrl: "" },
  { id: "4", name: "NutriNinja", heroScans: 54, karma: 780, level: 8, theme: "default", avatarUrl: "" },
];

const theCritics = [
  { id: "5", name: "VeganVigilante", villainScans: 142, karma: 1650, level: 15, theme: "noir", avatarUrl: "" },
  { id: "6", name: "LabelLegend", villainScans: 98, karma: 1100, level: 11, theme: "cyberpunk", avatarUrl: "" },
  { id: "7", name: "ToxicHunter", villainScans: 87, karma: 920, level: 9, theme: "gold", avatarUrl: "" },
  { id: "8", name: "Jayesh_Foodie", villainScans: 12, karma: 145, level: 5, theme: "default", avatarUrl: "", isCurrentUser: true },
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

// Get theme ring color
const getThemeRing = (theme: string) => {
  switch (theme) {
    case "gold": return "ring-2 ring-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]";
    case "cyberpunk": return "ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]";
    case "noir": return "ring-2 ring-zinc-400 shadow-[0_0_10px_rgba(161,161,170,0.3)]";
    default: return "ring-2 ring-primary/50";
  }
};

const RankingsPage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [detectiveView, setDetectiveView] = useState<"saints" | "critics">("saints");
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; avatar?: string; theme?: string } | null>(null);
  const { getLinkOverride } = useAdmin();

  // Current user data for sticky footer
  const currentUser = theCritics.find(u => u.isCurrentUser) || theCritics[theCritics.length - 1];
  const currentUserRank = theCritics.findIndex(u => u.isCurrentUser) + 1 || theCritics.length;
  const userAbove = currentUserRank > 1 ? theCritics[currentUserRank - 2] : null;

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

        {/* Detectives Tab - Premium Split View */}
        <TabsContent value="detectives" className="mt-4 space-y-4">
          {/* Saints vs Critics Toggle */}
          <div className="flex gap-2 p-1 bg-card/50 rounded-xl border border-border/30">
            <button
              onClick={() => setDetectiveView("saints")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all",
                detectiveView === "saints"
                  ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Shield className="w-4 h-4" />
              The Saints
            </button>
            <button
              onClick={() => setDetectiveView("critics")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all",
                detectiveView === "critics"
                  ? "bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-400 border border-rose-500/30"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Skull className="w-4 h-4" />
              The Critics
            </button>
          </div>

          {/* Subtitle */}
          <p className="text-xs text-muted-foreground text-center">
            {detectiveView === "saints" 
              ? "🏆 Top scanners of healthy products" 
              : "🔍 Top exposers of unhealthy products"}
          </p>

          {/* User List */}
          <div className="space-y-2">
            {(detectiveView === "saints" ? theSaints : theCritics).map((user, idx) => (
              <motion.div 
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedUser({ 
                  id: user.id, 
                  name: user.name, 
                  avatar: user.avatarUrl, 
                  theme: user.theme 
                })}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]",
                  'isCurrentUser' in user && user.isCurrentUser
                    ? "bg-primary/10 border-primary/30" 
                    : "bg-card/50 border-border/30 hover:border-white/20"
                )}
              >
                {/* Rank Badge */}
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                  idx === 0 && "bg-amber-500/20 text-amber-400",
                  idx === 1 && "bg-zinc-400/20 text-zinc-300",
                  idx === 2 && "bg-orange-600/20 text-orange-400",
                  idx > 2 && "bg-white/5 text-muted-foreground"
                )}>
                  #{idx + 1}
                </div>

                {/* Avatar with Premium Ring */}
                <div className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center overflow-hidden",
                  getThemeRing(user.theme)
                )}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className={cn(
                      "w-full h-full flex items-center justify-center text-lg font-bold",
                      detectiveView === "saints" 
                        ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white"
                        : "bg-gradient-to-br from-rose-600 to-red-600 text-white"
                    )}>
                      {user.name[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground flex items-center gap-2 truncate">
                    {user.name}
                    {'isCurrentUser' in user && user.isCurrentUser && (
                      <span className="text-xs text-primary">(You)</span>
                    )}
                    {user.theme !== "default" && (
                      <Sparkles className="w-3 h-3 text-amber-400" />
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Lvl {user.level} • {detectiveView === "saints" 
                      ? `${(user as typeof theSaints[0]).heroScans} heroes` 
                      : `${(user as typeof theCritics[0]).villainScans} villains`
                    } • {user.karma} karma
                  </p>
                </div>

                {/* Score Badge */}
                <div className={cn(
                  "px-2 py-1 rounded-lg text-xs font-mono font-bold",
                  detectiveView === "saints" 
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/20 text-rose-400"
                )}>
                  {detectiveView === "saints" 
                    ? (user as typeof theSaints[0]).heroScans
                    : (user as typeof theCritics[0]).villainScans
                  }
                </div>
              </motion.div>
            ))}
          </div>

          {/* Share My Rank Button */}
          <Button
            onClick={handleShareRank}
            className="w-full mt-4 bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90 h-12 text-base font-semibold"
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

      {/* Sticky Rank Footer - Only show on Detectives tab */}
      {activeTab === "detectives" && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-20 left-0 right-0 z-50 px-4"
        >
          <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              {/* User Avatar */}
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden",
                getThemeRing(currentUser.theme || "default")
              )}>
                <div className="w-full h-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-lg font-bold text-white">
                  {currentUser.name[0]?.toUpperCase()}
                </div>
              </div>

              {/* Rank Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-foreground font-mono">#{currentUserRank}</span>
                  <span className="text-sm text-muted-foreground truncate">{currentUser.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {userAbove 
                    ? `Scan ${Math.max(1, userAbove.villainScans - currentUser.villainScans + 1)} more villains to overtake ${userAbove.name}`
                    : "You're climbing the ranks! 🚀"
                  }
                </p>
              </div>

              {/* Level Badge */}
              <div className="px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/30">
                <span className="text-sm font-bold text-primary font-mono">Lvl {currentUser.level}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cinematic Battle Card Modal */}
      {selectedUser && (
        <CinematicBattleCard
          userId={selectedUser.id}
          userName={selectedUser.name}
          userAvatar={selectedUser.avatar}
          userTheme={selectedUser.theme}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default RankingsPage;
