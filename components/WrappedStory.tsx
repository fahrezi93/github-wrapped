"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WrappedStats } from "@/lib/utils";
import { X, Trophy, Flame, Calendar, Github, Download, Share2, Code, Code2, Moon, Sun, Volume2, VolumeX, Sparkles, GitCommit, BarChart3, Star, Zap } from "lucide-react";
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

interface WrappedStoryProps {
    data: WrappedStats;
    onClose: () => void;
}

const SLIDE_DURATION = 6000;

// CARA GANTI LAGU:
// 1. Online URL: Ganti string di bawah dengan link MP3 langsung.
// 2. Local File:
//    - Masukkan file MP3 ke folder "public" (misal: "my-song.mp3")
//    - Ganti URL menjadi: "/my-song.mp3"
const MUSIC_URL = "/mixkit-beautiful-dream-493.mp3";

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 0.9,
        rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0,
        filter: "blur(0px)",
    },
    exit: (direction: number) => ({
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 1.1,
        rotateY: direction < 0 ? 45 : -45,
        filter: "blur(10px)",
    }),
};

const itemVariants = {
    hidden: { y: 30, opacity: 0, filter: "blur(10px)" },
    visible: {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: { type: "spring" as const, stiffness: 300, damping: 20 }
    }
};

const shinyText = "bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50";

