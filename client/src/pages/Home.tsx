import { useNavigate } from "react-router-dom";
import ChatForm from "../components/ChatForm";
import { useAxios } from "../hooks/useAxios";
import { useState } from "react";

const Home = () => {
  const { authorizedAxios } = useAxios();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ inputText, imageUrl }) => {
    const input = inputText?.trim();
    if (!input) return;

    // 🧠 Generate title from first 10 words
    const words = input.split(/\s+/).slice(0, 10);
    const generatedTitle = words.join(" ") + (words.length === 10 ? "..." : "");

    try {
      setLoading(true);
      const response = await authorizedAxios.post("/chat/create", {
        title: generatedTitle,
        userMessage: input,
        imageUrl: imageUrl || null,
      });

      navigate(`/chat/${response.data.chat._id}`);
    } catch (error) {
      console.log("Chat creation failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-semibold text-gray-900">
            Hi, I'm Jarvis
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            How can I help you today?
          </p>
        </div>

        <ChatForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default Home;
