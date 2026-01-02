import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface Post {
  id: string;
  type: "scan" | "manual";
  community: string;
  image: string;
  flag: "alert" | "review" | "safe" | "rant" | "question";
  flagLabel: string;
  title: string;
  caption: string;
  userName: string;
  userAvatar: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  score?: number;
  negativePoints?: string[];
  positivePoints?: string[];
  createdAt: Date;
  tribes?: string[];
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  votes: number;
  userVote: "up" | "down" | null;
  timeAgo: string;
  replies?: Comment[];
}

export interface Tribe {
  id: string;
  name: string;
  emoji: string;
  memberCount: number;
}

interface PostContextType {
  posts: Post[];
  tribes: Tribe[];
  addPost: (post: Omit<Post, "id" | "createdAt">) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, "id" | "timeAgo" | "votes" | "userVote">) => void;
  voteComment: (postId: string, commentId: string, vote: "up" | "down") => void;
  addTribe: (tribe: Omit<Tribe, "id" | "memberCount">) => void;
  searchPosts: (query: string) => Post[];
  filterByTribe: (tribeId: string | null) => Post[];
}

const defaultTribes: Tribe[] = [
  { id: "vegan", name: "Vegan", emoji: "🌱", memberCount: 12500 },
  { id: "gym", name: "Gym", emoji: "💪", memberCount: 8900 },
  { id: "junk", name: "Junk", emoji: "🍟", memberCount: 15600 },
  { id: "keto", name: "Keto", emoji: "🥑", memberCount: 6700 },
  { id: "sugar-free", name: "Sugar Free", emoji: "🚫", memberCount: 4200 },
  { id: "organic", name: "Organic", emoji: "🌿", memberCount: 3800 },
];

const mockPosts: Post[] = [
  {
    id: "1",
    type: "manual",
    community: "r/HealthyEating",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&h=750&fit=crop",
    flag: "alert",
    flagLabel: "Health Alert",
    title: "Lay's Magic Masala: What They Don't Tell You",
    caption: "High sodium content and MSG—this snack might taste great but here's why you should limit your intake. Breaking down the ingredients...",
    userName: "HealthHunter",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=health",
    likes: 2340,
    comments: [
      {
        id: "c1",
        userName: "HealthyEater",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=c1",
        text: "This is so eye-opening! I had no idea about the sodium levels. Going to check all my snacks now.",
        votes: 45,
        userVote: null,
        timeAgo: "2h",
        replies: [
          {
            id: "c1r1",
            userName: "NutriExpert",
            userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=c1r1",
            text: "The daily recommended sodium is about 2300mg. One serving of these chips has 170mg!",
            votes: 23,
            userVote: null,
            timeAgo: "1h",
          },
        ],
      },
      {
        id: "c2",
        userName: "ChipLover",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=c3",
        text: "Any good alternatives that taste similar but are healthier?",
        votes: 67,
        userVote: "up",
        timeAgo: "4h",
      },
    ],
    isLiked: false,
    tribes: ["junk"],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    type: "manual",
    community: "r/Amul",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=750&fit=crop",
    flag: "review",
    flagLabel: "Review",
    title: "Amul Butter vs Store Brands: The Truth",
    caption: "I tested 5 different butter brands for taste, texture, and nutritional value. The results might surprise you!",
    userName: "FoodScience",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=food",
    likes: 4521,
    comments: [],
    isLiked: true,
    tribes: ["organic"],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "3",
    type: "manual",
    community: "r/HealthyEating",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=750&fit=crop",
    flag: "safe",
    flagLabel: "Approved",
    title: "Greek Yogurt: The Perfect Protein Source",
    caption: "High protein, low sugar, and great for gut health. Here's why this should be in your daily diet!",
    userName: "NutriNinja",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nutri",
    likes: 1892,
    comments: [],
    isLiked: false,
    tribes: ["gym", "keto"],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "4",
    type: "manual",
    community: "r/JunkFood",
    image: "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=600&h=750&fit=crop",
    flag: "alert",
    flagLabel: "Health Alert",
    title: "Why Your Favorite Chips Are Addictive",
    caption: "The science behind why you can't stop at just one. Understanding the flavor engineering in processed snacks.",
    userName: "SnackScience",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=snack",
    likes: 3456,
    comments: [],
    isLiked: false,
    tribes: ["junk"],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
];

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [tribes, setTribes] = useState<Tribe[]>(defaultTribes);

  const addPost = useCallback((post: Omit<Post, "id" | "createdAt">) => {
    const newPost: Post = {
      ...post,
      id: `post_${Date.now()}`,
      createdAt: new Date(),
    };
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  const toggleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  }, []);

  const addComment = useCallback(
    (postId: string, comment: Omit<Comment, "id" | "timeAgo" | "votes" | "userVote">) => {
      const newComment: Comment = {
        ...comment,
        id: `comment_${Date.now()}`,
        timeAgo: "now",
        votes: 0,
        userVote: null,
      };
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );
    },
    []
  );

  const voteComment = useCallback(
    (postId: string, commentId: string, vote: "up" | "down") => {
      const updateVotes = (comments: Comment[]): Comment[] => {
        return comments.map((c) => {
          if (c.id === commentId) {
            const newVote = c.userVote === vote ? null : vote;
            let voteDelta = 0;
            if (c.userVote === "up") voteDelta -= 1;
            if (c.userVote === "down") voteDelta += 1;
            if (newVote === "up") voteDelta += 1;
            if (newVote === "down") voteDelta -= 1;
            return { ...c, userVote: newVote, votes: c.votes + voteDelta };
          }
          if (c.replies) {
            return { ...c, replies: updateVotes(c.replies) };
          }
          return c;
        });
      };

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, comments: updateVotes(post.comments) }
            : post
        )
      );
    },
    []
  );

  const addTribe = useCallback((tribe: Omit<Tribe, "id" | "memberCount">) => {
    const newTribe: Tribe = {
      ...tribe,
      id: tribe.name.toLowerCase().replace(/\s+/g, "-"),
      memberCount: 1,
    };
    setTribes((prev) => [...prev, newTribe]);
    return newTribe;
  }, []);

  const searchPosts = useCallback(
    (query: string) => {
      if (!query.trim()) return posts;
      const lowerQuery = query.toLowerCase();
      return posts.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerQuery) ||
          post.caption.toLowerCase().includes(lowerQuery) ||
          post.community.toLowerCase().includes(lowerQuery) ||
          post.userName.toLowerCase().includes(lowerQuery)
      );
    },
    [posts]
  );

  const filterByTribe = useCallback(
    (tribeId: string | null) => {
      if (!tribeId) return posts;
      return posts.filter((post) => post.tribes?.includes(tribeId));
    },
    [posts]
  );

  return (
    <PostContext.Provider
      value={{
        posts,
        tribes,
        addPost,
        toggleLike,
        addComment,
        voteComment,
        addTribe,
        searchPosts,
        filterByTribe,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};
