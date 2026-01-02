import { useState } from "react";
import { X, ChevronUp, ChevronDown, Send } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  votes: number;
  userVote: "up" | "down" | null;
  timeAgo: string;
  replies?: Comment[];
}

interface CommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle: string;
  comments: Comment[];
  onVote: (commentId: string, vote: "up" | "down") => void;
}

const CommentItem = ({
  comment,
  onVote,
  depth = 0,
}: {
  comment: Comment;
  onVote: (id: string, vote: "up" | "down") => void;
  depth?: number;
}) => {
  const [showReplies, setShowReplies] = useState(depth < 1);

  return (
    <div className={cn("relative", depth > 0 && "ml-8 mt-3")}>
      {/* Thread line for replies */}
      {depth > 0 && (
        <div className="absolute left-[-16px] top-0 bottom-0 w-px bg-white/10" />
      )}

      <div className="flex gap-3">
        {/* Vote arrows */}
        <div className="flex flex-col items-center gap-0.5 pt-1">
          <button
            onClick={() => onVote(comment.id, "up")}
            className={cn(
              "p-1 rounded transition-colors",
              comment.userVote === "up"
                ? "text-emerald-400"
                : "text-zinc-500 hover:text-emerald-400"
            )}
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <span
            className={cn(
              "text-xs font-medium",
              comment.userVote === "up"
                ? "text-emerald-400"
                : comment.userVote === "down"
                ? "text-red-400"
                : "text-zinc-400"
            )}
          >
            {comment.votes +
              (comment.userVote === "up" ? 1 : comment.userVote === "down" ? -1 : 0)}
          </span>
          <button
            onClick={() => onVote(comment.id, "down")}
            className={cn(
              "p-1 rounded transition-colors",
              comment.userVote === "down"
                ? "text-red-400"
                : "text-zinc-500 hover:text-red-400"
            )}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Comment content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <img
              src={comment.userAvatar}
              alt={comment.userName}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-medium text-zinc-400">
              {comment.userName}
            </span>
            <span className="text-xs text-zinc-600">• {comment.timeAgo}</span>
          </div>
          <p className="text-sm text-white leading-relaxed">{comment.text}</p>

          {comment.replies && comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {showReplies ? "Hide" : "Show"} {comment.replies.length} replies
            </button>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {showReplies && comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          onVote={onVote}
          depth={depth + 1}
        />
      ))}
    </div>
  );
};

const CommentDrawer = ({
  isOpen,
  onClose,
  postTitle,
  comments,
  onVote,
}: CommentDrawerProps) => {
  const [newComment, setNewComment] = useState("");

  const totalComments = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[70vh] bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-0"
      >
        <SheetHeader className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-md px-6 py-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white font-bold">
              Discussion ({totalComments})
            </SheetTitle>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-sm text-zinc-500 text-left truncate">{postTitle}</p>
        </SheetHeader>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 pb-24">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onVote={onVote} />
          ))}
        </div>

        {/* Input Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/10">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 h-12 px-4 bg-[#151515] border border-white/10 rounded-full text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
            />
            <button className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center hover:bg-emerald-400 transition-colors">
              <Send className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CommentDrawer;
