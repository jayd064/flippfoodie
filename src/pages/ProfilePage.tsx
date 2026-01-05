import { useState } from "react";
import { Settings, Zap, Shield, Skull, Heart, ChevronRight, Sparkles, Crown, Target, Camera, Link2, Pin, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { usePosts } from "@/contexts/PostContext";
import { useAdmin } from "@/contexts/AdminContext";
import { useGamification } from "@/hooks/useGamification";
import { Confetti } from "@/components/effects/Confetti";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ProfilePage = () => {
  const { posts } = usePosts();
  const { 
    isAdmin, 
    toggleAdmin, 
    pinToSpotlight, 
    unpinFromSpotlight, 
    isPostPinned,
    linkOverrides,
    addLinkOverride,
    removeLinkOverride
  } = useAdmin();
  const { profile, loading, getLevelInfo } = useGamification();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  // Get level info
  const levelInfo = profile ? getLevelInfo(profile.scans_count) : { level: 1, title: "Novice Scanner", emoji: "🌱" };
  
  // Calculate progress to next level
  const getProgressToNextLevel = () => {
    if (!profile) return 0;
    const scans = profile.scans_count;
    if (scans < 5) return (scans / 5) * 100;
    if (scans < 10) return ((scans - 5) / 5) * 100;
    return 100;
  };

  // Check for Senior Detective status
  const isSeniorDetective = profile && profile.villains_exposed >= 10;

  // Community posts available for pinning
  const communityPosts = posts.filter(post => post.userName !== 'You');

  // Handle adding a new link override
  const handleAddLinkOverride = () => {
    if (!newLinkName.trim() || !newLinkUrl.trim()) {
      toast.error("Please enter both product name and URL");
      return;
    }
    addLinkOverride(newLinkName.trim(), newLinkUrl.trim());
    toast.success("Link override added!", { description: `${newLinkName} → ${newLinkUrl}` });
    setNewLinkName("");
    setNewLinkUrl("");
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return "text-red-400";
    if (score < 70) return "text-amber-400";
    return "text-emerald-400";
  };

  const getLevelGlow = () => {
    if (!profile) return "ring-zinc-600";
    if (profile.level >= 3) return "ring-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5)]";
    if (profile.level >= 2) return "ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]";
    return "ring-zinc-600";
  };

  // Mock scan history
  const scanHistory = [
    { id: 1, title: "Maggi 2-Minute Noodles", tribe: "Nestle", score: 22, image: "https://m.media-amazon.com/images/I/81vJyEj2RlL._SL1500_.jpg" },
    { id: 2, title: "Lay's Magic Masala", tribe: "PepsiCo", score: 15, image: "https://m.media-amazon.com/images/I/81vg3dU8GEL._SL1500_.jpg" },
    { id: 3, title: "Amul Butter", tribe: "Amul", score: 65, image: "https://m.media-amazon.com/images/I/61b7b7v+TFL._SL1500_.jpg" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 bg-background">
      <Confetti />
      
      {/* Header with Settings */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Profile</h1>
        <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
          <SheetTrigger asChild>
            <button className="p-2.5 rounded-xl bg-card border border-border/50 hover:bg-muted/50 transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent className="bg-[#0a0a0a] border-l border-white/10 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-white">Settings</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Profile Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-zinc-400">Profile</h3>
                <div className="p-4 rounded-xl bg-[#151515] border border-white/5">
                  <p className="text-sm text-zinc-500">More settings coming soon...</p>
                </div>
              </div>
              
              {/* Admin Mode Toggle */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-zinc-400">Developer</h3>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#151515] border border-white/5">
                  <span className="text-sm text-white">Admin Mode</span>
                  <Switch checked={isAdmin} onCheckedChange={toggleAdmin} />
                </div>
              </div>

              {/* Admin Features */}
              {isAdmin && (
                <>
                  {/* Spotlight Management */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-amber-400 flex items-center gap-2">
                      <Pin className="w-4 h-4" />
                      Spotlight Management
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {communityPosts.slice(0, 10).map((post) => (
                        <div 
                          key={post.id} 
                          className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1a] border border-white/5"
                        >
                          <span className="text-sm text-white truncate flex-1 mr-2">{post.title}</span>
                          <Button
                            size="sm"
                            variant={isPostPinned(post.id) ? "destructive" : "outline"}
                            onClick={() => isPostPinned(post.id) ? unpinFromSpotlight(post.id) : pinToSpotlight(post.id)}
                            className="text-xs"
                          >
                            {isPostPinned(post.id) ? "Unpin" : "Pin"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Affiliate Link Overrides */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                      <Link2 className="w-4 h-4" />
                      Affiliate Link Overrides
                    </h3>
                    
                    {/* Add new override */}
                    <div className="space-y-2">
                      <Input
                        placeholder="Product name (e.g., Oreo)"
                        value={newLinkName}
                        onChange={(e) => setNewLinkName(e.target.value)}
                        className="bg-[#1a1a1a] border-white/10"
                      />
                      <Input
                        placeholder="Amazon URL (amzn.to/...)"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        className="bg-[#1a1a1a] border-white/10"
                      />
                      <Button onClick={handleAddLinkOverride} className="w-full" size="sm">
                        Add Override
                      </Button>
                    </div>

                    {/* Existing overrides */}
                    {linkOverrides.length > 0 && (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {linkOverrides.map((override) => (
                          <div 
                            key={override.productName} 
                            className="flex items-center justify-between p-2 rounded-lg bg-[#1a1a1a] border border-white/5"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-white truncate">{override.productName}</p>
                              <p className="text-xs text-zinc-500 truncate">{override.customUrl}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                removeLinkOverride(override.productName);
                                toast.success("Link override removed");
                              }}
                              className="p-1 h-auto"
                            >
                              <Trash2 className="w-3 h-3 text-red-400" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Premium Identity Header */}
      <section className="px-5 mb-8">
        <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#151515] to-[#0d0d0d] border border-white/5 overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          
          {/* Avatar with Level Ring */}
          <div className="flex flex-col items-center mb-6 relative z-10">
            <div className={`relative w-24 h-24 rounded-full ring-4 ${getLevelGlow()} p-1 bg-[#0a0a0a]`}>
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-4xl">{levelInfo.emoji}</span>
              </div>
              {/* Level badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shadow-lg">
                {profile?.level || 1}
              </div>
              {/* Verified badge for Senior Detective */}
              {isSeniorDetective && (
                <div className="absolute -top-1 -right-1 p-1 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            {/* Name & Title */}
            <h2 className="mt-4 text-xl font-bold text-white">
              {profile?.display_name || "Anonymous Scanner"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">{levelInfo.title}</span>
            </div>
            
            {/* Senior Detective Badge */}
            {isSeniorDetective && (
              <div className="mt-2 flex items-center gap-1 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-500/30">
                <Shield className="w-3 h-3 text-amber-500" />
                <span className="text-xs text-amber-500 font-medium">Verified Detective</span>
              </div>
            )}
            
            {/* XP Progress Bar */}
            <div className="w-full max-w-xs mt-4">
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>Progress to next level</span>
                <span>{Math.round(getProgressToNextLevel())}%</span>
              </div>
              <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressToNextLevel()}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="px-5 mb-8">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-card border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Scans</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{profile?.scans_count || 0}</p>
          </div>
          
          <div className="p-4 rounded-2xl bg-card border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Skull className="w-4 h-4 text-red-400" />
              <span className="text-xs text-muted-foreground">Villains Exposed</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{profile?.villains_exposed || 0}</p>
          </div>
          
          <div className="p-4 rounded-2xl bg-card border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-muted-foreground">Toxic Avoided</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{profile?.villains_exposed || 0}</p>
          </div>
          
          <div className="p-4 rounded-2xl bg-card border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-muted-foreground">Total XP</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{profile?.total_karma || 0}</p>
          </div>
        </div>
      </section>

      {/* Scan History */}
      <section className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">My Scan History</h3>
          <span className="text-xs text-muted-foreground">{scanHistory.length} items</span>
        </div>
        
        <div className="space-y-3">
          {scanHistory.length > 0 ? (
            scanHistory.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/5 flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">t/{item.tribe}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(item.score)}`}>
                    {item.score}
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 rounded-2xl bg-card border border-border/50 text-center">
              <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No scans yet</p>
              <Link 
                to="/scan"
                className="inline-block mt-4 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Scan your first item
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
