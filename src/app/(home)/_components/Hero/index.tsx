import { ArrowRight, Flame, Diamond, Sparkles, Gem, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./Hero.module.css";
import Link from "next/link";

const GOLD_PRICE = { "18K": "$55.70/g", "22K": "$69.23/g", "24K": "$75.10/g", PT950: "$42.30/g" };

/* Deterministic sparkle positions (avoid hydration mismatch) */
const SPARKLES_DATA = Array.from({ length: 30 }, (_, i) => ({
    top: `${(i * 37 + 13) % 97}%`,
    left: `${(i * 53 + 7) % 93}%`,
    size: 1 + (i % 3),
    duration: `${2 + (i % 4)}s`,
    delay: `${(i * 0.4) % 5}s`,
}));

const BOKEH = Array.from({ length: 7 }, (_, i) => ({
    width: `${180 + i * 80}px`,
    height: `${180 + i * 80}px`,
    top: `${(i * 41 + 5) % 80}%`,
    left: `${(i * 53 + 10) % 85}%`,
    delay: `${i * -2.5}s`,
}));

export const Hero = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

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
        <section className="relative flex min-h-[700px] w-full items-center overflow-hidden bg-black sm:min-h-[800px] lg:h-screen">
            {/* ═══ BACKGROUND LAYER ═══ */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src="https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt="Hero Jewelry Background"
                    className={`h-full w-full object-cover object-center brightness-110 ${styles["bg-animate"]}`}
                />

                {/* Gradient overlays — luminous, not dark */}
                <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/15 to-black/35" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/5" />

                {/* Gold-tinted bottom edge */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/90 to-transparent" />

                {/* Light leak */}
                <div className={styles["light-leak"]} />

                {/* Bokeh */}
                {BOKEH.map((b, i) => (
                    <div
                        key={i}
                        className={styles["bokeh"]}
                        style={{ width: b.width, height: b.height, top: b.top, left: b.left, animationDelay: b.delay }}
                    />
                ))}
            </div>

            {/* ═══ DECORATIVE CORNER ACCENTS ═══ */}
            <div className="border-gold/30 pointer-events-none absolute top-8 left-8 z-30 hidden h-20 w-20 border-t-2 border-l-2 lg:block" />
            <div className="border-gold/30 pointer-events-none absolute top-8 right-8 z-30 hidden h-20 w-20 border-t-2 border-r-2 lg:block" />

            {/* ═══ MAIN CONTENT ═══ */}
            <div className="relative z-20 container mx-auto flex min-h-[85vh] w-full flex-col px-5 pt-16 pb-16 sm:px-8 sm:pt-20 lg:flex-row lg:px-12 lg:pt-24 lg:pb-0">
                {/* ── LEFT: Text & CTA ── */}
                <div className="flex w-full flex-col lg:w-[55%]">
                    {/* Noblesse Ornamental Header */}
                    <div className={`${styles["ornamental-hr"]} animate-fade-in`}>
                        <Gem className="h-3 w-3" />
                        <span className="text-gold/80 text-[10px] font-bold tracking-[0.4em] uppercase">
                            The 2026 Collection
                        </span>
                    </div>

                    <h1
                        className={`${styles["noble-title"]} ${styles["animate-kerning"]} mb-6 flex flex-col sm:mb-8 md:mb-10 lg:mb-12`}
                    >
                        <span
                            data-text="Brilliance"
                            className="xs:text-5xl text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl"
                        >
                            Brilliance
                        </span>
                        <span
                            data-text="Defined"
                            className="xs:text-4xl mt-1 ml-4 text-3xl font-light italic sm:mt-2 sm:ml-8 sm:text-5xl md:text-6xl lg:ml-12 lg:text-[5rem] xl:text-[6.5rem]"
                        >
                            Defined
                        </span>
                    </h1>

                    <p
                        className={`${styles["subtext-premium"]} mb-8 max-w-[90%] text-[10px] sm:mb-10 sm:max-w-xl sm:text-xs md:mb-12 md:text-sm lg:text-sm xl:text-base`}
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        Curation of high jewelry, where unparalleled craftsmanship <br className="hidden md:block" />{" "}
                        meets extraordinary earth-mined diamonds.
                    </p>

                    {/* ── Flash Sale Widget ── */}
                    <div
                        className={`group relative mb-8 max-w-lg overflow-hidden rounded-2xl border bg-white/5 p-4 shadow-2xl backdrop-blur-md sm:mb-10 sm:p-5 ${styles["border-shimmer"]} ${styles["rise-4"]}`}
                    >
                        {/* Hover gradient overlay */}
                        <div className="from-gold/10 via-gold/5 absolute inset-0 bg-linear-to-r to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                            <div className="flex flex-col gap-1.5">
                                <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase sm:text-sm">
                                    <Flame size={16} className="animate-pulse text-red-500" />
                                    <span className="text-gold">Flash Event</span>
                                </span>
                                <span className="font-serif text-base text-white sm:text-lg">
                                    Exclusive VIP Sale — 20% Off
                                </span>
                            </div>

                            <div className="hidden h-12 w-px bg-white/20 sm:block" />

                            {/* Timer */}
                            <div className="flex items-center justify-center gap-3 sm:gap-4">
                                {(
                                    [
                                        { val: timeLeft.hours, label: "Hrs", highlight: false },
                                        { val: timeLeft.minutes, label: "Min", highlight: false },
                                        { val: timeLeft.seconds, label: "Sec", highlight: true },
                                    ] as const
                                ).map((t, i) => (
                                    <div key={t.label} className="flex items-center gap-3 sm:gap-4">
                                        {i > 0 && <span className="text-gold/50 text-lg font-bold sm:text-xl">:</span>}
                                        <div className="flex flex-col items-center">
                                            <span
                                                className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg font-bold shadow-inner sm:h-11 sm:w-11 sm:text-xl ${
                                                    t.highlight
                                                        ? `text-gold border-gold/40 bg-gold/10 ${styles["animate-pulse-glow"]}`
                                                        : "border-white/15 bg-white/5 text-white"
                                                }`}
                                            >
                                                {String(t.val).padStart(2, "0")}
                                            </span>
                                            <span
                                                className={`mt-1 text-[8px] tracking-widest uppercase sm:text-[9px] ${t.highlight ? "text-gold" : "text-gray-500"}`}
                                            >
                                                {t.label}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom urgency bar */}
                        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs sm:mt-4">
                            <div className="flex items-center gap-2 text-gray-300">
                                <span className="h-2 w-2 animate-ping rounded-full bg-red-500" />
                                Only <strong className="text-gold px-1 tracking-widest">2 SLOTS</strong> remaining
                            </div>
                            <span className="text-gold hover:text-gold-light cursor-pointer text-[10px] font-bold tracking-widest uppercase transition-colors hover:underline">
                                Claim Yours &rarr;
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6" data-aos="fade-up" data-aos-delay="400">
                        <Link
                            href="/collections"
                            className={`${styles["luxury-button"]} flex h-12 items-center gap-3 rounded-full px-6 text-[9px] font-bold tracking-widest text-black uppercase transition-all sm:h-14 sm:px-10 sm:text-[10px] md:text-[11px]`}
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Shop Collection
                        </Link>
                        <Link
                            href="/about"
                            className={`${styles["ghost-luxury"]} group border-gold/20 hover:bg-gold/5 flex h-12 items-center gap-3 rounded-full border px-6 text-[9px] font-bold tracking-widest text-white uppercase transition-all sm:h-14 sm:px-10 sm:text-[10px] md:text-[11px]`}
                        >
                            View Lookbook
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* ── RIGHT: Orbit Galaxy ── */}
                <div className="relative flex h-[350px] w-full items-center justify-center sm:h-[420px] lg:mt-32 lg:h-[600px] lg:w-[45%]">
                    <div className="relative flex h-full w-full max-w-sm items-center justify-center sm:max-w-md lg:max-w-lg">
                        {/* Core glow halo */}
                        <div
                            className={`bg-gold/20 absolute inset-0 m-auto h-48 w-48 rounded-full opacity-60 blur-[80px] sm:h-64 sm:w-64 sm:blur-[100px] lg:h-72 lg:w-72 ${styles["halo"]}`}
                        />

                        {/* Orbit rings */}
                        <div className={styles["orbit-container"]}>
                            {/* OUTER RING */}
                            <div className={styles["outer-ring"]}>
                                {[
                                    "https://tahigems.vn/wp-content/uploads/2021/07/tahigems-round.webp",
                                    "https://sancydiamond.vn/wp-content/uploads/2025/05/4.png",
                                    "https://odydiamond.vn/wp-content/uploads/2024/10/kim-cuong-4ly5-nuoc-g.png",
                                    "https://dddn.1cdn.vn/2021/10/09/diendandoanhnghiep.vn-media-uploaded-344-2021-10-08-_botrangsuc3.png",
                                ].map((url, i) => (
                                    <div
                                        key={`outer-${i}`}
                                        className={styles["orbit-item"]}
                                        style={{
                                            transform: `translateX(-50%) rotate(${i * 90}deg)`,
                                            transformOrigin: "50% 260px",
                                        }}
                                    >
                                        <div className={styles["item-content"]}>
                                            <img src={url} alt="Jewel" className="w-full drop-shadow-2xl" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* INNER RING */}
                            <div className={styles["inner-ring"]}>
                                {[
                                    "https://ceresglobaljewels.com/wp-content/uploads/2024/12/kc1.png",
                                    "https://ngj.vn/wp-content/uploads/2025/11/521924.png",
                                    "https://tahigems.vn/wp-content/uploads/2021/07/tahigems-round.webp",
                                ].map((url, i) => (
                                    <div
                                        key={`inner-${i}`}
                                        className={styles["orbit-item"]}
                                        style={{
                                            transform: `translateX(-50%) rotate(${i * 120}deg)`,
                                            transformOrigin: "50% 175px",
                                        }}
                                    >
                                        <div className={styles["item-content"]}>
                                            <img src={url} alt="Jewel" className="w-full drop-shadow-xl" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Twinkle particles */}
                            {SPARKLES_DATA.map((s, i) => (
                                <div
                                    key={`sparkle-${i}`}
                                    className={`absolute rounded-full bg-white shadow-[0_0_8px_rgba(212,175,55,0.6)] ${styles["twinkle"]}`}
                                    style={{
                                        top: s.top,
                                        left: s.left,
                                        width: `${s.size}px`,
                                        height: `${s.size}px`,
                                        ["--duration" as string]: s.duration,
                                        ["--delay" as string]: s.delay,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Centerpiece Diamond */}
                        <div className={`absolute z-30 m-auto w-[50%] sm:w-[42%] ${styles["animate-float"]}`}>
                            <img
                                src="https://cdn.hstatic.net/products/1000381168/upload_f1abf23f3d2d4abe8249e0881ae040c4_grande.jpg"
                                alt="Centerpiece Diamond"
                                className="h-auto w-full rounded-full object-cover mix-blend-lighten shadow-2xl"
                            />
                            {/* Price tag */}
                            <div className="border-gold/40 absolute -right-2 bottom-2 z-40 animate-bounce rounded-xl border bg-black/60 p-2.5 shadow-[0_10px_30px_rgba(212,175,55,0.3)] backdrop-blur-md delay-100 sm:-right-4 sm:bottom-4 sm:p-3">
                                <span className="text-gold mb-0.5 block text-[7px] font-bold tracking-widest uppercase sm:text-[8px]">
                                    GIA Certified
                                </span>
                                <span className="font-serif text-sm text-white sm:text-lg">$14,500</span>
                            </div>
                        </div>

                        {/* Decorative orbit lines */}
                        <div className="border-gold/20 pointer-events-none absolute inset-0 m-auto h-[70%] w-[70%] animate-[spin_25s_linear_infinite] rounded-full border border-dashed sm:h-full sm:max-h-[380px] sm:w-full sm:max-w-[380px]" />
                        <div className="pointer-events-none absolute inset-0 m-auto h-[80%] w-[80%] animate-[spin_40s_linear_infinite_reverse] rounded-full border-[0.5px] border-white/10 sm:h-[110%] sm:max-h-[430px] sm:w-[110%] sm:max-w-[430px]" />
                    </div>
                </div>
            </div>

            {/* ═══ GOLD PRICE MARQUEE TICKER ═══ */}
            <div className="border-gold/20 absolute bottom-0 z-30 w-full overflow-hidden border-t bg-black/80 backdrop-blur-xl">
                <div className="container mx-auto flex items-center py-2.5 sm:py-3">
                    <span className="z-10 flex shrink-0 items-center gap-2 bg-black/80 pr-4 text-[10px] font-bold tracking-widest uppercase sm:pr-6 sm:text-[11px]">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                        </span>
                        <span className="text-gold">Live Prices</span>
                    </span>
                    <div className="relative flex-1 overflow-hidden">
                        <div className={styles["ticker-track"]}>
                            {[...Array(2)].map((_, rep) => (
                                <div key={rep} className="flex shrink-0 gap-6 sm:gap-10">
                                    {Object.entries(GOLD_PRICE).map(([k, v]) => (
                                        <span
                                            key={`${k}-${rep}`}
                                            className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest whitespace-nowrap text-white uppercase sm:gap-2 sm:text-[11px]"
                                        >
                                            <Diamond size={10} className="text-gold" />
                                            {k}: <span className="text-gold/70 ml-0.5 sm:ml-1">{v}</span>
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ BOTTOM CORNER ACCENTS ═══ */}
            <div className="border-gold/30 pointer-events-none absolute bottom-16 left-8 z-30 hidden h-20 w-20 border-b-2 border-l-2 lg:block" />
            <div className="border-gold/30 pointer-events-none absolute right-8 bottom-16 z-30 hidden h-20 w-20 border-r-2 border-b-2 lg:block" />
        </section>
    );
};
