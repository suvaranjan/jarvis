import React, { useState } from "react";
import Modal from "./Modal";

export default function ConfirmExample({ isOpen, setIsOpen }) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Are you sure?"
      >
        <p>This action cannot be undone.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // handle delete
              setIsOpen(false);
            }}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
