import { Search } from "lucide-react";

export const SearchBar = () => {
  return (
    <div className="relative">
      <div className="flex items-center gap-3 bg-card rounded-full px-5 py-3.5 shadow-xl">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search for Amul, Parle, Lays..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
        />
      </div>
    </div>
  );
};
