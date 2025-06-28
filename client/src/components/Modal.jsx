import { X } from "lucide-react";

function Modal({ isOpen, onClose, title, children, width = "max-w-md" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`bg-white rounded-xl shadow-lg w-full ${width} mx-4 relative`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 shadow-xs">
          <h2 className="text-lg font-medium">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
