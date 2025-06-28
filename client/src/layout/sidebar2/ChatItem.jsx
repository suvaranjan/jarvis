import { useState, useRef, useEffect } from "react";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmExample from "../../components/ConfirmExample";
import { useChatContext } from "../../context/chatContext";

function ChatItem({ id, title, onEdit, onDelete, closeSidebar }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const menuRef = useRef(null);
  const { state, dispatch } = useChatContext();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEllipsisClick = (e) => {
    e.stopPropagation(); // Stop event from bubbling to parent
    setShowMenu((prev) => !prev);
  };

  return (
    <>
      <div className="relative group">
        <div
          className={`p-3 my-1 rounded-lg text-gray-800 transition duration-200 cursor-pointer flex justify-between items-center ${
            state.activeChat?.id === id ? "bg-gray-100" : "hover:bg-gray-100"
          }`}
          onClick={() => {
            navigate(`/chat/${id}`);
            dispatch({ type: "SET_ACTIVE_CHAT", payload: { id, title } });
            closeSidebar();
          }}
        >
          <span className="truncate">{title}</span>
          <button
            onClick={handleEllipsisClick}
            className="ml-2 p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          >
            <Ellipsis className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {showMenu && (
          <div
            ref={menuRef}
            className="absolute right-2 top-10 z-10 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit({ id, title });
              }}
              className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-sm"
            >
              <Pencil className="w-4 h-4 mr-2 text-gray-600" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="flex items-center w-full px-4 py-2 hover:bg-red-50 text-sm text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2 text-red-500" />
              Delete
            </button>
          </div>
        )}
      </div>
      {showForm && <ConfirmExample isOpen={showForm} setIsOpen={setShowForm} />}
    </>
  );
}

export default ChatItem;
