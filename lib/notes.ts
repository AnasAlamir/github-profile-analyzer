const PROFILE_NOTES_KEY = "github_explorer_profile_notes";
const REPO_NOTES_KEY = "github_explorer_repo_notes";

// Helper to safely read JSON from localStorage
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return fallback;
  }
}

// Helper to safely write JSON to localStorage
function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage`, err);
  }
}

// Profile Notes Operations
export function getProfileNote(username: string): string {
  const notes = getItem<Record<string, string>>(PROFILE_NOTES_KEY, {});
  return notes[username.toLowerCase()] || "";
}

export function saveProfileNote(username: string, content: string): void {
  const notes = getItem<Record<string, string>>(PROFILE_NOTES_KEY, {});
  const cleanUser = username.toLowerCase();
  if (!content.trim()) {
    delete notes[cleanUser];
  } else {
    notes[cleanUser] = content.trim();
  }
  setItem(PROFILE_NOTES_KEY, notes);
}

export function getAllProfileNotes(): Record<string, string> {
  return getItem<Record<string, string>>(PROFILE_NOTES_KEY, {});
}

// Repository Notes Operations
export function getRepoNote(repoFullName: string): string {
  const notes = getItem<Record<string, string>>(REPO_NOTES_KEY, {});
  return notes[repoFullName.toLowerCase()] || "";
}

export function saveRepoNote(repoFullName: string, content: string): void {
  const notes = getItem<Record<string, string>>(REPO_NOTES_KEY, {});
  const cleanRepo = repoFullName.toLowerCase();
  if (!content.trim()) {
    delete notes[cleanRepo];
  } else {
    notes[cleanRepo] = content.trim();
  }
  setItem(REPO_NOTES_KEY, notes);
}

export function getAllRepoNotes(): Record<string, string> {
  return getItem<Record<string, string>>(REPO_NOTES_KEY, {});
}
