import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Level thresholds
const LEVELS = [
  { min: 0, max: 4, level: 1, title: "Novice Scanner", emoji: "🌱" },
  { min: 5, max: 9, level: 2, title: "Label Ninja", emoji: "🥷" },
  { min: 10, max: Infinity, level: 3, title: "Truth Seeker", emoji: "🔮" },
];

const STORAGE_KEY = "flip_profile_id";

export interface Profile {
  id: string;
  user_id: string | null;
  display_name: string;
  avatar_url: string | null;
  scans_count: number;
  villains_exposed: number;
  total_karma: number;
  level: number;
}

export const useGamification = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Get level info based on scans
  const getLevelInfo = (scansCount: number) => {
    return LEVELS.find(l => scansCount >= l.min && scansCount <= l.max) || LEVELS[0];
  };

  // Calculate level from scans
  const calculateLevel = (scansCount: number): number => {
    const levelInfo = getLevelInfo(scansCount);
    return levelInfo.level;
  };

  // Initialize or fetch profile
  useEffect(() => {
    const initProfile = async () => {
      try {
        let profileId = localStorage.getItem(STORAGE_KEY);
        
        if (profileId) {
          // Fetch existing profile
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", profileId)
            .single();
          
          if (data && !error) {
            setProfile(data as Profile);
            setLoading(false);
            return;
          }
        }
        
        // Create new anonymous profile
        const { data: newProfile, error } = await supabase
          .from("profiles")
          .insert({
            display_name: "Anonymous Scanner",
            scans_count: 0,
            villains_exposed: 0,
            total_karma: 0,
            level: 1,
          })
          .select()
          .single();
        
        if (newProfile && !error) {
          localStorage.setItem(STORAGE_KEY, newProfile.id);
          setProfile(newProfile as Profile);
        }
      } catch (err) {
        console.error("Failed to init profile:", err);
      } finally {
        setLoading(false);
      }
    };

    initProfile();
  }, []);

  // Record a scan with XP reward
  const recordScan = useCallback(async (isVillain: boolean) => {
    if (!profile) return;

    const oldLevel = profile.level;
    const newScansCount = profile.scans_count + 1;
    const newVillainsExposed = isVillain ? profile.villains_exposed + 1 : profile.villains_exposed;
    const newLevel = calculateLevel(newScansCount);
    const xpGained = isVillain ? 10 : 5;

    // Update database
    const { error } = await supabase
      .from("profiles")
      .update({
        scans_count: newScansCount,
        villains_exposed: newVillainsExposed,
        total_karma: profile.total_karma + xpGained,
        level: newLevel,
      })
      .eq("id", profile.id);

    if (error) {
      console.error("Failed to update profile:", error);
      return;
    }

    // Update local state
    setProfile(prev => prev ? {
      ...prev,
      scans_count: newScansCount,
      villains_exposed: newVillainsExposed,
      total_karma: prev.total_karma + xpGained,
      level: newLevel,
    } : null);

    // Show XP toast with premium styling
    toast.success(
      isVillain ? "🎯 +10 XP! Villain Exposed" : "✨ +5 XP! Product Scanned",
      {
        description: `Total: ${profile.total_karma + xpGained} XP`,
        duration: 3000,
        style: {
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          border: "none",
          color: "white",
        },
      }
    );

    // Check for level up
    if (newLevel > oldLevel) {
      const levelInfo = getLevelInfo(newScansCount);
      setTimeout(() => {
        toast.success(
          `🎉 LEVEL UP! You're now a ${levelInfo.emoji} ${levelInfo.title}!`,
          {
            duration: 5000,
            style: {
              background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
              border: "none",
              color: "white",
            },
          }
        );
        // Trigger confetti effect via custom event
        window.dispatchEvent(new CustomEvent("levelUp"));
      }, 1000);
    }
  }, [profile]);

  // Add karma (from upvotes, etc.)
  const addKarma = useCallback(async (amount: number) => {
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        total_karma: profile.total_karma + amount,
      })
      .eq("id", profile.id);

    if (!error) {
      setProfile(prev => prev ? {
        ...prev,
        total_karma: prev.total_karma + amount,
      } : null);
    }
  }, [profile]);

  return {
    profile,
    loading,
    recordScan,
    addKarma,
    getLevelInfo,
    LEVELS,
  };
};
