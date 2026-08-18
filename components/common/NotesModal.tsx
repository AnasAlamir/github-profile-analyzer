"use client";

import { useState, useEffect } from "react";
import { StickyNote, X, Trash2, Check } from "lucide-react";

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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative border border-slate-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-blue-600" />
            <span>Notes: <span className="text-blue-600 font-semibold">{title}</span></span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-3">
          Notes are saved in your browser and automatically loaded whenever you view this profile or repository.
        </p>

        {/* Text Area */}
        <textarea
          rows={5}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Type your notes, reminders, or observations here..."
          className="w-full p-3 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
        />

        {/* Modal Action Buttons */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleClear}
            disabled={!initialNote}
            className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Note</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center gap-1 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
