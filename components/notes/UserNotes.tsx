"use client";

import { useState, useEffect } from "react";
import {
  getAllProfileNotes,
  getAllRepoNotes,
  saveProfileNote,
  saveRepoNote,
} from "../../lib/notes";
import { User, FolderGit2, Trash2, StickyNote } from "lucide-react";

interface UserNotesProps {
  onSelectUser?: (username: string) => void;
}

export default function UserNotes({ onSelectUser }: UserNotesProps) {
  const [profileNotes, setProfileNotes] = useState<Record<string, string>>({});
  const [repoNotes, setRepoNotes] = useState<Record<string, string>>({});

  const reloadNotes = () => {
    setProfileNotes(getAllProfileNotes());
    setRepoNotes(getAllRepoNotes());
  };

  useEffect(() => {
    reloadNotes();
  }, []);

  const handleRemoveProfileNote = (username: string) => {
    saveProfileNote(username, "");
    reloadNotes();
  };

  const handleRemoveRepoNote = (repoName: string) => {
    saveRepoNote(repoName, "");
    reloadNotes();
  };

  const profileKeys = Object.keys(profileNotes);
  const repoKeys = Object.keys(repoNotes);

  if (profileKeys.length === 0 && repoKeys.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-xs">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 border border-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
          <StickyNote className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">No Saved Notes Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          When exploring GitHub profiles or repositories, click the <strong>Add Note</strong> button to save thoughts, reminders, or insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Notes Section */}
      {profileKeys.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-blue-600" />
            <span>Profile Notes ({profileKeys.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileKeys.map((username) => (
              <div
                key={username}
                className="border border-slate-200 rounded-lg p-4 flex flex-col justify-between bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
                    <button
                      onClick={() => onSelectUser && onSelectUser(username)}
                      className="text-sm font-bold text-blue-600 hover:underline"
                    >
                      @{username}
                    </button>
                    <button
                      onClick={() => handleRemoveProfileNote(username)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 whitespace-pre-wrap bg-white p-3 rounded-md border border-slate-200/60 leading-relaxed">
                    {profileNotes[username]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Repository Notes Section */}
      {repoKeys.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FolderGit2 className="w-4 h-4 text-blue-600" />
            <span>Repository Notes ({repoKeys.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repoKeys.map((repoName) => (
              <div
                key={repoName}
                className="border border-slate-200 rounded-lg p-4 flex flex-col justify-between bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
                    <span className="text-sm font-bold text-slate-900 break-all">
                      {repoName}
                    </span>
                    <button
                      onClick={() => handleRemoveRepoNote(repoName)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 whitespace-pre-wrap bg-white p-3 rounded-md border border-slate-200/60 leading-relaxed">
                    {repoNotes[repoName]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
