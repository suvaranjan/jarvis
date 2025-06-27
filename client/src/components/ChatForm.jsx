import { useState, useRef } from "react";
import { ArrowUp, Loader2, Plus, X } from "lucide-react";
import { useAutoResizeTextarea } from "../hooks/useAutoResizeTextarea";
import { useAxios } from "../hooks/useAxios";
import { upload } from "@imagekit/react";

const ChatForm = ({ onSubmit, loading }) => {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useAutoResizeTextarea(textareaRef, input);
  const { authorizedAxios } = useAxios();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await authorizedAxios.get("/get-imagekit-token");
      const { signature, expire, token } = res.data;

      const response = await upload({
        file,
        fileName: file.name,
        token,
        expire,
        signature,
        publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
        onProgress: (event) => {
          const percent = (event.loaded / event.total) * 100;
          setProgress(Math.round(percent));
        },
      });

      setImageUrl(response.url);
    } catch (err) {
      console.error("Image upload failed", err);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      inputText: input.trim(),
      ...(imageUrl && { imageUrl }),
    };
    onSubmit(payload);
    setInput("");
    setImageUrl(null);
  };

  const removeImage = () => {
    setImageUrl(null);
  };

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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-3">
          {!imageUrl && !isUploading && (
            <ImageUploadBtn onClick={() => fileInputRef.current?.click()} />
          )}

          {isUploading && (
            <div className="flex items-center gap-2 text-sm text-gray-600 px-3 py-1.5 bg-gray-100 rounded-full">
              <div className="relative w-3 h-3">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-0 bg-green-600 rounded-full"></div>
              </div>
              Uploading {progress}%
            </div>
          )}

          {imageUrl && (
            <div className="relative">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shadow-xs">
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-700 rounded-full p-1 shadow-md"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!input.trim() && !imageUrl}
          title="Send message"
          className={`p-2 rounded-md flex items-center transition-colors ${
            input.trim() || imageUrl
              ? "bg-black text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ArrowUp className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatForm;

function ImageUploadBtn({ onClick }) {
  return (
    <button
      type="button"
      title="Attach image"
      onClick={onClick}
      className="flex items-center gap-1 rounded-full bg-gray-100 hover:bg-gray-200 px-3 py-1.5 text-gray-700 transition-colors"
    >
      <Plus className="w-5 h-5" />
      <span className="text-sm">Add Image</span>
    </button>
  );
}
