import { Clock, Trash2 } from "lucide-react";

const mockHistory = [
  {
    id: 1,
    name: "Oat Cookies",
    brand: "Nature's Best",
    score: 35,
    scannedAt: "2 hours ago",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Lay's Classic",
    brand: "Lay's",
    score: 28,
    scannedAt: "Yesterday",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Organic Granola",
    brand: "Green Valley",
    score: 72,
    scannedAt: "2 days ago",
    image: "https://images.unsplash.com/photo-1499636136210-6598f4a9a2e0?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    name: "Energy Bar",
    brand: "FitBites",
    score: 56,
    scannedAt: "3 days ago",
    image: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=100&h=100&fit=crop",
  },
];

const getScoreColor = (score: number) => {
  if (score >= 60) return "text-score-good bg-score-good/10 border-score-good/30";
  if (score >= 40) return "text-score-medium bg-score-medium/10 border-score-medium/30";
  return "text-score-bad bg-score-bad/10 border-score-bad/30";
};

const HistoryPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-5 pt-12 pb-6 animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-muted">
            <Clock className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">History</h1>
            <p className="text-sm text-muted-foreground">Your recent scans</p>
          </div>
        </div>
      </header>

      {/* History List */}
      <div className="px-5 space-y-3">
        {mockHistory.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border/50 shadow-soft animate-fade-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.brand}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.scannedAt}</p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(item.score)}`}>
                {item.score}
              </div>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
