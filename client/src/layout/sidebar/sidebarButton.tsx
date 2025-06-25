export const SidebarButton = ({
  icon: Icon,
  label,
  onClick,
  isExpanded = true,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center w-full rounded-lg px-3 py-2.5
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        hover:bg-gray-100 text-gray-700
        ${isExpanded ? "justify-start gap-3" : "justify-center"}
        ${className}
      `}
      title={!isExpanded ? label : undefined}
    >
      <Icon size={24} className="shrink-0 text-gray-500" />
      {isExpanded && (
        <span className="text-sm font-medium truncate">{label}</span>
      )}
    </button>
  );
};
