import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { StoryViewer } from "./StoryViewer";

interface UserStory {
  id: string;
  display_name: string;
  avatar_url: string | null;
  lastScanScore: number | null;
  lastProductName: string | null;
  lastProductImage: string | null;
  hasNewUpdate: boolean;
}

export const LiveRings = () => {
  const [users, setUsers] = useState<UserStory[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserStory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersWithScans = async () => {
      try {
        // Fetch profiles that have scans
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url, scans_count")
          .gt("scans_count", 0)
          .order("updated_at", { ascending: false })
          .limit(10);

        if (profilesError) throw profilesError;

        // For each profile, get their latest scan with product info
        const usersWithScans: UserStory[] = [];

        for (const profile of profiles || []) {
          // Get latest scan for this user (using profile id as user_id might be null for anonymous)
          const { data: latestScan } = await supabase
            .from("scans")
            .select("product_barcode, scanned_at")
            .order("scanned_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (latestScan) {
            // Get product details
            const { data: product } = await supabase
              .from("products")
              .select("name, health_score, front_image_url")
              .eq("barcode", latestScan.product_barcode)
              .maybeSingle();

            if (product) {
              usersWithScans.push({
                id: profile.id,
                display_name: profile.display_name || "Anonymous",
                avatar_url: profile.avatar_url,
                lastScanScore: product.health_score,
                lastProductName: product.name,
                lastProductImage: product.front_image_url,
                hasNewUpdate: new Date(latestScan.scanned_at).getTime() > Date.now() - 24 * 60 * 60 * 1000,
              });
            }
          }
        }

        // If we don't have enough real data, add some demo entries
        if (usersWithScans.length < 3) {
          const demoUsers: UserStory[] = [
            {
              id: "demo-1",
              display_name: "Health Hero",
              avatar_url: null,
              lastScanScore: 85,
              lastProductName: "Yoga Bar",
              lastProductImage: "https://m.media-amazon.com/images/I/71J1x0kP+DL._SL1500_.jpg",
              hasNewUpdate: true,
            },
            {
              id: "demo-2",
              display_name: "Snack Scout",
              avatar_url: null,
              lastScanScore: 32,
              lastProductName: "Maggi Noodles",
              lastProductImage: "https://m.media-amazon.com/images/I/81tp0D9+y5L._SL1500_.jpg",
              hasNewUpdate: true,
            },
            {
              id: "demo-3",
              display_name: "Label Reader",
              avatar_url: null,
              lastScanScore: 45,
              lastProductName: "Lay's Chips",
              lastProductImage: "https://m.media-amazon.com/images/I/81R9Wk+rWPL._SL1500_.jpg",
              hasNewUpdate: false,
            },
          ];
          setUsers([...usersWithScans, ...demoUsers.slice(0, 3 - usersWithScans.length)]);
        } else {
          setUsers(usersWithScans);
        }
      } catch (err) {
        console.error("Failed to fetch stories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersWithScans();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="px-5 py-3">
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
              <div className="w-12 h-3 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) return null;

  return (
    <>
      <div className="py-3">
        <ScrollArea className="w-full">
          <div className="flex gap-4 px-5">
            {users.map((user) => {
              const isHero = (user.lastScanScore ?? 0) >= 50;
              const isVillain = (user.lastScanScore ?? 0) < 50;

              return (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="flex flex-col items-center gap-1.5 min-w-[72px] group"
                >
                  {/* Avatar with Ring */}
                  <div className="relative">
                    {/* Activity Ring */}
                    <div
                      className={cn(
                        "absolute -inset-1 rounded-full",
                        isHero && "bg-gradient-to-tr from-emerald-400 via-green-500 to-teal-400",
                        isVillain && "bg-gradient-to-tr from-red-500 via-orange-500 to-rose-500",
                        user.hasNewUpdate && "animate-pulse"
                      )}
                    />
                    
                    {/* Inner black ring (gap effect) */}
                    <div className="absolute inset-0 rounded-full bg-background" />
                    
                    {/* Avatar */}
                    <div
                      className={cn(
                        "relative w-14 h-14 rounded-full overflow-hidden",
                        "bg-gradient-to-br from-zinc-700 to-zinc-800",
                        "flex items-center justify-center",
                        "transition-transform duration-200 group-active:scale-95"
                      )}
                    >
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.display_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-foreground">
                          {getInitials(user.display_name)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <span className="text-xs text-muted-foreground truncate max-w-[64px]">
                    {user.display_name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      {/* Story Viewer Portal */}
      {selectedUser && (
        <StoryViewer
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
};
