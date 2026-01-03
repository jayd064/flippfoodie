import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface SpotlightItem {
  postId: string;
  pinnedAt: Date;
}

interface AdminContextType {
  isAdmin: boolean;
  spotlightPins: SpotlightItem[];
  toggleAdmin: () => void;
  pinToSpotlight: (postId: string) => void;
  unpinFromSpotlight: (postId: string) => void;
  isPostPinned: (postId: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [spotlightPins, setSpotlightPins] = useState<SpotlightItem[]>([]);

  const toggleAdmin = useCallback(() => {
    setIsAdmin((prev) => !prev);
  }, []);

  const pinToSpotlight = useCallback((postId: string) => {
    setSpotlightPins((prev) => {
      // Limit to 3 pinned items
      if (prev.length >= 3) {
        const newPins = prev.slice(1);
        return [...newPins, { postId, pinnedAt: new Date() }];
      }
      return [...prev, { postId, pinnedAt: new Date() }];
    });
  }, []);

  const unpinFromSpotlight = useCallback((postId: string) => {
    setSpotlightPins((prev) => prev.filter((pin) => pin.postId !== postId));
  }, []);

  const isPostPinned = useCallback(
    (postId: string) => {
      return spotlightPins.some((pin) => pin.postId === postId);
    },
    [spotlightPins]
  );

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        spotlightPins,
        toggleAdmin,
        pinToSpotlight,
        unpinFromSpotlight,
        isPostPinned,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
