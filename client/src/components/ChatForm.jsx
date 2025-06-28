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
  const [abortController, setAbortController] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const { authorizedAxios } = useAxios();

  useAutoResizeTextarea(textareaRef, input);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await authorizedAxios.get("/get-imagekit-token");
      const { signature, expire, token } = res.data;

      const controller = new AbortController();
      setAbortController(controller);

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
        abortSignal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setImageUrl(response.url);
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsUploading(false);
      setProgress(0);
      setAbortController(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      inputText: input.trim(),
      ...(imageUrl && { imageUrl }),
    });
    setInput("");
    setImageUrl(null);
  };

  const cancelUpload = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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
            <ImageUploadProgress
              progress={progress}
              isHovering={isHovering}
              onClick={cancelUpload}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            />
          )}

          {imageUrl && (
            <UploadedImagePreview
              imageUrl={imageUrl}
              onRemove={() => setImageUrl(null)}
            />
          )}
        </div>

        <SubmitButton loading={loading} disabled={!input.trim() && !imageUrl} />
      </div>
    </form>
  );
};

export default ChatForm;

const ImageUploadBtn = ({ onClick }) => (
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

const ImageUploadProgress = ({ progress, isHovering, onClick }) => (
  <div
    className="relative w-full max-w-xs rounded-full text-sm cursor-pointer bg-gray-100 overflow-hidden"
    onClick={onClick}
  >
    <div
      className="absolute left-0 top-0 h-full transition-colors duration-300 ease-out"
      style={{
        width: `${progress}%`,
        backgroundColor: isHovering ? "#fca5a5" : "#86efac",
      }}
    />
    <div className="relative z-10 flex items-center justify-between px-3 py-1.5">
      <span className="mr-1">{isHovering ? "Cancel upload" : "Uploading"}</span>
      <span className="font-medium">{progress}%</span>
    </div>
  </div>
);

const UploadedImagePreview = ({ imageUrl, onRemove }) => (
  <div className="relative">
    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shadow-xs">
      <img
        src={imageUrl}
        alt="Uploaded"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
    <button
      type="button"
      onClick={onRemove}
      className="absolute -top-2 -right-2 bg-red-700 rounded-full p-1 shadow-md"
    >
      <X className="w-4 h-4 text-white" />
    </button>
  </div>
);

const SubmitButton = ({ loading, disabled }) => (
  <button
    type="submit"
    disabled={disabled}
    title="Send message"
    className={`p-2 rounded-md flex items-center transition-colors ${
      disabled
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-black text-white hover:bg-blue-600"
    }`}
  >
    {loading ? (
      <Loader2 className="w-5 h-5 animate-spin" />
    ) : (
      <ArrowUp className="w-5 h-5" />
    )}
  </button>
);
