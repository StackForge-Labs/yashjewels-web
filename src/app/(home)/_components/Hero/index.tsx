import { ArrowRight, Diamond, Gem, ShoppingBag } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import styles from "./Hero.module.css";
import Link from "next/link";

const GOLD_PRICE = { "18K": "$55.70/g", "22K": "$69.23/g", "24K": "$75.10/g", PT950: "$42.30/g" };

const ORBIT_JEWELS = [
    "https://tahigems.vn/wp-content/uploads/2021/07/tahigems-round.webp",
    "https://sancydiamond.vn/wp-content/uploads/2025/05/4.png",
    "https://odydiamond.vn/wp-content/uploads/2024/10/kim-cuong-4ly5-nuoc-g.png",
    "https://ceresglobaljewels.com/wp-content/uploads/2024/12/kc1.png",
    "https://ngj.vn/wp-content/uploads/2025/11/521924.png",
];

export const Hero = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });
    const containerRef = useRef(null);
    const { scrollY } = useScroll();

    // Parallax effects
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else {
                    seconds = 59;
                    if (minutes > 0) minutes--;
                    else {
                        minutes = 59;
                        if (hours > 0) hours--;
                    }
                }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative flex min-h-[800px] w-full items-center overflow-hidden bg-[#030303] lg:h-screen"
        >
            {/* ═══ NOBLE BACKGROUND LAYER ═══ */}
            <motion.div style={{ y: y1, opacity }} className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src="/images/hero/bg_nobility.png"
                    alt="Hero Jewelry Background"
                    className="h-full w-full object-cover object-center brightness-[0.85] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/80" />
                <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent" />

                {/* Decorative particles */}
                <div className={styles["light-leak"]} />
            </motion.div>

            {/* ═══ NOBILITY ORNAMENTATION ═══ */}
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-gold/10 pointer-events-none absolute inset-8 z-30 hidden border lg:block"
                >
                    <div className="border-gold/30 absolute -top-1 -left-1 h-8 w-8 border-t-2 border-l-2" />
                    <div className="border-gold/30 absolute -top-1 -right-1 h-8 w-8 border-t-2 border-r-2" />
                    <div className="border-gold/30 absolute -bottom-1 -left-1 h-8 w-8 border-b-2 border-l-2" />
                    <div className="border-gold/30 absolute -right-1 -bottom-1 h-8 w-8 border-r-2 border-b-2" />
                </motion.div>
            </AnimatePresence>

            {/* ═══ MAIN CONTENT ═══ */}
            <div className="relative z-20 container mx-auto flex h-full flex-col px-6 lg:flex-row lg:items-center lg:px-24">
                {/* ── LEFT: Typography ── */}
                <div className="mt-20 flex w-full flex-col lg:mt-0 lg:w-3/5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                        className="mb-8 flex items-center gap-4"
                    >
                        <div className="bg-gold/50 h-[1px] w-12" />
                        <span className="text-gold font-serif text-xs font-medium tracking-[0.5em] uppercase">
                            Maison de Yash • Est. 2026
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                        className="font-serif text-7xl leading-[0.85] text-white sm:text-8xl lg:text-[8rem] xl:text-[9.5rem]"
                    >
                        <span className="drop-shadow-2xl">Pure</span> <br />
                        <span className="from-gold-light via-gold to-gold-dark ml-8 bg-linear-to-b bg-clip-text font-light text-transparent italic sm:ml-20">
                            Elegance
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mt-8 max-w-lg font-sans text-xs leading-loose tracking-[0.2em] text-white/70 uppercase sm:text-sm lg:mt-12"
                    >
                        Unveiling a sanctuary of rare earth-mined diamonds <br className="hidden sm:block" />
                        and high-craftsmanship jewelry designed for the <br className="hidden sm:block" />
                        discerning modern nobility.
                    </motion.p>

                    {/* ── VIP Invitation (Redesigned) ── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
                        className="group hover:border-gold/30 hover:shadow-gold/10 relative mt-12 max-w-md overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 p-8 backdrop-blur-2xl transition-all duration-700 hover:shadow-2xl"
                    >
                        <div className="from-gold/20 absolute inset-0 bg-linear-to-r to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                        <div className="relative z-10 flex items-start gap-6">
                            <div className="relative">
                                <div className="bg-gold/20 absolute -inset-2 animate-pulse rounded-full blur-md" />
                                <div className="border-gold/40 relative flex h-16 w-16 items-center justify-center rounded-full border bg-black/40">
                                    <Gem size={28} className="text-gold" />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-gold mb-1 text-[10px] font-bold tracking-[0.4em] uppercase">
                                    Privé Collection access
                                </span>
                                <h3 className="mb-3 font-serif text-2xl text-white">
                                    Exclusive <span className="font-light italic">Spring Gala</span> Pass
                                </h3>

                                <div className="mt-1 flex items-center gap-4 border-t border-white/5 pt-4">
                                    <div className="flex flex-col">
                                        <span className="mb-1 text-[8px] tracking-widest text-white/40 uppercase">
                                            Status
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                                            <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase">
                                                Active Invite
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mx-2 h-8 w-px bg-white/10" />
                                    <div className="flex flex-col">
                                        <span className="mb-1 text-[8px] tracking-widest text-white/40 uppercase">
                                            Event Ends In
                                        </span>
                                        <div className="text-gold font-mono text-lg font-bold">
                                            {String(timeLeft.hours).padStart(2, "0")}:
                                            {String(timeLeft.minutes).padStart(2, "0")}:
                                            <span className="animate-pulse">
                                                {String(timeLeft.seconds).padStart(2, "0")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shimmer line */}
                        <div className="via-gold/40 absolute bottom-0 left-0 h-[2px] w-full translate-x-[-100%] bg-linear-to-r from-transparent to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-12 flex flex-wrap items-center gap-6"
                    >
                        <Link
                            href="/collections"
                            className="bg-gold hover:bg-gold-light hover:shadow-gold/20 flex h-14 items-center gap-3 rounded-full px-10 text-[11px] font-bold tracking-[0.2em] text-black uppercase transition-all hover:-translate-y-1 hover:shadow-2xl"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Discover All
                        </Link>
                        <Link
                            href="/about"
                            className="border-gold/30 hover:bg-gold/5 flex h-14 items-center gap-3 rounded-full border px-10 text-[11px] font-bold tracking-[0.2em] text-white uppercase transition-all"
                        >
                            Our Heritage
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>
                </div>

                {/* ── RIGHT: The Ethereal Orbit ── */}
                <div className="relative mt-20 flex h-[400px] w-full items-center justify-center lg:mt-0 lg:h-[600px] lg:w-2/5">
                    <motion.div
                        animate={{
                            rotate: 360,
                        }}
                        transition={{
                            duration: 50,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="border-gold/10 absolute h-[300px] w-[300px] rounded-full border border-dashed sm:h-[450px] sm:w-[450px]"
                    />

                    <motion.div
                        animate={{
                            rotate: -360,
                        }}
                        transition={{
                            duration: 35,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute h-[250px] w-[250px] rounded-full border border-white/5 sm:h-[350px] sm:w-[350px]"
                    />

                    {/* Orbiting Jewels */}
                    {ORBIT_JEWELS.map((url, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                rotate: 360,
                                y: [0, -10, 0],
                            }}
                            transition={{
                                rotate: { duration: 40 + i * 5, repeat: Infinity, ease: "linear" },
                                y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 },
                            }}
                            className="absolute"
                            style={{
                                width: "100%",
                                height: "100%",
                                top: 0,
                                left: 0,
                            }}
                        >
                            <motion.div
                                className="absolute left-1/2 -ml-12 h-24 w-24 overflow-visible rounded-full sm:-ml-16 sm:h-32 sm:w-32"
                                style={{
                                    top: i % 2 === 0 ? "5%" : "85%",
                                    rotate: -360, // Counter rotate to keep image upright
                                }}
                                whileHover={{ scale: 1.2, zIndex: 50 }}
                            >
                                <img
                                    src={url}
                                    alt="Jewel"
                                    className="w-full drop-shadow-[0_20px_50px_rgba(212,175,55,0.4)]"
                                />
                            </motion.div>
                        </motion.div>
                    ))}

                    {/* Centerpiece Diamond */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                        className="relative z-40 h-48 w-48 sm:h-64 sm:w-64"
                    >
                        <motion.img
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            src="https://cdn.hstatic.net/products/1000381168/upload_f1abf23f3d2d4abe8249e0881ae040c4_grande.jpg"
                            alt="Masterpiece"
                            className="h-full w-full rounded-full object-cover mix-blend-lighten shadow-[0_0_100px_rgba(212,175,55,0.3)]"
                        />
                        <div className="border-gold/40 absolute -right-4 -bottom-4 flex flex-col rounded-2xl border bg-black/60 p-4 backdrop-blur-md">
                            <span className="text-gold text-[8px] font-bold tracking-widest uppercase">
                                GIA Certified
                            </span>
                            <span className="font-serif text-lg text-white">$14,500</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ═══ LIVE MARKET TICKER ═══ */}
            <div className="border-gold/20 absolute bottom-0 z-30 w-full border-t bg-black/60 py-4 backdrop-blur-xl">
                <div className="container mx-auto flex items-center px-6">
                    <div className="flex items-center gap-3 pr-8">
                        <div className="h-2 w-2 animate-ping rounded-full bg-red-500" />
                        <span className="text-gold text-[10px] font-bold tracking-[0.2em] whitespace-nowrap uppercase">
                            Live Market
                        </span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className={styles["ticker-track"]}>
                            {[...Array(2)].map((_, rep) => (
                                <div key={rep} className="flex shrink-0 gap-12">
                                    {Object.entries(GOLD_PRICE).map(([k, v]) => (
                                        <span
                                            key={`${k}-${rep}`}
                                            className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-white/70 uppercase"
                                        >
                                            <Diamond size={10} className="text-gold" />
                                            {k}: <span className="text-white">{v}</span>
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
