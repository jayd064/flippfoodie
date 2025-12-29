interface HealthScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export const HealthScore = ({ score, size = "lg" }: HealthScoreProps) => {
  const getScoreClass = () => {
    if (score >= 60) return "score-circle-good text-score-good";
    if (score >= 40) return "score-circle-medium text-score-medium";
    return "score-circle-bad text-score-bad";
  };

  const getLabel = () => {
    if (score >= 60) return "Good";
    if (score >= 40) return "Moderate";
    return "Poor";
  };

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const textSizes = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`score-circle ${getScoreClass()} ${sizeClasses[size]} animate-scale-in`}>
        <div className="flex flex-col items-center">
          <span className={`${textSizes[size]} font-bold`}>{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold ${getScoreClass().split(' ')[1]}`}>
        {getLabel()}
      </span>
    </div>
  );
};
