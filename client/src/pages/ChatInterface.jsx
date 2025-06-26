import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAxios } from "../hooks/useAxios";
import ChatForm from "../components/ChatForm";

const ChatInterface = () => {
  const { chatId } = useParams();
  const { authorizedAxios } = useAxios();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await authorizedAxios.get(`/chat/${chatId}/get-messages`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (input, imageUrl = null) => {
    if (!input.trim()) return;
    const userMessage = {
      text: input,
      sender: "user",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await authorizedAxios.post(`/chat/ask-to-gemini`, {
        text: input,
        imageUrl,
        chatId,
      });
      setMessages((prev) => [...prev, res.data.geminiMessage]);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="max-w-3xl w-full mx-auto px-4 py-6 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-full text-gray-500 animate-pulse">
              Loading chat...
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 text-md md:text-base ${
                    msg.sender === "user"
                      ? "bg-gray-200 text-gray-800 max-w-[75%]"
                      : "text-gray-800 w-full"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky Form */}
      <div className="sticky bottom-0 bg-gray-50 px-4 py-3">
        <div className="max-w-3xl w-full mx-auto">
          <ChatForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
