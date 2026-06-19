"use client";

import { useState } from "react";
import { MessageSquare, Check } from "lucide-react";

export default function FeedbackForm({ entityId, isFeatured }: { entityId: string; isFeatured: boolean }) {
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_id: entityId,
          guest_name: "Anonymous",
          comment_text: feedback,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setStatus("success");
      setFeedback("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (isFeatured) {
    return (
      <div className="flex flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm font-medium shrink-0">
          <MessageSquare size={16} />
          Feedback
        </div>
        <div className="flex items-center gap-2 flex-grow w-full relative">
          <input 
            type="text" 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={status === "loading" || status === "success"}
            placeholder={status === "success" ? "Thanks for your feedback!" : "Leave a thought on this project..."} 
            className="bg-slate-50 dark:bg-slate-950 text-sm px-4 py-2.5 rounded-lg flex-grow text-slate-700 dark:text-slate-300 outline-none border border-transparent focus:border-blue-500 transition-colors w-full min-w-0 disabled:opacity-50" 
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button 
            onClick={handleSubmit}
            disabled={status === "loading" || status === "success" || !feedback.trim()}
            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shrink-0 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[70px]"
          >
            {status === "loading" ? "..." : status === "success" ? <Check size={16}/> : "Send"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
      <div className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-1">
        Thoughts?
      </div>
      <input 
        type="text" 
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        disabled={status === "loading" || status === "success"}
        placeholder={status === "success" ? "Thanks for your feedback!" : "Your feedback..."} 
        className="bg-slate-50 dark:bg-slate-950 text-sm px-4 py-2.5 rounded-lg w-full text-slate-700 dark:text-slate-300 outline-none border border-transparent focus:border-blue-500 transition-colors disabled:opacity-50" 
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <button 
        onClick={handleSubmit}
        disabled={status === "loading" || status === "success" || !feedback.trim()}
        className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-5 py-2 rounded-lg text-sm font-medium transition-colors self-end mt-2 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[80px]"
      >
        {status === "loading" ? "..." : status === "success" ? <Check size={16}/> : "Post"}
      </button>
    </div>
  );
}
