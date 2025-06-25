export const ChatListItem = ({ label, onClick, isActive, isExpanded }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded-lg px-3 py-2.5 text-sm truncate transition-all
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        ${
          isActive
            ? "bg-blue-500/10 text-blue-600 font-medium"
            : "hover:bg-gray-100 text-gray-800"
        }
        ${!isExpanded && "hidden"}
      `}
      title={label}
    >
      {label}
    </button>
  );
};
