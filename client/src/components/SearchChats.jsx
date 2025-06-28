import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { Search, Frown } from "lucide-react";

export default function SearchChats({ isOpen, setIsOpen, chats = [] }) {
  const [query, setQuery] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus and reset input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setFilteredChats(chats);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen, chats]);

  // Update filtered list as user types
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFilteredChats(chats);
    } else {
      const results = chats
        .filter((chat) => chat.title.toLowerCase().includes(q))
        .sort(
          (a, b) =>
            a.title.toLowerCase().indexOf(q) - b.title.toLowerCase().indexOf(q)
        );
      setFilteredChats(results);
    }
  }, [query, chats]);

  const handleSelectChat = (id) => {
    navigate(`/chat/${id}`);
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Search Chats"
      width="max-w-xl"
    >
      <div className="flex flex-col gap-4 p-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search chats"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:ring-none outline-none transition-all text-sm text-gray-800 placeholder-gray-400"
          />
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Frown className="h-10 w-10 mb-2 stroke-1" />
              <p className="text-sm">No matching chats found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredChats.map((chat) => (
                <li key={chat.id}>
                  <button
                    onClick={() => handleSelectChat(chat.id)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 active:bg-gray-100 transition-colors text-gray-700 flex items-center gap-3 rounded-md"
                  >
                    <span className="flex-1 truncate">{chat.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
