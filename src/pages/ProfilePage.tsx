import { Settings, Scan, Skull, ShieldBan, Heart, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { usePosts } from "@/contexts/PostContext";

const ProfilePage = () => {
  const { posts } = usePosts();
  
  // Calculate total karma (likes) from user's posts
  const totalKarma = posts
    .filter(post => post.userName === 'You')
    .reduce((sum, post) => sum + post.likes, 0);
  
  // Get user's scan history
  const scanHistory = posts.filter(
    post => post.type === 'scan' || post.userName === 'You'
  );

  const stats = [
    { icon: Scan, label: "Scans", value: "12", color: "text-primary" },
    { icon: Skull, label: "Villains Exposed", value: "5", color: "text-destructive" },
    { icon: ShieldBan, label: "Toxic Avoided", value: "3", color: "text-score-good" },
    { icon: Heart, label: "Karma", value: totalKarma.toString(), color: "text-pink-500" },
  ];

  const getScoreColor = (score?: number) => {
    if (!score) return "bg-muted text-muted-foreground";
    if (score >= 70) return "bg-score-good/20 text-score-good";
    if (score >= 40) return "bg-score-okay/20 text-score-okay";
    return "bg-score-bad/20 text-score-bad";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32">
      {/* Header with Settings */}
      <header className="px-5 pt-12 pb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <button className="p-2 rounded-xl bg-card/50 border border-border/30 hover:bg-card transition-colors">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Identity Header */}
      <div className="px-5 py-6 flex flex-col items-center">
        {/* Avatar with Glowing Ring */}
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-emerald-400 to-teal-500 blur-md opacity-60 animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-emerald-600 p-[3px]">
            <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center">
              <span className="text-3xl">🔍</span>
            </div>
          </div>
          {/* Level Badge */}
          <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
            Lvl 5
          </div>
        </div>
        
        {/* User Details */}
        <h2 className="text-xl font-bold text-foreground mb-1">Jayesh_Foodie</h2>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <span>🛡️</span>
          <span>Label Detective</span>
          <span className="text-primary font-medium">(Lvl 5)</span>
        </p>
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