export default function WrappedStory({ data, onClose }: WrappedStoryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [slideReady, setSlideReady] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const summaryRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isFirstMount = useRef(true);

    // Initial references for confetti
    const slidesRef = useRef(null);

    // Reset slideReady when slide changes or on first mount
    useEffect(() => {
        setSlideReady(false);
        // Increment animation key to force re-render of animations
        setAnimationKey(prev => prev + 1);

        // Longer delay on first mount to ensure the story view transition is complete
        const delay = isFirstMount.current ? 600 : 450;

        const timer = setTimeout(() => {
            setSlideReady(true);
            isFirstMount.current = false;
        }, delay);

        return () => clearTimeout(timer);
    }, [currentIndex]);

    const downloadSummary = async () => {
        if (summaryRef.current) {
            try {
                const dataUrl = await toPng(summaryRef.current, { cacheBust: true, pixelRatio: 3 });
                const link = document.createElement('a');
                link.download = `${data.username}-wrapped-2025.png`;
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error('Failed to download image', err);
            }
        }
    };

    const slidesData = [
        {
            id: "intro",
            className: "bg-[#0A0A0A]",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 relative overflow-hidden font-outfit">
                    {/* Background Animation */}
                    <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay" />

                    <motion.div
                        key={`intro-2025-${animationKey}`}
                        initial="hidden"
                        animate={slideReady && currentIndex === 0 ? "visible" : "hidden"}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.12, delayChildren: 0.1 }
                            }
                        }}
                        className="relative flex flex-col items-center justify-center -space-y-4 md:-space-y-6 scale-110 md:scale-125 mb-12"
                    >
                        {[
                            { color: "text-purple-600", opacity: 0.2, y: -20 },
                            { color: "text-pink-600", opacity: 0.4, y: -10 },
                            { color: "text-indigo-600", opacity: 0.6, y: 0 },
                            { color: "text-blue-500", opacity: 0.8, y: 10 },
                            { color: "text-cyan-400", opacity: 1, y: 20 },
                        ].map((layer, idx) => (
                            <motion.h1
                                key={idx}
                                variants={{
                                    hidden: { y: 100, opacity: 0, filter: "blur(25px)", scale: 0.7 },
                                    visible: { y: layer.y, opacity: layer.opacity, filter: "blur(0px)", scale: 1 }
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 120,
                                    damping: 12,
                                    mass: 0.8
                                }}
                                className={`text-[6rem] md:text-[8rem] font-black tracking-tighter leading-none ${layer.color} select-none`}
                                style={{ zIndex: idx }}
                            >
                                2025
                            </motion.h1>
                        ))}
                    </motion.div>

                    <motion.div
                        key={`intro-avatar-${animationKey}`}
                        initial={{ opacity: 0, y: 60, scale: 0.85 }}
                        animate={slideReady && currentIndex === 0 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.85 }}
                        transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 120 }}
                        className="relative z-20 flex flex-col items-center"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                            <img
                                src={data.avatarUrl}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full border-2 border-white/50 shadow-2xl relative z-10 mb-4"
                            />
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-2 font-space">
                            Hi <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">@{data.username}</span>
                        </h2>
                        <p className="font-marker text-xl text-white/50 transform -rotate-2">
                            Ready for the wrap?
                        </p>
                    </motion.div>
                </div>
            )
        },
        {
            id: "numbers",
            className: "bg-gradient-to-br from-[#1a1c2c] to-[#4a192c]",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 relative">
                    <Github className="w-[400px] h-[400px] text-white/[0.03] absolute -right-20 -top-20 -rotate-12" />

                    <motion.div initial="hidden" animate="visible" variants={itemVariants} className="z-10 w-full font-space">
                        <h2 className="text-sm font-bold text-pink-400 mb-6 uppercase tracking-[0.3em] border-b border-pink-400/30 pb-2 inline-block font-sans">Total Impact</h2>
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-pink-500 blur-[60px] opacity-20" />
                            <h1 className="text-[6rem] leading-none font-black text-white drop-shadow-2xl tracking-tighter mix-blend-overlay font-outfit">
                                {data.totalContributions >= 1000 ? (data.totalContributions / 1000).toFixed(1) + 'k' : data.totalContributions}
                            </h1>
                        </div>
                        <p className="text-white/60 mt-4 text-xl font-light italic font-marker transform -rotate-1">
                            contributions made in 2025
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                        className="mt-16 grid grid-cols-3 gap-4 w-full"
                    >
                        {[
                            { label: 'Commits', value: data.contributionBreakdown?.commits, color: 'bg-blue-500' },
                            { label: 'PRs', value: data.contributionBreakdown?.prs, color: 'bg-purple-500' },
                            { label: 'Issues', value: data.contributionBreakdown?.issues, color: 'bg-pink-500' }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center group">
                                <div className={`w-2 h-2 rounded-full mb-2 ${item.color} shadow-[0_0_10px_currentColor]`} />
                                <span className="text-3xl font-bold text-white group-hover:scale-110 transition-transform">{item.value || 0}</span>
                                <span className="text-[10px] text-white/40 uppercase tracking-widest">{item.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            )
        },
        {
            id: "streak",
            className: "bg-gradient-to-b from-[#ff3e00] to-[#8a0000]",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-[url('/noise.svg')] bg-opacity-20">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-orange-500 blur-[50px] opacity-50" />
                        <Flame className="w-48 h-48 text-yellow-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] mb-8 relative z-10" strokeWidth={1.5} />
                    </motion.div>

                    <motion.div initial="hidden" animate="visible" variants={itemVariants}>
                        <h2 className="text-4xl font-black text-white italic mb-2">UNSTOPPABLE</h2>
                        <div className="h-1 w-20 bg-yellow-400 mx-auto mb-8 rounded-full" />

                        <div className="backdrop-blur-md bg-white/10 p-8 rounded-3xl border border-white/20 shadow-xl">
                            <p className="text-6xl font-black text-white tracking-tight">{data.longestStreak}</p>
                            <p className="text-xl text-yellow-200 font-medium uppercase tracking-widest mt-2">Day Streak</p>
                        </div>
                    </motion.div>
                </div>
            )
        },
        {
            id: "graph",
            className: "bg-[#0d1117]",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(50,255,100,0.1),_transparent_70%)] pointer-events-none" />

                    <Calendar className="w-16 h-16 text-green-500 mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-2">Every Green Square</h2>
                    <p className="text-white/60 mb-12">tells a story of progress.</p>

                    {/* Scrolling Heatmap Container */}
                    <div className="w-full h-64 relative overflow-hidden flex items-center bg-white/5 border-y border-white/10 backdrop-blur-sm -mx-6">
                        <motion.div
                            className="flex gap-[3px] absolute left-0 px-6"
                            initial={{ x: 0 }}
                            animate={{ x: "-50%" }}
                            transition={{ ease: "linear", duration: 40, repeat: Infinity, repeatType: "loop" }}
                            style={{ minWidth: "max-content" }}
                        >
                            {/* Duplicate for infinite loop effect if needed, but simple scroll is okay for now */}
                            {[...data.weeks, ...data.weeks].map((week, wIdx) => (
                                <div key={wIdx} className="flex flex-col gap-[3px]">
                                    {week.contributionDays.map((day, dIdx) => {
                                        // Calculate easy color based on count
                                        // 0 = #ebedf0/alpha, 1-3 = low green, etc.
                                        let bg = "bg-white/10";
                                        if (day.contributionCount > 0) bg = "bg-green-900";
                                        if (day.contributionCount > 2) bg = "bg-green-700";
                                        if (day.contributionCount > 5) bg = "bg-green-500";
                                        if (day.contributionCount > 10) bg = "bg-green-300 box-shadow-glow";

                                        return (
                                            <div
                                                key={dIdx}
                                                className={`w-3 h-3 rounded-[2px] ${bg} ${day.contributionCount > 10 ? 'shadow-[0_0_5px_currentColor]' : ''}`}
                                                title={`${day.date}: ${day.contributionCount}`}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    <div className="mt-12 grid grid-cols-2 gap-8 w-full max-w-sm">
                        <div className="text-left">
                            <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">Busiest Day</p>
                            <p className="text-white font-bold text-lg">{data.busiestDay.date}</p>
                            <p className="text-green-400 text-sm">{data.busiestDay.count} stats</p>
                        </div>
                        <div className="text-right">
                            <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">Total Active Days</p>
                            {/* Simple estimation or we could calculate this in utils */}
                            <p className="text-white font-bold text-lg">{data.weeks.flat().reduce((acc, w) => acc + w.contributionDays.filter(d => d.contributionCount > 0).length, 0)}</p>
                            <p className="text-green-400 text-sm">Days of Code</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "languages",
            className: "bg-[#050505]",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 w-full max-w-lg mx-auto relative overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none animate-pulse" />
                    <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
                        <div className="relative mb-12">
                            <div className="absolute inset-0 bg-emerald-500 blur-[60px] opacity-20" />
                            <Code2 className="w-20 h-20 text-emerald-400 relative z-10 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                        </div>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-12 tracking-tight">
                        DATA DNA
                    </h2>

                    <div className="w-full grid grid-cols-1 gap-6 relative z-10 px-4">
                        {data.topLanguages.map((lang, idx) => (
                            <motion.div
                                key={lang.name}
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 + (idx * 0.15), type: "spring", stiffness: 100 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="bg-[#121212] border border-white/10 p-5 rounded-2xl relative shadow-xl backdrop-blur-sm overflow-hidden">
                                    {/* Progress Background */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${lang.percentage}%` }}
                                        transition={{ duration: 1.5, delay: 0.6 + (idx * 0.1) }}
                                        className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-900/40 to-transparent opacity-50"
                                    />

                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-4 h-12 rounded-full shadow-[0_0_10px_currentColor]"
                                                style={{ backgroundColor: lang.color, color: lang.color }}
                                            />
                                            <div className="text-left">
                                                <h3 className="text-2xl font-bold text-white tracking-wide">{lang.name}</h3>
                                                <p className="text-xs text-white/40 font-mono tracking-widest uppercase">Primary Syntax</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-3xl font-black text-white">{lang.percentage}%</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )
        },
        // Top Project Slide
        ...(data.topProject ? [{
            id: "project",
            className: "bg-[#0d1117]",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 relative overflow-hidden">
                    {/* Bounding box background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.8),rgba(13,17,23,1)),url('https://assets.website-files.com/5e51c674258ffe10d286d30a/5e535887258ffe727e86e789_dark-bg-01.svg')] bg-cover opacity-30" />

                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                        <Trophy className="w-24 h-24 text-yellow-400 mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
                    </motion.div>

                    <h2 className="text-xl font-bold text-gray-400 mb-2 uppercase tracking-widest font-pixel">Magnum Opus</h2>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-full max-w-sm bg-[#161b22] border border-gray-700 rounded-xl p-6 shadow-2xl relative group"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                        <div className="relative bg-[#0d1117] rounded-xl p-6 flex flex-col items-start text-left h-full">
                            <div className="flex items-center gap-2 mb-4 w-full">
                                <Github size={20} className="text-white/60" />
                                <span className="text-sm text-white/60 truncate font-mono">{data.username}/{data.topProject.name}</span>
                            </div>

                            <h3 className="text-3xl font-bold text-white mb-2 leading-tight break-all font-space">
                                {data.topProject.name}
                            </h3>

                            <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                                {data.topProject.description || "No description provided."}
                            </p>

                            <div className="mt-auto w-full flex items-center justify-between border-t border-gray-800 pt-4">
                                <div className="flex items-center gap-2">
                                    {data.topProject.language && (
                                        <span className="flex items-center gap-1.5 text-xs text-white">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.topProject.language.color }} />
                                            {data.topProject.language.name}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                                    <span className="flex items-center gap-1">★ {data.topProject.stars}</span>
                                    <span className="flex items-center gap-1 text-green-400">+{data.topProject.commits} commits</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )
        }] : []),
        {
            id: "personality",
            className: "bg-gradient-to-tr from-violet-900 to-fuchsia-900",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', duration: 1.5 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-fuchsia-500 blur-[60px] opacity-30" />
                        {data.personality === "Weekend Warrior" ? (
                            <Sun className="w-40 h-40 text-yellow-300 mb-8 drop-shadow-[0_0_30px_rgba(253,224,71,0.5)]" />
                        ) : (
                            <Moon className="w-40 h-40 text-blue-200 mb-8 drop-shadow-[0_0_30px_rgba(191,219,254,0.5)]" />
                        )}
                    </motion.div>

                    <h2 className="text-xl font-bold text-fuchsia-200 uppercase tracking-[0.2em] mb-4 font-outfit">Your Code Persona</h2>

                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-fuchsia-200 to-fuchsia-400 py-4 leading-tight font-space"
                    >
                        {data.personality}
                    </motion.div>

                    <p className="mt-8 text-white/90 text-2xl max-w-xs font-light leading-relaxed border-t border-white/10 pt-8 font-marker transform -rotate-2">
                        {data.personality === "Weekend Warrior"
                            ? "While the world rests, you build. Your best work happens when the notifications stop."
                            : "Consistent. Reliable. A coding machine. You treat code with the professionalism it deserves."}
                    </p>
                </div>
            )
        },
        {
            id: "summary",
            className: "bg-[#0d1117]",
            content: (
                <div className="flex flex-col items-center justify-center h-full w-full p-4 overflow-y-auto">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        ref={summaryRef}
                        className="w-full max-w-sm bg-[#0d1117] rounded-3xl p-6 border border-gray-800 shadow-2xl relative overflow-hidden"
                    >
                        {/* Background subtle grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                        {/* Header */}
                        <div className="relative z-10 flex items-center gap-4 mb-6">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-pink-500 to-purple-500">
                                    <img src={data.avatarUrl} className="w-full h-full rounded-full border-2 border-[#0d1117]" alt="avatar" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white leading-none">@{data.username}</h2>
                                <p className="text-pink-400 text-sm font-medium mt-1">2025 Year in Code</p>
                            </div>
                        </div>

                        {/* Mini Heatmap */}
                        <div className="relative z-10 bg-[#161b22] rounded-xl p-3 mb-6 border border-gray-800 flex flex-col justify-between h-32">
                            <div className="flex gap-[2px] h-full overflow-hidden opacity-80 mask-image-gradient">
                                {data.weeks.slice(-20).map((week, wIdx) => (
                                    <div key={wIdx} className="flex flex-col gap-[2px] flex-1">
                                        {week.contributionDays.map((day, dIdx) => (
                                            <div
                                                key={dIdx}
                                                className={`flex-1 rounded-[1px] ${day.contributionCount > 0 ? 'bg-green-500' : 'bg-gray-800'}`}
                                                style={{ opacity: day.contributionCount > 0 ? Math.min(0.4 + (day.contributionCount * 0.1), 1) : 0.2 }}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{data.totalContributions} contributions in 2025</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
                            {/* Items */}
                            <div className="bg-[#161b22] p-3 rounded-xl border border-gray-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <Trophy size={14} className="text-yellow-500" />
                                    <span className="text-gray-400 text-xs">Universal Rank</span>
                                </div>
                                <p className="text-yellow-400 font-bold text-lg">{data.rank}</p>
                            </div>

                            <div className="bg-[#161b22] p-3 rounded-xl border border-gray-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <Flame size={14} className="text-orange-500" />
                                    <span className="text-gray-400 text-xs">Longest Streak</span>
                                </div>
                                <p className="text-orange-400 font-bold text-lg">{data.longestStreak} days</p>
                            </div>

                            <div className="bg-[#161b22] p-3 rounded-xl border border-gray-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <GitCommit size={14} className="text-pink-500" />
                                    <span className="text-gray-400 text-xs">Total Commits</span>
                                </div>
                                <p className="text-pink-400 font-bold text-lg">{data.contributionBreakdown.commits}</p>
                            </div>

                            <div className="bg-[#161b22] p-3 rounded-xl border border-gray-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <Calendar size={14} className="text-blue-400" />
                                    <span className="text-gray-400 text-xs">Most Active Month</span>
                                </div>
                                <p className="text-blue-400 font-bold text-lg truncate">{data.mostActiveMonth}</p>
                            </div>

                            <div className="bg-[#161b22] p-3 rounded-xl border border-gray-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <BarChart3 size={14} className="text-green-400" />
                                    <span className="text-gray-400 text-xs">Most Active Day</span>
                                </div>
                                <p className="text-green-400 font-bold text-lg">{data.mostActiveDayName}</p>
                            </div>

                            <div className="bg-[#161b22] p-3 rounded-xl border border-gray-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <Star size={14} className="text-yellow-400" />
                                    <span className="text-gray-400 text-xs">Total Stars</span>
                                </div>
                                <p className="text-yellow-400 font-bold text-lg">{data.totalStarsEarned}</p>
                            </div>

                            <div className="bg-[#161b22] p-3 rounded-xl border border-gray-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <Code size={14} className="text-blue-500" />
                                    <span className="text-gray-400 text-xs">Top Language</span>
                                </div>
                                <p className="text-blue-500 font-bold text-lg truncate">{data.topLanguages[0]?.name || "N/A"}</p>
                            </div>

                            <div className="bg-[#161b22] p-3 rounded-xl border border-gray-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <Zap size={14} className="text-purple-500" />
                                    <span className="text-gray-400 text-xs">Power Level</span>
                                </div>
                                <p className="text-purple-500 font-bold text-lg truncate">{data.personality}</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-800 relative z-10">
                            <span className="text-gray-600 text-xs">git-wrapped.com</span>
                            <div className="flex items-center gap-1 text-gray-600">
                                <Github size={12} />
                            </div>
                        </div>

                    </motion.div>

                    <div className="flex gap-4 w-full max-w-sm mt-6">
                        <button
                            onClick={onClose}
                            className="p-4 rounded-xl bg-[#161b22] text-white hover:bg-[#1f242c] transition-colors border border-gray-700"
                        >
                            <X size={20} />
                        </button>
                        <button
                            onClick={downloadSummary}
                            className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors shadow-lg"
                        >
                            <Download size={18} />
                            <span>Download</span>
                        </button>
                    </div>
                </div>
            )
        }
    ];

    const triggerConfetti = useCallback(() => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 60 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }, []);

    const goNext = useCallback(() => {
        if (currentIndex < slidesData.length - 1) {
            setDirection(1);
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex, slidesData.length]);

    const goPrev = () => {
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex((prev) => prev - 1);
        }
    };

    // Auto-progress
    useEffect(() => {
        if (isPaused || currentIndex === slidesData.length - 1) {
            if (currentIndex === slidesData.length - 1) triggerConfetti();
            return;
        }

        const currentDuration = slidesData[currentIndex].id === "graph" ? 12000 : SLIDE_DURATION;
        const timer = setTimeout(goNext, currentDuration);
        return () => clearTimeout(timer);
    }, [currentIndex, goNext, isPaused, triggerConfetti, slidesData.length]);

    const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
        // Prevent nav if clicking buttons (like mute/close/download)
        if ((e.target as HTMLElement).closest('button')) return;
        if ((e.target as HTMLElement).closest('a')) return;

        // Get the container element (the clicked element or its parent)
        const container = e.currentTarget as HTMLElement;
        const rect = container.getBoundingClientRect();

        // Get click position relative to container
        const clientX = 'touches' in e
            ? (e as React.TouchEvent).touches[0]?.clientX || (e as React.TouchEvent).changedTouches[0]?.clientX
            : (e as React.MouseEvent).clientX;

        // Calculate relative position within the container
        const relativeX = clientX - rect.left;
        const containerWidth = rect.width;

        // Instagram Logic:
        // Left 30% -> Previous Slide
        // Right 70% -> Next Slide
        if (relativeX < containerWidth * 0.3) {
            goPrev();
        } else {
            goNext();
        }
    };

    useEffect(() => {
        let mounted = true;
        // Initialize audio
        const audio = new Audio(MUSIC_URL);
        audio.loop = true;
        audio.volume = 0.4;
        audioRef.current = audio;

        // Try to play automatically (might be blocked by browser policy)
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    if (mounted) setIsMuted(false);
                })
                .catch((error) => {
                    console.log("Audio Autoplay prevented:", error);
                    if (mounted) setIsMuted(true);
                });
        }

        return () => {
            mounted = false;
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.play();
                audioRef.current.muted = false;
            } else {
                audioRef.current.muted = true;
            }
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black font-sans overflow-hidden">
            {/* Music Control */}
            <button
                onClick={toggleMute}
                className="absolute top-8 left-5 z-[60] bg-black/20 backdrop-blur-md p-3 rounded-full text-white/70 hover:text-white hover:bg-black/40 transition-all border border-white/10"
            >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <div
                className={`relative w-full h-full md:max-w-md mx-auto overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] ${slidesData[currentIndex].className} transition-colors duration-700 ease-in-out`}
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                {/* Progress Bars */}
                <div className="absolute top-4 left-0 right-0 z-50 flex gap-2 px-4">
                    {slidesData.map((slide, idx) => {
                        const isActive = currentIndex === idx;
                        const isPast = currentIndex > idx;
                        const duration = slide.id === "graph" ? 12 : 6;

                        return (
                            <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                                <motion.div
                                    key={`${idx}-${isActive}`} // Force remount when active state changes to snap animation
                                    initial={{ width: isPast ? "100%" : "0%" }}
                                    animate={{ width: isPast || isActive ? "100%" : "0%" }}
                                    transition={{ duration: isActive && !isPaused ? duration : 0, ease: "linear" }}
                                    className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-8 right-5 z-50 text-white/50 hover:text-white p-2 transition-colors">
                    <X size={24} />
                </button>

                {/* Slide Content */}
                <div
                    className="w-full h-full cursor-pointer touch-manipulation perspective-1000"
                    onClick={handleTap}
                    style={{ perspective: '1000px' }}
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
                                rotateY: { duration: 0.4 }
                            }}
                            className="absolute inset-0 w-full h-full origin-center"
                        >
                            {slidesData[currentIndex].content}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
