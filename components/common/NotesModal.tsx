"use client";

import { useState, useEffect } from "react";

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialNote: string;
  onSave: (note: string) => void;
}

export default function NotesModal({
  isOpen,
  onClose,
  title,
  initialNote,
  onSave,
}: NotesModalProps) {
  const [noteText, setNoteText] = useState(initialNote);

  useEffect(() => {
    setNoteText(initialNote);
  }, [initialNote, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(noteText);
    onClose();
  };

  const handleClear = () => {
    onSave("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl relative border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">
            📝 Notes: <span className="text-blue-600">{title}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-3">
          Notes are saved in your browser and automatically loaded whenever you view this profile or repository.
        </p>

        {/* Text Area */}
        <textarea
          rows={5}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Type your notes, reminders, or observations here..."
          className="w-full p-3 border border-gray-300 rounded text-xs text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Modal Action Buttons */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleClear}
            disabled={!initialNote}
            className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded border border-red-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Clear Note
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
