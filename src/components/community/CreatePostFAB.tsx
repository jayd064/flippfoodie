import { Plus } from "lucide-react";

interface CreatePostFABProps {
  onClick: () => void;
}

const CreatePostFAB = ({ onClick }: CreatePostFABProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-28 right-4 z-40 w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl hover:bg-emerald-400 transition-all active:scale-95"
      style={{
        boxShadow: "0 0 30px rgba(16,185,129,0.5)",
      }}
    >
      <Plus className="w-7 h-7 text-black" />
    </button>
  );
};

export default CreatePostFAB;
