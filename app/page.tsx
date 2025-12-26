"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { fetchUserStats } from "./actions"; // Import Server Action
import WrappedStory from "@/components/WrappedStory";
import { WrappedStats } from "@/lib/utils";
import { Github, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin" /> Generating...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5" /> Generate Wrapped
        </>
      )}
    </button>
  );
}

export default function Home() {
  const [data, setData] = useState<WrappedStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Wrapper for the server action to handle client state
  async function handleSubmit(formData: FormData) {
    setError(null);
    setData(null);

    const result = await fetchUserStats(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setData(result.data);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0a0a] overflow-hidden relative">
      <AnimatePresence>
        {data ? (
          <motion.div
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <WrappedStory data={data} onClose={() => setData(null)} />
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            exit={{ opacity: 0, y: -20 }}
            className="z-10 w-full max-w-md space-y-8 text-center"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-white/10 p-4 rounded-full backdrop-blur-md mb-2">
                <Github size={48} className="text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tighter">
                GitHub Wrapped
              </h1>
              <p className="text-gray-400 text-lg">
                Discover your coding personality for the year.
              </p>
            </div>

            <form action={handleSubmit} className="w-full space-y-4 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
              <div className="text-left">
                <label htmlFor="username" className="block text-sm font-medium text-gray-400 ml-2 mb-1">
                  GitHub Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="torvalds"
                  required
                  className="w-full bg-black/40 border border-white/20 rounded-2xl px-6 py-4 text-white text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <SubmitButton />
            </form>

            <p className="text-xs text-gray-600">
              Not affiliated with GitHub • Built with Next.js 14
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background gradients */}
      <div className="fixed top-0 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
    </main>
  );
}
