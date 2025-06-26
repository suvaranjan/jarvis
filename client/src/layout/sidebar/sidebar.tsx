import { UserButton } from "@clerk/clerk-react";
import { SidebarButton } from "./sidebarButton";
import { MailPlus, AlignLeft, Search, X } from "lucide-react";
import { ChatListItem } from "./chatListItem";
import { useNavigate } from "react-router-dom";

export const Sidebar = ({
  isMobile,
  isOpen,
  onClose,
  chats,
  currentChatId,
  onNewChat,
  onNavigate,
}) => {
  const navigate = useNavigate();
  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          bg-white border-r border-gray-200 flex flex-col shrink-0 z-50
          transition-all duration-200 ease-out
          ${
            isMobile
              ? "fixed top-0 left-0 h-full w-72"
              : "relative h-full min-h-screen"
          }
          ${
            isMobile
              ? isOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : isOpen
              ? "w-72"
              : "w-16"
          }
        `}
      >
        {/* Header */}
        <div
          className={`p-3 flex items-center border-b border-gray-200 ${
            isOpen ? "justify-between" : "justify-center"
          }`}
        >
          {isOpen && (
            <div className="flex items-center gap-3 overflow-hidden transition-all duration-200">
              <h2 className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                Gemini
              </h2>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <X size={24} className="text-gray-500" />
            ) : (
              <AlignLeft size={24} className="text-gray-500" />
            )}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-2 space-y-1">
            <SidebarButton
              icon={MailPlus}
              label="New Chat"
              onClick={onNewChat}
              isExpanded={isOpen}
            />
            <SidebarButton
              icon={Search}
              label="Search"
              onClick={() => navigate("/test")}
              isExpanded={isOpen}
            />
          </div>

          {/* Chat List */}
          <div
            className={`flex-1 overflow-y-auto py-2 px-1 transition-opacity duration-200 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            {isOpen && (
              <>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Recent chats
                </h3>
                <nav className="space-y-1 px-1">
                  {chats.map((chat) => (
                    <ChatListItem
                      key={chat.chatId}
                      label={chat.title}
                      onClick={() => onNavigate(chat.id)}
                      isActive={currentChatId === chat.id}
                      isExpanded={isOpen}
                    />
                  ))}
                </nav>
              </>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-2 border-t border-gray-200">
          <div
            className={`
              flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer
              ${isOpen ? "gap-3 px-3" : "justify-center"}
            `}
          >
            <UserButton />
            {isOpen && (
              <span className="text-sm text-gray-700 whitespace-nowrap">
                Profile
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
