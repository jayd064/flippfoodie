import { useState } from "react";
import { Settings, Scan, Skull, ShieldBan, Heart, Camera, Shield, ChevronRight, Pin, Sparkles, Link2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { usePosts } from "@/contexts/PostContext";
import { useAdmin } from "@/contexts/AdminContext";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  
  // Calculate real stats from PostContext
  const userPosts = posts.filter(post => post.userName === 'You');
  const userScans = userPosts.filter(post => post.type === 'scan');
  
  // Calculate total karma (likes) from user's posts
  const totalKarma = userPosts.reduce((sum, post) => sum + post.likes, 0);
  
  // Calculate villains exposed (scans with score < 40)
  const villainsExposed = userScans.filter(post => post.score && post.score < 40).length;
  
  // Calculate toxic brands avoided (unique brands with low scores)
  const toxicAvoided = new Set(
    userScans
      .filter(post => post.score && post.score < 40)
      .map(post => post.community)
  ).size;

  // Check if user qualifies for Senior Detective badge
  const isSeniorDetective = villainsExposed >= 10;

  // Get user's scan history
  const scanHistory = posts.filter(
    post => post.type === 'scan' || post.userName === 'You'
  );

  const stats = [
    { icon: Scan, label: "Scans", value: userScans.length.toString() || "0", color: "text-primary" },
    { icon: Skull, label: "Villains Exposed", value: villainsExposed.toString(), color: "text-destructive" },
    { icon: ShieldBan, label: "Toxic Avoided", value: toxicAvoided.toString(), color: "text-score-good" },
    { icon: Heart, label: "Karma", value: totalKarma.toString(), color: "text-pink-500" },
  ];

  const getScoreColor = (score?: number) => {
    if (!score) return "bg-muted text-muted-foreground";
    if (score >= 70) return "bg-score-good/20 text-score-good";
    if (score >= 40) return "bg-score-okay/20 text-score-okay";
    return "bg-score-bad/20 text-score-bad";
  };

  // Calculate level based on activity
  const activityScore = userScans.length + villainsExposed * 2 + totalKarma / 100;
  const level = Math.min(Math.floor(activityScore / 5) + 1, 99);

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

  // Community posts available for pinning
  const communityPosts = posts.filter(post => post.userName !== 'You');

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32">
      {/* Header with Settings */}
      <header className="px-5 pt-12 pb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <Drawer open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DrawerTrigger asChild>
            <button className="p-2 rounded-xl bg-card/50 border border-border/30 hover:bg-card transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="bg-[#0a0a0a] border-border/30">
            <DrawerHeader>
              <DrawerTitle className="text-foreground">Settings</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8 space-y-6">
              {/* Regular Settings */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-card/50 rounded-xl border border-border/30">
                  <span className="text-foreground">Edit Profile</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-card/50 rounded-xl border border-border/30">
                  <span className="text-foreground">Notifications</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-card/50 rounded-xl border border-border/30">
                  <span className="text-foreground">Privacy</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Admin Section (Hidden unless 3x tap on avatar) */}
              <div className="pt-4 border-t border-border/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">Admin Mode</span>
                  </div>
                  <Switch checked={isAdmin} onCheckedChange={toggleAdmin} />
                </div>
                
                {isAdmin && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Pin className="w-4 h-4 text-primary" />
                        Spotlight Management
                      </h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        Pin community posts to the Home Spotlight carousel (max 3)
                      </p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {communityPosts.slice(0, 10).map((post) => (
                          <div
                            key={post.id}
                            className="flex items-center justify-between p-2 bg-card/50 rounded-lg"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <img
                                src={post.image}
                                alt=""
                                className="w-8 h-8 rounded object-cover flex-shrink-0"
                              />
                              <span className="text-sm text-foreground truncate">
                                {post.title}
                              </span>
                            </div>
                            <button
                              onClick={() => 
                                isPostPinned(post.id) 
                                  ? unpinFromSpotlight(post.id)
                                  : pinToSpotlight(post.id)
                              }
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                isPostPinned(post.id)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-card border border-border/30 text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {isPostPinned(post.id) ? "Pinned" : "Pin"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Link Override Management */}
                    <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 mt-4">
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-amber-500" />
                        Affiliate Link Overrides
                      </h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        Upgrade search links to direct affiliate URLs for popular products
                      </p>
                      
                      {/* Add New Override */}
                      <div className="space-y-2 mb-4">
                        <Input
                          placeholder="Product name (e.g., Oreo)"
                          value={newLinkName}
                          onChange={(e) => setNewLinkName(e.target.value)}
                          className="bg-card/50 border-border/30 text-sm"
                        />
                        <Input
                          placeholder="Amazon link (amzn.to/...)"
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          className="bg-card/50 border-border/30 text-sm"
                        />
                        <Button 
                          onClick={handleAddLinkOverride}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                          size="sm"
                        >
                          Add Override
                        </Button>
                      </div>

                      {/* Existing Overrides */}
                      {linkOverrides.length > 0 && (
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {linkOverrides.map((override) => (
                            <div
                              key={override.productName}
                              className="flex items-center justify-between p-2 bg-card/50 rounded-lg"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground font-medium truncate">
                                  {override.productName}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {override.customUrl}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  removeLinkOverride(override.productName);
                                  toast.success("Link override removed");
                                }}
                                className="p-1.5 rounded-lg bg-destructive/20 hover:bg-destructive/30 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-destructive" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </header>

      {/* Identity Header */}
      <div className="px-5 py-6 flex flex-col items-center">
        {/* Avatar with Glowing Ring */}
        <div className="relative mb-4">
          <div 
            className={`absolute inset-0 rounded-full blur-md opacity-60 animate-pulse ${
              isSeniorDetective 
                ? "bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500"
                : "bg-gradient-to-r from-primary via-emerald-400 to-teal-500"
            }`} 
          />
          <div 
            className={`relative w-24 h-24 rounded-full p-[3px] ${
              isSeniorDetective
                ? "bg-gradient-to-br from-amber-400 to-yellow-600"
                : "bg-gradient-to-br from-primary to-emerald-600"
            }`}
          >
            <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center">
              <span className="text-3xl">🔍</span>
            </div>
          </div>
          {/* Level Badge */}
          <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
            Lvl {level}
          </div>
          {/* Verified Badge */}
          {isSeniorDetective && (
            <div className="absolute -top-1 -right-1 p-1 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]">
              <Shield className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        {/* User Details */}
        <h2 className="text-xl font-bold text-foreground mb-1">Jayesh_Foodie</h2>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <span>🛡️</span>
          <span>{isSeniorDetective ? "Senior Detective" : "Label Detective"}</span>
          <span className={isSeniorDetective ? "text-amber-500 font-medium" : "text-primary font-medium"}>
            (Lvl {level})
          </span>
        </p>
        {isSeniorDetective && (
          <div className="mt-2 flex items-center gap-1 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-500/30">
            <Shield className="w-3 h-3 text-amber-500" />
            <span className="text-xs text-amber-500 font-medium">Verified Detective</span>
          </div>
        )}
      </div>

      {/* Villain Stats Grid */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card/50 rounded-2xl p-4 border border-border/30 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg bg-card ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* My Scan History */}
      <div className="px-5">
        <h3 className="text-lg font-semibold text-foreground mb-4">My Scan History</h3>
        
        {scanHistory.length > 0 ? (
          <div className="space-y-3">
            {scanHistory.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-3 p-3 bg-card/50 rounded-xl border border-border/30"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{post.community}</p>
                </div>
                
                {/* Score Badge */}
                {post.score !== undefined && (
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getScoreColor(post.score)}`}>
                    {post.score}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-card/50 border border-border/30 flex items-center justify-center mb-4">
              <Camera className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">No scans yet</p>
            <Link
              to="/scan"
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Scan your first item
            </Link>
          </div>
        )}
      </div>

      {/* Scan Dates Section - if we have history */}
      {scanHistory.length > 0 && (
        <div className="px-5 mt-4 text-xs text-muted-foreground text-center">
          <p>Your scan journey began recently</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
