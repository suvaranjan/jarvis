import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Send } from "lucide-react";

const Home = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newChatId = Date.now().toString();
    navigate(`/chat/${newChatId}`);
  };

  return (
    <div className="flex h-full w-full items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-3xl font-semibold text-gray-900">
            Hi, I'm Jarvis
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            How can I help you today?
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative bg-white border border-gray-200 rounded-2xl shadow-sm p-4 transition-all"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            rows={4}
            className="w-full resize-none bg-transparent text-gray-800 placeholder-gray-400 text-base focus:outline-none border-none"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            title="Send message"
            aria-label="Send message"
            className={`absolute bottom-4 right-4 p-2 rounded-full transition-colors ${
              input.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
