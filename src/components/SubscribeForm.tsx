"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }
      
      setStatus("success");
      setMessage("You're in! Thanks for subscribing.");
      setEmail("");
      
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong.");
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-xl mb-16 relative">
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          placeholder="Enter your email address" 
          className="flex-grow bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-6 py-4 rounded-full outline-none border border-slate-200 dark:border-slate-800 focus:border-purple-500 transition-colors shadow-sm disabled:opacity-50"
          required
        />
        <button 
          type="submit" 
          disabled={status === "loading" || status === "success" || !email.trim()}
          className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-8 py-4 rounded-full font-semibold transition-colors shrink-0 shadow-md disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
        >
          {status === "loading" ? "Subscribing..." : status === "success" ? <><Check size={18}/> Subscribed</> : "Subscribe"}
        </button>
      </div>
      {message && (
        <p className={`absolute -bottom-8 left-4 text-sm font-medium ${status === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
