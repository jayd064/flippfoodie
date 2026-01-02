import { ReactNode } from "react";
import { GlassDock } from "./GlassDock";

interface MobileLayoutProps {
  children: ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-32 max-w-md mx-auto">
        {children}
      </main>
      <GlassDock />
    </div>
  );
};
