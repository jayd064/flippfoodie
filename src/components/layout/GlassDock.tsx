import { Home, Scan, Users, Trophy, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Users, label: "Subs", path: "/feed" },
  { icon: Scan, label: "Scan", path: "/scan", isHero: true },
  { icon: Trophy, label: "Rankings", path: "/rankings" },
  { icon: User, label: "Profile", path: "/profile" },
];

export const GlassDock = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-6 left-4 right-4 z-50 pb-safe">
      <div className="relative bg-black/60 backdrop-blur-xl border border-white/5 rounded-2xl mx-auto max-w-md">
        <div className="flex items-center justify-around h-16 px-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            if (item.isHero) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative -mt-8 group"
                >
                  {/* Ambient glow */}
                  <div className="absolute inset-0 -m-2 bg-primary/30 rounded-full blur-xl animate-pulse opacity-60" />
                  <div className="absolute inset-0 -m-1 bg-primary/20 rounded-full blur-md" />
                  
                  {/* Hero button */}
                  <div
                    className={cn(
                      "relative w-14 h-14 rounded-full flex items-center justify-center",
                      "bg-gradient-to-br from-primary to-primary/80",
                      "shadow-lg shadow-primary/30",
                      "transition-transform duration-300 group-hover:scale-105"
                    )}
                  >
                    <Icon className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-300",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive && "text-primary"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-all",
                    isActive && "text-primary"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
