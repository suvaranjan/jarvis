import { AlignLeft } from "lucide-react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { useEffect, useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

const SidebarLayout = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const location = useLocation();
  const navigate = useNavigate();
  const { chatId } = useParams();

  const [chats] = useState([
    { id: "1", title: "Getting started with AI" },
    {
      id: "2",
      title: "Project ideas discussion for new startups with the help of AI",
    },
    { id: "3", title: "Technical support for new startups" },
    { id: "4", title: "Latest AI models and their applications" },
    {
      id: "5",
      title: "Ethical considerations in AI development and deployment",
    },
  ]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location.pathname, isMobile]);

  // Prevent body scroll on mobile when sidebar is open
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isSidebarOpen ? "hidden" : "";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isSidebarOpen, isMobile]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const startNewChat = () => {
    navigate(`/`);
    if (isMobile) setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-inter text-gray-800">
      <Sidebar
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        chats={chats}
        // currentChatId - if any chat is open in sidebar chatlist, that chatItem needs to active.
        currentChatId={chatId}
        onNewChat={startNewChat}
        onNavigate={(chatId) => {
          navigate(`/chat/${chatId}`);
          if (isMobile) setIsSidebarOpen(false);
        }}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {isMobile && !isSidebarOpen && (
          <header className="flex h-14 items-center gap-2 px-4 bg-white border-b border-gray-200">
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-gray-100 -ml-1 transition-colors"
              title="Open sidebar"
            >
              <AlignLeft size={24} className="text-gray-500" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Gemini</h1>
          </header>
        )}
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout;
