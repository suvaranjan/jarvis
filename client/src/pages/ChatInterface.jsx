import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAxios } from "../hooks/useAxios";
import ChatForm from "../components/ChatForm";
import { Loader2 } from "lucide-react";
import { useChatContext } from "../context/chatContext";

const ChatInterface = () => {
  const { chatId } = useParams();
  const { authorizedAxios } = useAxios();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const { state, dispatch } = useChatContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await authorizedAxios.get(`/chat/${chatId}/get-messages`);
        setMessages(res.data);

        dispatch({
          type: "SET_ACTIVE_CHAT",
          payload: { id: chatId, title: null },
        });
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chatId, authorizedAxios]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async ({ inputText, imageUrl }) => {
    const input = inputText?.trim();
    if (!input) return;

    const userMessage = {
      text: input,
      sender: "user",
      createdAt: new Date().toISOString(),
      ...(imageUrl && { imageUrl }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Add "thinking..." Gemini placeholder
    const thinkingMessage = {
      id: "gemini-thinking",
      text: "Thinking...",
      sender: "gemini",
      thinking: true,
    };
    setThinking(true);
    setMessages((prev) => [...prev, thinkingMessage]);

    try {
      const res = await authorizedAxios.post(`/chat/ask-to-gemini`, {
        text: input,
        imageUrl,
        chatId,
      });

      // Replace the thinking message with real reply
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== "gemini-thinking"),
        res.data.geminiMessage,
      ]);
    } catch (err) {
      console.error("Failed to send message:", err);
      // Remove thinking message if error
      setMessages((prev) => prev.filter((msg) => msg.id !== "gemini-thinking"));
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2
              className="w-12 h-12 text-gray-400 animate-spin"
              strokeWidth={1}
            />
          </div>
        ) : (
          <div className="max-w-4xl w-full mx-auto px-4 py-6 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 text-lg space-y-2 ${
                    msg.sender === "user"
                      ? "bg-gray-200 text-gray-800 max-w-[75%]"
                      : msg.thinking
                      ? "text-gray-800 animate-pulse"
                      : "text-gray-800 w-full"
                  }`}
                >
                  <div>{msg.text}</div>
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="Attached"
                      className="mt-2 rounded-md max-w-xs"
                    />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Sticky Form */}
      <div className="sticky bottom-0 bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="max-w-4xl w-full mx-auto">
          <ChatForm onSubmit={handleSubmit} disabled={thinking} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
