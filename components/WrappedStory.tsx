"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WrappedStats } from "@/lib/utils";
import { X, Trophy, Flame, Calendar, Github, Download, Share2, Code2, Moon, Sun, Volume2, VolumeX, Sparkles } from "lucide-react";
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

interface WrappedStoryProps {
    data: WrappedStats;
    onClose: () => void;
}

const SLIDE_DURATION = 6000;
const MUSIC_URL = "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3"; // Royalty-free placeholder

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
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring" as const, stiffness: 300, damping: 20 }
    }
};

const shinyText = "bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50";

export default function WrappedStory({ data, onClose }: WrappedStoryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const summaryRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initial references for confetti
    const slidesRef = useRef(null);

    const downloadSummary = async () => {
        if (summaryRef.current) {
            try {
                const dataUrl = await toPng(summaryRef.current, { cacheBust: true, pixelRatio: 3 });
                const link = document.createElement('a');
                link.download = `${data.username}-wrapped-2024.png`;
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
            className: "bg-black",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.15),_transparent_50%)] animate-pulse" />

                    <motion.div
                        initial="hidden" animate="visible" variants={itemVariants}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-indigo-500 blur-[40px] opacity-40 rounded-full scale-150" />
                        <motion.img
                            src={data.avatarUrl}
                            alt="Avatar"
                            className="w-48 h-48 rounded-full border-4 border-white/20 shadow-2xl relative z-10"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ type: "spring", duration: 1.5 }}
                        />
                    </motion.div>

                    <motion.div initial="hidden" animate="visible" variants={itemVariants} transition={{ delay: 0.4 }} className="mt-12 z-10 px-4">
                        <h1 className="text-5xl font-black text-white mb-6 tracking-tight">
                            Hi <span className="text-indigo-400 inline-block transform hover:scale-105 transition-transform">@{data.username}</span>
                        </h1>
                        <p className="text-2xl text-gray-400 font-light">Are you ready to see your year in code?</p>
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

                    <motion.div initial="hidden" animate="visible" variants={itemVariants} className="z-10 w-full">
                        <h2 className="text-sm font-bold text-pink-400 mb-6 uppercase tracking-[0.3em] border-b border-pink-400/30 pb-2 inline-block">Total Impact</h2>
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-pink-500 blur-[60px] opacity-20" />
                            <h1 className="text-[6rem] leading-none font-black text-white drop-shadow-2xl tracking-tighter mix-blend-overlay">
                                {data.totalContributions >= 1000 ? (data.totalContributions / 1000).toFixed(1) + 'k' : data.totalContributions}
                            </h1>
                        </div>
                        <p className="text-white/60 mt-4 text-xl font-light italic">
                            contributions made in 2024
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
                            transition={{ ease: "linear", duration: 20, repeat: Infinity, repeatType: "loop" }}
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
            className: "bg-black",
            content: (
                <div className="flex flex-col items-center justify-start pt-24 h-full text-center p-6 w-full max-w-md mx-auto relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-900 rounded-full blur-[100px] opacity-30 pointer-events-none" />

                    <Code2 className="w-16 h-16 text-emerald-400 mb-6" />
                    <h2 className={`text-4xl font-bold mb-12 ${shinyText}`}>Top Languages</h2>

                    <div className="w-full space-y-6 z-10">
                        {data.topLanguages.map((lang, idx) => (
                            <motion.div
                                key={lang.name}
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 + (idx * 0.1), type: "spring" }}
                                className="relative group"
                            >
                                <div className="flex items-end justify-between text-white font-medium mb-2 px-1">
                                    <span className="text-xl">{lang.name}</span>
                                    <span className="text-sm opacity-60 font-mono">{lang.percentage}%</span>
                                </div>
                                <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden p-[2px] border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${lang.percentage}%` }}
                                        transition={{ duration: 1.5, delay: 0.5 + (idx * 0.1), ease: "circOut" }}
                                        className="h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                                        style={{ backgroundColor: lang.color }}
                                    />
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

                    <h2 className="text-2xl font-bold text-gray-400 mb-2 uppercase tracking-widest">Your Magnum Opus</h2>

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
                                <span className="text-sm text-white/60 truncate">{data.username}/{data.topProject.name}</span>
                            </div>

                            <h3 className="text-3xl font-bold text-white mb-2 leading-tight break-all">
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

                    <h2 className="text-xl font-bold text-fuchsia-200 uppercase tracking-[0.2em] mb-4">Your Code Persona</h2>

                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-fuchsia-200 to-fuchsia-400 py-4 leading-tight"
                    >
                        {data.personality}
                    </motion.div>

                    <p className="mt-8 text-white/90 text-lg max-w-xs font-light leading-relaxed border-t border-white/10 pt-8">
                        {data.personality === "Weekend Warrior"
                            ? "While the world rests, you build. Your best work happens when the notifications stop."
                            : "Consistent. Reliable. A coding machine. You treat code with the professionalism it deserves."}
                    </p>
                </div>
            )
        },
        {
            id: "summary",
            className: "bg-[#050505]",
            content: (
                <div className="flex flex-col items-center justify-center h-full w-full p-6 space-y-8">
                    <h2 className="text-white/40 text-sm tracking-[0.5em] uppercase animate-pulse">Your 2024 Wrapped</h2>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        ref={summaryRef}
                        className="w-full max-w-[340px] bg-gradient-to-br from-[#1a1a1a] to-black p-8 rounded-[40px] border border-white/10 shadow-2xl flex flex-col items-center text-center space-y-6 relative overflow-hidden"
                    >
                        <div className="absolute -top-[100px] -right-[100px] w-[200px] h-[200px] bg-indigo-500 blur-[80px] opacity-20" />
                        <div className="absolute -bottom-[100px] -left-[100px] w-[200px] h-[200px] bg-pink-500 blur-[80px] opacity-20" />

                        <div className="relative">
                            <img src={data.avatarUrl} className="w-24 h-24 rounded-full border-4 border-indigo-500/30 shadow-xl" alt="avatar" />
                            <div className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-full p-2 border-4 border-[#1a1a1a]">
                                <Github size={16} className="text-white" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight">{data.username}</h2>
                            <p className="text-indigo-400 text-sm font-medium mt-1 uppercase tracking-wider">{data.personality}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                                <p className="text-white/40 text-[10px] uppercase font-bold mb-1">Total Impact</p>
                                <p className="text-white font-bold text-2xl">{data.totalContributions}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                                <p className="text-white/40 text-[10px] uppercase font-bold mb-1">Best Streak</p>
                                <p className="text-white font-bold text-2xl">{data.longestStreak}<span className="text-xs text-white/50 ml-1">days</span></p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-4 rounded-2xl w-full border border-indigo-500/20">
                            <p className="text-indigo-200/60 text-[10px] uppercase font-bold mb-2">Top Technology</p>
                            <div className="flex items-center justify-between">
                                <span className="text-white font-bold text-xl">{data.topLanguages[0]?.name || "N/A"}</span>
                                <div className="h-2 flex-1 mx-3 bg-indigo-950 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-400 rounded-full"
                                        style={{ width: `${data.topLanguages[0]?.percentage || 0}%` }}
                                    />
                                </div>
                                <span className="text-indigo-300 font-mono text-xs">{data.topLanguages[0]?.percentage || 0}%</span>
                            </div>
                        </div>

                        <div className="w-full pt-4 border-t border-white/5 flex justify-between items-center opacity-50">
                            <span className="text-[10px] text-white tracking-widest">GITHUB WRAPPED 2024</span>
                            <Sparkles size={12} className="text-yellow-200" />
                        </div>
                    </motion.div>

                    <div className="flex flex-col gap-3 w-full max-w-[340px]">
                        <button
                            onClick={downloadSummary}
                            className="group w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-2xl transition-all active:scale-95 hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
                            <span>Save to Gallery</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full text-white/40 hover:text-white py-2 text-sm transition-colors"
                        >
                            Close
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

        const timer = setTimeout(goNext, SLIDE_DURATION);
        return () => clearTimeout(timer);
    }, [currentIndex, goNext, isPaused, triggerConfetti, slidesData.length]);

    const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
        if ((e.target as HTMLElement).tagName === 'BUTTON') return;

        const screenWidth = window.innerWidth;
        const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;

        if (clientX < screenWidth / 3) {
            goPrev();
        } else {
            goNext();
        }
    };

    useEffect(() => {
        // Initialize audio
        audioRef.current = new Audio(MUSIC_URL);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4;

        // Try to play automatically (might be blocked by browser policy)
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Auto-play was prevented
                setIsMuted(true);
            });
        }

        return () => {
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
                    {slidesData.map((_, idx) => (
                        <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                                initial={{ width: currentIndex > idx ? "100%" : "0%" }}
                                animate={{ width: currentIndex === idx ? "100%" : currentIndex > idx ? "100%" : "0%" }}
                                transition={{ duration: currentIndex === idx && !isPaused ? SLIDE_DURATION / 1000 : 0, ease: "linear" }}
                                className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                            />
                        </div>
                    ))}
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
