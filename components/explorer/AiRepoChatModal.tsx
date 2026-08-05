"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { GitHubRepo, GitHubCommit, GitHubContentItem } from "../../types/github";
import { fetchRepoReadme, fetchRepoCommits, fetchRepoContents } from "../../lib/github";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

interface AiRepoChatModalProps {
  repo: GitHubRepo | null;
  onClose: () => void;
}

const CHAT_STORAGE_PREFIX = "github_repo_chat_";

export default function AiRepoChatModal({ repo, onClose }: AiRepoChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Grounded data state
  const [readme, setReadme] = useState("");
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [contents, setContents] = useState<GitHubContentItem[]>([]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load chat history & fetch grounded repository data when modal opens
  useEffect(() => {
    if (!repo) return;

    // Load per-repo history from localStorage
    const storageKey = `${CHAT_STORAGE_PREFIX}${repo.full_name.toLowerCase()}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (err) {
        setMessages([]);
      }
    } else {
      setMessages([
        {
          id: "welcome",
          sender: "ai",
          text: `👋 Hello! I am your AI assistant for **${repo.name}**. Ask me anything about its codebase, architecture, README, or recent commits!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }

    // Fetch grounded data (README, commits, directory files)
    async function loadGroundedData() {
      if (!repo) return;
      setDataLoading(true);
      try {
        const [readmeData, commitsData, contentsData] = await Promise.all([
          fetchRepoReadme(repo.owner.login, repo.name),
          fetchRepoCommits(repo.owner.login, repo.name),
          fetchRepoContents(repo.owner.login, repo.name),
        ]);
        setReadme(readmeData);
        setCommits(commitsData);
        setContents(contentsData);
      } catch (err) {
        console.error("Failed to load repo data", err);
      } finally {
        setDataLoading(false);
      }
    }

    loadGroundedData();
  }, [repo]);

  // Persist messages to localStorage per repository
  useEffect(() => {
    if (repo && messages.length > 0) {
      const storageKey = `${CHAT_STORAGE_PREFIX}${repo.full_name.toLowerCase()}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, repo]);

  // Auto scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  if (!repo) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userText = input.trim();
    setInput("");

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    const aiMsgId = (Date.now() + 1).toString();
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      sender: "ai",
      text: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, initialAiMsg]);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName: repo.full_name,
          userMessage: userText,
          readme,
          contents,
          commits,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to reach streaming AI chat service");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let streamText = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Handle SSE data stream chunks from Groq API
        if (chunk.includes("data:")) {
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ") && !line.includes("[DONE]")) {
              try {
                const json = JSON.parse(line.replace("data: ", ""));
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  streamText += content;
                  setMessages((prev) =>
                    prev.map((msg) => (msg.id === aiMsgId ? { ...msg, text: streamText } : msg))
                  );
                }
              } catch (e) {
                // ignore unparseable chunk
              }
            }
          }
        } else {
          // Plain text fallback stream
          streamText += chunk;
          setMessages((prev) =>
            prev.map((msg) => (msg.id === aiMsgId ? { ...msg, text: streamText } : msg))
          );
        }
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? { ...msg, text: "⚠️ Error generating AI response. Please try again." }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleClearHistory = () => {
    if (!repo) return;
    const storageKey = `${CHAT_STORAGE_PREFIX}${repo.full_name.toLowerCase()}`;
    localStorage.removeItem(storageKey);
    setMessages([
      {
        id: Date.now().toString(),
        sender: "ai",
        text: `Chat history cleared for **${repo.name}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              🤖 Grounded AI Chat: <span className="text-blue-400">{repo.name}</span>
            </h3>
            <p className="text-xs text-gray-300 mt-0.5">
              Grounded in README ({readme ? "Loaded" : "Loading..."}), Files ({contents.length}), & Commits ({commits.length})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearHistory}
              className="text-xs text-gray-400 hover:text-red-400 underline"
            >
              Clear History
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold leading-none"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {dataLoading && (
          <div className="bg-blue-50 px-4 py-1.5 text-xs text-blue-700 border-b border-blue-100 flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Loading repository context (README, files & commits) to ground AI answers...
          </div>
        )}

        {/* Chat Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-900 border border-gray-200 shadow-xs rounded-bl-none [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
                  }`}
              >
                {msg.sender === "user" ? (
                  msg.text
                ) : (
                  <ReactMarkdown>{msg.text || (isStreaming ? "..." : "")}</ReactMarkdown>
                )}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask a question about ${repo.name}...`}
            disabled={isStreaming}
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-xs disabled:bg-gray-400 transition"
          >
            {isStreaming ? "Streaming..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
