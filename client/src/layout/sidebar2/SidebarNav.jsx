function SidebarNav({ icon: Icon, label, isExpanded, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer ${
        isExpanded ? "justify-start" : "justify-center"
      }`}
    >
      <Icon className="h-6 w-6 flex-shrink-0 text-gray-700" />
      {isExpanded && (
        <span className="ml-3 whitespace-nowrap overflow-hidden overflow-ellipsis">
          {label}
        </span>
      )}
    </button>
  );
}

export default SidebarNav;
