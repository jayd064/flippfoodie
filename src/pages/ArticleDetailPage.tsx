import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Flame, MessageCircle, Share2, Skull, Shield, ExternalLink, ThumbsUp } from "lucide-react";
import { usePosts } from "@/contexts/PostContext";
import { toast } from "sonner";

interface ArticleContent {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  author: string;
  readTime: string;
  content: string[];
  villains: Array<{ name: string; emoji: string; roast: string }>;
  heroSwap: {
    name: string;
    brand: string;
    score: number;
    image: string;
    reason: string;
    affiliateUrl: string;
  };
}

const articles: ArticleContent[] = [
  {
    id: 1,
    slug: "brown-bread-scam",
    title: "Is Brown Bread a Scam?",
    subtitle: "The truth about whole wheat that manufacturers don't want you to know",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    tag: "Hot Debate",
    author: "Dr. Nutritionist",
    readTime: "5 min read",
    content: [
      "You've been told brown bread is healthier than white bread. But here's the shocking truth: most 'brown bread' on Indian store shelves is actually white bread in disguise.",
      "**The Caramel Color Trick**: Many brands add caramel coloring to white maida flour to give it a brown appearance. Check the ingredients list—if 'refined wheat flour' or 'maida' appears before 'whole wheat', you're eating glorified white bread.",
      "**The 'Multigrain' Myth**: Just because a bread says 'multigrain' doesn't mean it's healthy. Those 5-6 grains listed? Often present in negligible amounts. The base is still refined flour.",
      "**What to Look For**: True whole wheat bread should list 'whole wheat flour' or 'atta' as the FIRST ingredient. The fiber content should be at least 3g per serving.",
      "**The Sugar Surprise**: Many brown breads contain added sugar or honey to make them taste better. Some have as much as 5g of sugar per 2 slices!",
    ],
    villains: [
      { name: "Refined Flour (Maida)", emoji: "🍞", roast: "The imposter pretending to be healthy" },
      { name: "Caramel Color", emoji: "🎨", roast: "The makeup that hides the truth" },
      { name: "Added Sugar", emoji: "🍬", roast: "Hidden sweetness, hidden calories" },
      { name: "Preservatives", emoji: "🧪", roast: "Keeping bread 'fresh' unnaturally" },
    ],
    heroSwap: {
      name: "100% Whole Wheat Bread",
      brand: "Nature's Own",
      score: 82,
      image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=200&h=200&fit=crop",
      reason: "100% whole wheat flour, no added colors, only 1g sugar per slice",
      affiliateUrl: "https://blinkit.com",
    },
  },
  {
    id: 2,
    slug: "sugar-free-healthy",
    title: "Sugar-Free = Healthy?",
    subtitle: "What manufacturers hide behind 'sugar-free' labels",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80",
    tag: "Trending",
    author: "Health Detective",
    readTime: "4 min read",
    content: [
      "The 'sugar-free' label has become a marketing goldmine. But does sugar-free actually mean healthy? Let's investigate.",
      "**The Artificial Sweetener Problem**: Most sugar-free products replace sugar with artificial sweeteners like aspartame, sucralose, or saccharin. While they're calorie-free, studies suggest they may disrupt gut bacteria and increase cravings.",
      "**Sugar Alcohols**: Products labeled 'sugar-free' often contain sugar alcohols like maltitol or sorbitol. They still have calories and can cause digestive issues in large amounts.",
      "**The 'No Added Sugar' Loophole**: This doesn't mean the product is low in sugar! Fruit juices labeled 'no added sugar' can still contain 20+ grams of natural sugar per serving.",
      "**Hidden Names for Sugar**: There are 56+ names for sugar. Just because 'sugar' isn't listed doesn't mean it's not there. Look for: dextrose, maltose, corn syrup, fruit concentrate.",
    ],
    villains: [
      { name: "Aspartame", emoji: "🧪", roast: "Sweet but controversial" },
      { name: "Maltitol", emoji: "💊", roast: "Sugar alcohol causing tummy troubles" },
      { name: "High Fructose Corn Syrup", emoji: "🌽", roast: "Cheap sweetener, expensive health costs" },
      { name: "Sucralose", emoji: "⚗️", roast: "600x sweeter than sugar, but at what cost?" },
    ],
    heroSwap: {
      name: "Stevia Sweetened Jam",
      brand: "Nature's Path",
      score: 78,
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&h=200&fit=crop",
      reason: "Natural stevia sweetener, no artificial additives, 2g sugar from real fruit",
      affiliateUrl: "https://zepto.co",
    },
  },
  {
    id: 3,
    slug: "protein-bar-reality",
    title: "Protein Bar Reality Check",
    subtitle: "Are they worth the hype and the price?",
    image: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=800&q=80",
    tag: "Investigation",
    author: "Fitness Guru",
    readTime: "6 min read",
    content: [
      "Protein bars have become the go-to snack for fitness enthusiasts. But are they really the healthy choice they claim to be?",
      "**The Sugar Content**: Many protein bars contain 15-25g of sugar—that's more than a chocolate bar! The protein is often overshadowed by the sugar load.",
      "**Protein Quality Matters**: Not all protein is equal. Some bars use low-quality protein blends or collagen (which lacks essential amino acids). Look for whey, casein, or pea protein.",
      "**The Fiber Trick**: Bars advertise 'high fiber' but use isolated fiber like IMO (isomalto-oligosaccharide) which may not provide the same benefits as natural fiber.",
      "**Cost vs. Value**: At ₹150-300 per bar, you're paying premium prices. A boiled egg (6g protein), Greek yogurt (15g protein), or handful of almonds (6g protein) are cheaper alternatives.",
      "**The Ultra-Processed Reality**: Most protein bars are ultra-processed foods. Despite the 'healthy' marketing, they contain preservatives, stabilizers, and flavor enhancers.",
    ],
    villains: [
      { name: "Sugar Alcohols", emoji: "🍭", roast: "Bloating and digestive drama" },
      { name: "Palm Oil", emoji: "🌴", roast: "Saturated fat in disguise" },
      { name: "Soy Protein Isolate", emoji: "🫘", roast: "Cheap protein, questionable processing" },
      { name: "Artificial Flavors", emoji: "🎭", roast: "Making chemicals taste like chocolate" },
    ],
    heroSwap: {
      name: "Homemade Protein Balls",
      brand: "DIY Recipe",
      score: 92,
      image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200&h=200&fit=crop",
      reason: "Dates, oats, whey protein, peanut butter—no additives, full control over ingredients",
      affiliateUrl: "https://blinkit.com",
    },
  },
];

const ArticleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { posts } = usePosts();
  
  const article = articles.find((a) => a.slug === slug);
  
  // Find related discussion in community
  const relatedPost = posts.find((p) => 
    p.title.toLowerCase().includes(article?.title.toLowerCase().split(" ")[0] || "")
  );

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article not found</h1>
          <Link to="/" className="text-primary">Go back home</Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.subtitle,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleHeroSwap = () => {
    const platform = article.heroSwap.affiliateUrl.includes("blinkit") ? "Blinkit" : "Zepto";
    toast.success(`Redirecting to ${platform}...`, {
      description: `Opening ${article.heroSwap.name}`,
      duration: 2000,
    });
    setTimeout(() => {
      window.open(article.heroSwap.affiliateUrl, "_blank");
    }, 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-score-good text-white";
    if (score >= 40) return "bg-score-okay text-white";
    return "bg-score-bad text-white";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32">
      {/* Hero Image */}
      <div className="relative h-[40vh]">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-5 p-2 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute top-12 right-5 p-2 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 hover:bg-black/70 transition-colors"
        >
          <Share2 className="w-5 h-5 text-white" />
        </button>

        {/* Tag */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 bg-destructive/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Flame className="w-3.5 h-3.5 text-destructive-foreground" />
            <span className="text-xs font-semibold text-destructive-foreground">
              {article.tag}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h1 className="text-2xl font-bold text-white mb-2">{article.title}</h1>
          <p className="text-white/70 text-sm mb-3">{article.subtitle}</p>
          <div className="flex items-center gap-3 text-white/50 text-xs">
            <span>By {article.author}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 space-y-6">
        {article.content.map((paragraph, index) => (
          <p
            key={index}
            className="text-foreground/90 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: paragraph
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>')
            }}
          />
        ))}
      </div>

      {/* Villains Section */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-2 mb-4">
          <Skull className="w-5 h-5 text-destructive" />
          <h2 className="text-lg font-semibold text-foreground">The Villains</h2>
        </div>
        <div className="space-y-3">
          {article.villains.map((villain, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-destructive/10 rounded-xl border border-destructive/20"
            >
              <span className="text-2xl">{villain.emoji}</span>
              <div className="flex-1">
                <p className="font-medium text-foreground">{villain.name}</p>
                <p className="text-xs text-muted-foreground">{villain.roast}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Swap Section */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-score-good" />
          <h2 className="text-lg font-semibold text-foreground">The Hero Swap</h2>
        </div>
        <div className="bg-score-good/10 rounded-2xl p-4 border border-score-good/20">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
              <img
                src={article.heroSwap.image}
                alt={article.heroSwap.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{article.heroSwap.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{article.heroSwap.brand}</p>
              <p className="text-xs text-score-good mb-3">{article.heroSwap.reason}</p>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-lg font-bold ${getScoreColor(article.heroSwap.score)}`}>
                  {article.heroSwap.score}
                </div>
                <button
                  onClick={handleHeroSwap}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <span>Buy Now</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Discussion Link */}
      <div className="px-5 py-6">
        <Link
          to="/feed"
          className="flex items-center justify-between p-4 bg-card/50 rounded-xl border border-border/30"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Join the Discussion</p>
              <p className="text-xs text-muted-foreground">
                {relatedPost ? `${relatedPost.comments.length} comments` : "Share your thoughts with the community"}
              </p>
            </div>
          </div>
          <ThumbsUp className="w-5 h-5 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
