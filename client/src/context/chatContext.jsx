// src/context/chatContext.jsx
import { createContext, useContext, useReducer } from "react";
import { chatReducer, initialChatState } from "./chatReducer";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook
export const useChatContext = () => useContext(ChatContext);
