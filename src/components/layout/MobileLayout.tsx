import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface MobileLayoutProps {
  children: ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-24 max-w-md mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};
