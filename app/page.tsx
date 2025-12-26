"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { fetchUserStats } from "./actions"; // Import Server Action
import WrappedStory from "@/components/WrappedStory";
import { WrappedStats } from "@/lib/utils";
import { Github, Loader2, Sparkles, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative w-full overflow-hidden bg-white text-black font-black py-5 px-8 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

      {pending ? (
        <>
          <Loader2 className="animate-spin w-5 h-5 text-gray-600" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-black">
            Summoning Data...
          </span>
        </>
      ) : (
        <>
          <Wand2 className="w-5 h-5 text-indigo-600" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-black">
            Reveal My Story
          </span>
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
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black overflow-hidden relative">

      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-fuchsia-900/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[20%] right-[30%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
      </div>

      <AnimatePresence>
        {data ? (
          <motion.div
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <WrappedStory data={data} onClose={() => setData(null)} />
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 w-full max-w-lg relative"
          >
            {/* Decorative Glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-fuchsia-500 blur-[60px] opacity-20 transform scale-90" />

            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl overflow-hidden">
              {/* Shine effect inside card */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

              <div className="flex flex-col items-center justify-center space-y-6 text-center relative z-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
                  className="bg-white p-4 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-4"
                >
                  <Github size={48} className="text-black" />
                </motion.div>

                <div className="space-y-2">
                  <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                    2025
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300">
                      WRAPPED
                    </span>
                  </h1>
                  <p className="text-indigo-200/60 text-lg font-light tracking-wide">
                    Your year in code. Unveiled.
                  </p>
                </div>

                <form action={handleSubmit} className="w-full space-y-6 mt-8">
                  <div className="group relative">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      placeholder="Enter GitHub Username"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-center text-xl placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium group-hover:bg-white/10"
                    />
                    {/* Input simple glow */}
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex items-center justify-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      {error}
                    </motion.div>
                  )}

                  <SubmitButton />
                </form>
              </div>
            </div>

            <p className="text-center text-xs text-white/20 mt-8 uppercase tracking-[0.2em]">
              Not affiliated with GitHub
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
