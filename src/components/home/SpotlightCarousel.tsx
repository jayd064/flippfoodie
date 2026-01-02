import { useState } from "react";
import { ChevronRight, Flame } from "lucide-react";

const spotlightItems = [
  {
    id: 1,
    title: "Is Brown Bread a Scam?",
    subtitle: "The truth about whole wheat",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    tag: "Hot Debate",
    comments: 342,
  },
  {
    id: 2,
    title: "Sugar-Free = Healthy?",
    subtitle: "What manufacturers hide",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80",
    tag: "Trending",
    comments: 189,
  },
  {
    id: 3,
    title: "Protein Bar Reality Check",
    subtitle: "Are they worth the hype?",
    image: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=800&q=80",
    tag: "Investigation",
    comments: 256,
  },
];

export const SpotlightCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {spotlightItems.map((item, index) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-[85%] snap-center first:ml-5 last:mr-5"
            onClick={() => setActiveIndex(index)}
          >
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xl">
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              {/* Tag */}
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-1.5 bg-destructive/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Flame className="w-3.5 h-3.5 text-destructive-foreground" />
                  <span className="text-xs font-semibold text-destructive-foreground">
                    {item.tag}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-xl font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-white/70 text-sm mb-3">{item.subtitle}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">
                    {item.comments} comments
                  </span>
                  <div className="flex items-center gap-1 text-primary text-sm font-medium">
                    <span>Read</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Indicators */}
      <div className="flex justify-center gap-1.5 mt-2">
        {spotlightItems.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
