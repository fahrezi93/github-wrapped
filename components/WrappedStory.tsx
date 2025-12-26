"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WrappedStats } from "@/lib/utils";
import { X, Trophy, Flame, Calendar, Github, Download, Share2, Code2, Moon, Sun } from "lucide-react";
import { toPng } from 'html-to-image';

interface WrappedStoryProps {
    data: WrappedStats;
    onClose: () => void;
}

const SLIDE_DURATION = 6000; // 6 seconds per slide

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 0.8,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 1.1,
    }),
};

// Child animation for stagger effects
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

export default function WrappedStory({ data, onClose }: WrappedStoryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const summaryRef = useRef<HTMLDivElement>(null);

    const downloadSummary = async () => {
        if (summaryRef.current) {
            try {
                const dataUrl = await toPng(summaryRef.current, { cacheBust: true, pixelRatio: 2 });
                const link = document.createElement('a');
                link.download = `${data.username}-wrapped-2024.png`;
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error('Failed to download image', err);
            }
        }
    };

    const slides = [
        {
            id: "intro",
            bg: "bg-black",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-8 relative overflow-hidden">
                    {/* Background decorative blob */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(76,29,149,0.4),_transparent_70%)] pointer-events-none" />

                    <motion.div
                        initial="hidden" animate="visible" variants={itemVariants}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.img
                            src={data.avatarUrl}
                            alt="Avatar"
                            className="w-40 h-40 rounded-full border-4 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.6)]"
                        />
                    </motion.div>

                    <motion.div initial="hidden" animate="visible" variants={itemVariants} transition={{ delay: 0.4 }}>
                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            Hi <span className="text-indigo-400">@{data.username || "User"}</span>,
                        </h1>
                        <p className="text-2xl text-gray-300 mt-4">Let's unwrap your 2024 coding journey.</p>
                    </motion.div>
                </div>
            )
        },
        {
            id: "numbers",
            bg: "bg-gradient-to-br from-indigo-900 to-purple-900",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 relative">
                    <Github className="w-32 h-32 text-white/10 absolute top-10 right-10 rotate-12" />

                    <motion.div initial="hidden" animate="visible" variants={itemVariants} className="z-10">
                        <h2 className="text-2xl font-bold text-white/60 mb-2 uppercase tracking-widest">Total Contributions</h2>
                        <h1 className="text-[7rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-t from-white to-gray-400 drop-shadow-2xl">
                            {data.totalContributions >= 1000 ? (data.totalContributions / 1000).toFixed(1) + 'k' : data.totalContributions}
                        </h1>
                        <p className="text-white/80 mt-4 text-xl font-medium">
                            commits, issues, and PRs combined.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                        className="mt-12 grid grid-cols-3 gap-4 w-full max-w-sm"
                    >
                        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                            <p className="text-2xl font-bold text-white">{data.contributionBreakdown?.commits || 0}</p>
                            <p className="text-xs text-white/60 uppercase">Commits</p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                            <p className="text-2xl font-bold text-white">{data.contributionBreakdown?.prs || 0}</p>
                            <p className="text-xs text-white/60 uppercase">PRs</p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                            <p className="text-2xl font-bold text-white">{data.contributionBreakdown?.issues || 0}</p>
                            <p className="text-xs text-white/60 uppercase">Issues</p>
                        </div>
                    </motion.div>
                </div>
            ),
        },
        {
            id: "streak",
            bg: "bg-gradient-to-br from-orange-600 to-red-800",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Flame className="w-40 h-40 text-yellow-400 drop-shadow-[0_0_35px_rgba(250,204,21,0.6)] mb-8" />
                    </motion.div>

                    <motion.div initial="hidden" animate="visible" variants={itemVariants}>
                        <h2 className="text-3xl font-bold text-white mb-4">You were on fire!</h2>
                        <div className="inline-block bg-black/30 px-8 py-4 rounded-2xl border border-white/10 backdrop-blur-md">
                            <p className="text-white/60 text-sm uppercase tracking-wide mb-1">Longest Streak</p>
                            <p className="text-6xl font-black text-white">{data.longestStreak} <span className="text-2xl font-medium text-white/70">days</span></p>
                        </div>
                    </motion.div>

                    <motion.p
                        initial="hidden" animate="visible" variants={itemVariants} transition={{ delay: 0.5 }}
                        className="mt-8 text-white/80 text-lg max-w-xs mx-auto"
                    >
                        Consistency is key, and you unlocked it.
                    </motion.p>
                </div>
            ),
        },
        {
            id: "languages",
            bg: "bg-gradient-to-br from-emerald-800 to-teal-900",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 w-full max-w-md mx-auto">
                    <Code2 className="w-20 h-20 text-emerald-400 mb-8" />
                    <h2 className="text-3xl font-bold text-white mb-8">Top Languages</h2>

                    <div className="w-full space-y-6">
                        {data.topLanguages.map((lang, idx) => (
                            <motion.div
                                key={lang.name}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 + (idx * 0.1) }}
                                className="flex flex-col space-y-2"
                            >
                                <div className="flex justify-between text-white font-medium">
                                    <span>{lang.name}</span>
                                    <span>{lang.percentage}%</span>
                                </div>
                                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${lang.percentage}%` }}
                                        transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: lang.color }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                        {data.topLanguages.length === 0 && (
                            <p className="text-white/50">No code found directly in your top repos.</p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            id: "personality",
            bg: "bg-gradient-to-br from-pink-600 to-rose-800",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
                        {data.personality === "Weekend Warrior" ? (
                            <Sun className="w-32 h-32 text-yellow-300 mb-6" />
                        ) : (
                            <Moon className="w-32 h-32 text-blue-200 mb-6" />
                        )}
                    </motion.div>

                    <h2 className="text-2xl font-semibold text-white/80 uppercase tracking-widest mb-4">You are a</h2>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200 leading-tight py-2"
                    >
                        {data.personality}
                    </motion.div>

                    <p className="mt-6 text-white/80 text-lg max-w-xs">
                        {data.personality === "Weekend Warrior"
                            ? "You code when others sleep. Weekends are for shipping."
                            : "Professional, consistent, and reliable. Business during business hours."}
                    </p>
                </div>
            ),
        },
        {
            id: "summary",
            bg: "bg-[#111]",
            content: (
                <div className="flex flex-col items-center justify-center h-full w-full p-6 space-y-6">
                    <div ref={summaryRef} className="w-full max-w-xs bg-gradient-to-br from-gray-900 to-black p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center text-center space-y-4">
                        <div className="flex flex-col items-center">
                            <img src={data.avatarUrl} className="w-20 h-20 rounded-full border-2 border-white/50 mb-2" alt="avatar" />
                            <h2 className="text-white font-bold text-xl">{data.username}'s 2024</h2>
                            <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-indigo-300 mt-1">{data.rank} • {data.personality}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full">
                            <div className="bg-white/5 p-3 rounded-xl">
                                <p className="text-white/40 text-[10px] uppercase">Contributions</p>
                                <p className="text-white font-bold text-lg">{data.totalContributions}</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl">
                                <p className="text-white/40 text-[10px] uppercase">Peak Streak</p>
                                <p className="text-white font-bold text-lg">{data.longestStreak} days</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl col-span-2">
                                <p className="text-white/40 text-[10px] uppercase mb-1">Top Language</p>
                                <div className="flex items-center gap-2 justify-center">
                                    {data.topLanguages[0] && (
                                        <>
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.topLanguages[0].color }} />
                                            <p className="text-white font-bold">{data.topLanguages[0].name}</p>
                                        </>
                                    )}
                                    {!data.topLanguages[0] && <p className="text-white">N/A</p>}
                                </div>
                            </div>
                        </div>

                        <div className="w-full pt-2 border-t border-white/10">
                            <p className="text-white/20 text-[10px] tracking-widest">GITHUB WRAPPED</p>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4 w-full max-w-xs">
                        <button
                            onClick={downloadSummary}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition-all active:scale-95"
                        >
                            <Download size={20} /> Save Card
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full text-white/50 hover:text-white text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )
        }
    ];

    const goNext = useCallback(() => {
        if (currentIndex < slides.length - 1) {
            setDirection(1);
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex, slides.length]);

    const goPrev = () => {
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex((prev) => prev - 1);
        }
    };

    // Auto-progress
    useEffect(() => {
        if (isPaused || currentIndex === slides.length - 1) return; // Don't auto-progress on summary

        const timer = setTimeout(goNext, SLIDE_DURATION);
        return () => clearTimeout(timer);
    }, [currentIndex, goNext, isPaused, slides.length]);

    // Handle tap
    const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
        // Prevent nav if clicking buttons in summary
        if ((e.target as HTMLElement).tagName === 'BUTTON') return;

        const screenWidth = window.innerWidth;
        const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;

        if (clientX < screenWidth / 3) {
            goPrev();
        } else {
            goNext();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black font-sans">
            <div
                className={`relative w-full h-full max-w-md mx-auto overflow-hidden shadow-2xl ${slides[currentIndex].bg} transition-colors duration-700 ease-in-out`}
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >

                {/* Progress Bars */}
                <div className="absolute top-4 left-0 right-0 z-20 flex gap-1 px-3">
                    {slides.map((_, idx) => (
                        <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: currentIndex > idx ? "100%" : "0%" }}
                                animate={{ width: currentIndex === idx ? "100%" : currentIndex > idx ? "100%" : "0%" }}
                                transition={{ duration: currentIndex === idx && !isPaused ? SLIDE_DURATION / 1000 : 0, ease: "linear" }}
                                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            />
                        </div>
                    ))}
                </div>

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-8 right-5 z-30 text-white/50 hover:text-white p-2 transition-colors">
                    <X size={24} />
                </button>

                {/* Slide Content */}
                <div
                    className="w-full h-full cursor-pointer touch-manipulation"
                    onClick={handleTap}
                >
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.4 }
                            }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {slides[currentIndex].content}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}
