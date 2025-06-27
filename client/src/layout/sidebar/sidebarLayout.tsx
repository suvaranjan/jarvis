import { AlignLeft } from "lucide-react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { useEffect, useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useAxios } from "../../hooks/useAxios";

const SidebarLayout = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [chats, setChats] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { authorizedAxios } = useAxios();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await authorizedAxios.get("/chat/list");
        console.log(res.data);

        setChats(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location.pathname, isMobile]);

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
        currentChatId={chatId}
        onNewChat={startNewChat}
        onNavigate={(chatId) => {
          navigate(`/chat/${chatId}`);
          if (isMobile) setIsSidebarOpen(false);
        }}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {isMobile && !isSidebarOpen && (
          <header className="flex h-14 items-center gap-2 px-4 bg-white border-b border-gray-200">
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-gray-100 -ml-1 transition-colors"
              title="Open sidebar"
            >
              <AlignLeft size={24} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Jarvis</h1>
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
