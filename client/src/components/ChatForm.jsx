import { useState, useRef, useEffect } from "react";
import { ArrowUp, Plus } from "lucide-react";

const MAX_TEXTAREA_HEIGHT = 200;

const ChatForm = ({ onSubmit }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(input);
    setInput("");
  };

  const handleImageSelect = () => {
    alert("Image picker triggered (to be implemented)");
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.overflowY = "hidden";

      const newHeight = Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT);
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY =
        textarea.scrollHeight > MAX_TEXTAREA_HEIGHT ? "auto" : "hidden";
    }
  }, [input]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm p-4 space-y-3"
    >
      <div className="rounded-md bg-white px-3 py-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          rows={2}
          className="w-full resize-none bg-transparent text-gray-800 placeholder-gray-400 outline-none text-base border-none overflow-hidden"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </div>

      <div className="flex justify-between items-center px-1">
        <button
          type="button"
          onClick={handleImageSelect}
          title="Attach image"
          className="flex items-center gap-1 rounded-md bg-gray-100 hover:bg-gray-200 px-3 py-1.5 text-gray-700"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm">Add Image</span>
        </button>

        <button
          type="submit"
          disabled={!input.trim()}
          title="Send message"
          className={`p-2 rounded-md flex items-center transition-colors ${
            input.trim()
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default ChatForm;
