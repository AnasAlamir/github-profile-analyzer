"use client";

import { useState, useEffect } from "react";
import {
  getAllProfileNotes,
  getAllRepoNotes,
  saveProfileNote,
  saveRepoNote,
} from "../../lib/notes";

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
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center mt-4 shadow-xs">
        <h3 className="text-lg font-bold text-gray-800 mb-1">No Saved Notes Yet</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          When exploring GitHub profiles or repositories, click the 📝 <strong>Add Note</strong> button to save thoughts, reminders, or insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      {/* Profile Notes Section */}
      {profileKeys.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            👤 Profile Notes ({profileKeys.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileKeys.map((username) => (
              <div
                key={username}
                className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between bg-gray-50/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
                    <button
                      onClick={() => onSelectUser && onSelectUser(username)}
                      className="text-sm font-bold text-blue-600 hover:underline"
                    >
                      @{username}
                    </button>
                    <button
                      onClick={() => handleRemoveProfileNote(username)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border border-gray-100">
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
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            📦 Repository Notes ({repoKeys.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repoKeys.map((repoName) => (
              <div
                key={repoName}
                className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between bg-gray-50/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
                    <span className="text-sm font-bold text-gray-900 break-all">
                      {repoName}
                    </span>
                    <button
                      onClick={() => handleRemoveRepoNote(repoName)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border border-gray-100">
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
