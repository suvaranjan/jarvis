import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Search,
  PanelRight,
  PanelLeft,
  User,
  Settings,
  MessageSquarePlus,
} from "lucide-react";
import SidebarNav from "./SidebarNav";
import ChatItem from "./ChatItem";
import { useAxios } from "../../hooks/useAxios";
import EditChatTitle from "../../components/EditChatTitle";
import { useChatContext } from "../../context/chatContext";
import SearchChats from "../../components/SearchChats";
import { UserButton, useUser } from "@clerk/clerk-react";

function RootLayout() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { authorizedAxios } = useAxios();
  const [showTitleEditForm, setShowTitleEditForm] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [chatEditData, setChatEditData] = useState({});
  const navigate = useNavigate();
  const { state, dispatch } = useChatContext();
  const chats = state.chats;
  const { user } = useUser();
  console.log(user);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsExpanded(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await authorizedAxios.get("/chat/list");
        dispatch({ type: "SET_CHATS", payload: res.data });
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchChats();
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleChatDelete = async (id) => {
    try {
      await authorizedAxios.delete(`/chat/${id}`);
      dispatch({ type: "DELETE_CHAT", payload: id });
      if (state.activeChat.id === id) {
        navigate("/");
      }
      alert("chat deleted");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChatTitleEdit = async ({ id, title }) => {
    setChatEditData({ id, title });
    setShowTitleEditForm(true);
  };

  const confirmEditForm = async (data) => {
    try {
      await authorizedAxios.put(`/chat/${data.id}`, { title: data.title });
      dispatch({ type: "EDIT_CHAT", payload: data });
      if (state.activeChatId === data.id) {
        dispatch({
          type: "SET_ACTIVE_CHAT",
          payload: { id: data.id, title: data.title },
        });
      }
      alert("Chat Saved");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="flex h-screen bg-white text-black">
        {/* Sidebar */}
        <div
          className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out 
        ${isExpanded ? "w-64" : "w-16"} 
        ${isMobile && !isExpanded ? "hidden" : ""} 
        ${isMobile ? "fixed inset-y-0 z-50 shadow-lg" : "relative"}`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-[14px] border-b border-gray-200">
            {isExpanded && (
              <span className="text-lg font-semibold whitespace-nowrap">
                Jarvis
              </span>
            )}
            <button
              onClick={toggleSidebar}
              className={`ml-auto p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 ${
                isMobile ? "block" : "hidden md:block"
              }`}
            >
              {isExpanded ? (
                <PanelRight className="h-6 w-6" />
              ) : (
                <PanelLeft className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Navmenu - New Chat and Search */}
          <div className="px-2 mt-2">
            <SidebarNav
              icon={MessageSquarePlus}
              label="New chat"
              isExpanded={isExpanded}
              onClick={() => {
                navigate("/");
                setIsExpanded(false);
              }}
            />
            <SidebarNav
              icon={Search}
              label="Search"
              isExpanded={isExpanded}
              onClick={() => {
                setShowSearchModal(!showSearchModal);
                setIsExpanded(false);
              }}
            />
          </div>

          {/* Chat History */}
          {isExpanded && chats.length > 0 && (
            <div className="overflow-y-auto h-[calc(100%-180px)] px-2 mt-3">
              <h2 className="text-xs font-semibold text-gray-500 tracking-wide uppercase mb-2 px-1">
                Recent Chats
              </h2>
              {chats.map((chat) => (
                <ChatItem
                  id={chat.id}
                  key={chat.id}
                  title={chat.title}
                  onEdit={handleChatTitleEdit}
                  onDelete={handleChatDelete}
                  closeSidebar={() => setIsExpanded(false)}
                />
              ))}
            </div>
          )}

          {/* User Profile */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-white ${
              isExpanded ? "flex items-center" : "flex justify-center"
            }`}
          >
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "35px",
                    height: "35px",
                  },
                },
              }}
            />

            {isExpanded && (
              <div className="ml-3 overflow-hidden">
                <div className="text-sm font-medium whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {user.fullName ? user.fullName : "unknown"}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {user.primaryEmailAddress.emailAddress}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobile && isExpanded && (
          <div
            className="fixed inset-0 bg-white/40 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}
        >
          <TopNav toggleSidebar={toggleSidebar} />
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
      {showTitleEditForm && (
        <EditChatTitle
          isOpen={showTitleEditForm}
          setIsOpen={setShowTitleEditForm}
          initialData={chatEditData}
          onSave={confirmEditForm}
        />
      )}
      {showSearchModal && (
        <SearchChats
          isOpen={showSearchModal}
          setIsOpen={setShowSearchModal}
          chats={state.chats}
        />
      )}
    </>
  );
}

export default RootLayout;

const TopNav = ({ toggleSidebar }) => {
  return (
    <div className="relative flex h-15 items-center justify-center bg-white border-b border-gray-200">
      <button
        onClick={toggleSidebar}
        className="absolute left-4 md:hidden p-2"
        title="Toggle sidebar"
      >
        <PanelLeft className="h-6 w-6 text-gray-700" />
      </button>

      {/* <div className="text-base font-medium text-gray-800">chat_name</div> */}

      <button className="absolute right-4 p-2" title="Settings">
        <Settings className="h-5 w-5 text-gray-700" />
      </button>
    </div>
  );
};
