import { Link } from "react-router-dom";

const categories = [
  { id: 1, name: "Biscuits", emoji: "🍪", color: "from-amber-500/20 to-amber-600/10", slug: "biscuits" },
  { id: 2, name: "Drinks", emoji: "🥤", color: "from-blue-500/20 to-blue-600/10", slug: "drinks" },
  { id: 3, name: "Chocolates", emoji: "🍫", color: "from-orange-500/20 to-orange-600/10", slug: "chocolates" },
  { id: 4, name: "Noodles", emoji: "🍜", color: "from-red-500/20 to-red-600/10", slug: "noodles" },
  { id: 5, name: "Snacks", emoji: "🍿", color: "from-yellow-500/20 to-yellow-600/10", slug: "snacks" },
  { id: 6, name: "Dairy", emoji: "🥛", color: "from-cyan-500/20 to-cyan-600/10", slug: "dairy" },
];

export const Categories = () => {
  return (
    <div className="px-5">
      <h2 className="text-lg font-semibold text-foreground mb-4">Categories</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <Link
            to={`/category/${category.slug}`}
            key={category.id}
            className="flex flex-col items-center gap-2 flex-shrink-0"
          >
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg border border-white/5 hover:scale-105 transition-transform active:scale-95`}
            >
              <span className="text-2xl">{category.emoji}</span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
