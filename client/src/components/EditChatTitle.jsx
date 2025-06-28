import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";

export default function EditChatTitle({
  isOpen,
  setIsOpen,
  initialData = { title: "", id: "" },
  onSave,
}) {
  const [data, setData] = useState(initialData);
  const inputRef = useRef(null);

  // Reset input & focus when modal opens
  useEffect(() => {
    if (isOpen) {
      setData(initialData);
      setTimeout(() => inputRef.current?.focus(), 0); // ensure it runs after modal is mounted
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.title.trim()) {
      onSave({ ...data, title: data.title.trim() });
      setIsOpen(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Edit Chat Title"
    >
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={data.title}
          onChange={(e) =>
            setData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-0"
          placeholder="Enter chat title"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
