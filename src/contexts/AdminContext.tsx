import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface SpotlightItem {
  postId: string;
  pinnedAt: Date;
}

export interface LinkOverride {
  productName: string;
  customUrl: string;
  addedAt: Date;
}

interface AdminContextType {
  isAdmin: boolean;
  spotlightPins: SpotlightItem[];
  linkOverrides: LinkOverride[];
  toggleAdmin: () => void;
  pinToSpotlight: (postId: string) => void;
  unpinFromSpotlight: (postId: string) => void;
  isPostPinned: (postId: string) => boolean;
  addLinkOverride: (productName: string, customUrl: string) => void;
  removeLinkOverride: (productName: string) => void;
  getLinkOverride: (productName: string) => string | undefined;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [spotlightPins, setSpotlightPins] = useState<SpotlightItem[]>([]);
  const [linkOverrides, setLinkOverrides] = useState<LinkOverride[]>([]);

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

  const addLinkOverride = useCallback((productName: string, customUrl: string) => {
    setLinkOverrides((prev) => {
      const existing = prev.findIndex(
        (o) => o.productName.toLowerCase() === productName.toLowerCase()
      );
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { productName, customUrl, addedAt: new Date() };
        return updated;
      }
      return [...prev, { productName, customUrl, addedAt: new Date() }];
    });
  }, []);

  const removeLinkOverride = useCallback((productName: string) => {
    setLinkOverrides((prev) =>
      prev.filter((o) => o.productName.toLowerCase() !== productName.toLowerCase())
    );
  }, []);

  const getLinkOverride = useCallback(
    (productName: string): string | undefined => {
      const override = linkOverrides.find(
        (o) => o.productName.toLowerCase() === productName.toLowerCase()
      );
      return override?.customUrl;
    },
    [linkOverrides]
  );

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        spotlightPins,
        linkOverrides,
        toggleAdmin,
        pinToSpotlight,
        unpinFromSpotlight,
        isPostPinned,
        addLinkOverride,
        removeLinkOverride,
        getLinkOverride,
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
