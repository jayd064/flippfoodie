import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, Award } from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  { icon: Bell, label: "Notifications", badge: "3" },
  { icon: Shield, label: "Privacy Settings" },
  { icon: Award, label: "Achievements" },
  { icon: HelpCircle, label: "Help & Support" },
  { icon: Settings, label: "App Settings" },
];

const ProfilePage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground animate-fade-up">Profile</h1>
      </header>

      {/* Profile Card */}
      <div className="px-5 mb-6">
        <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-soft animate-fade-up">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">Guest User</h2>
              <p className="text-sm text-muted-foreground">Sign in to save your data</p>
            </div>
            <Link 
              to="/login"
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-3 gap-3 animate-fade-up animation-delay-100">
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-soft text-center">
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-xs text-muted-foreground mt-1">Scans</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-soft text-center">
            <p className="text-2xl font-bold text-foreground">5</p>
            <p className="text-xs text-muted-foreground mt-1">Saved</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-soft text-center">
            <p className="text-2xl font-bold text-score-good">78%</p>
            <p className="text-xs text-muted-foreground mt-1">Healthy</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-5">
        <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden animate-fade-up animation-delay-200">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
              >
                <div className="p-2 rounded-xl bg-muted">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="flex-1 text-left font-medium text-foreground">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="px-5 mt-4 animate-fade-up animation-delay-300">
        <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-colors">
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>

      {/* Version */}
      <p className="text-center text-xs text-muted-foreground mt-6 animate-fade-up animation-delay-300">
        Flip v1.0.0
      </p>
    </div>
  );
};

export default ProfilePage;
