export const initialChatState = {
  chats: [],
  activeChat: null, // replaces activeChatId and activeChatTitle
  user: null,
};

export const chatReducer = (state, action) => {
  switch (action.type) {
    case "SET_CHATS":
      return { ...state, chats: action.payload };

    case "SET_ACTIVE_CHAT":
      return { ...state, activeChat: action.payload }; // expects { id, title }

    case "DELETE_CHAT":
      return {
        ...state,
        chats: state.chats.filter((chat) => chat.id !== action.payload),
        activeChat:
          state.activeChat?.id === action.payload ? null : state.activeChat,
      };

    case "ADD_CHAT":
      return {
        ...state,
        chats: [action.payload, ...state.chats],
      };

    case "EDIT_CHAT":
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.payload.id
            ? { ...chat, title: action.payload.title }
            : chat
        ),
        activeChat:
          state.activeChat?.id === action.payload.id
            ? { ...state.activeChat, title: action.payload.title }
            : state.activeChat,
      };

    case "SET_USER":
      return { ...state, user: action.payload };

    default:
      return state;
  }
};
