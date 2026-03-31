import { ArrowRight, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./Hero.module.css";

const GOLD_PRICE = { "18K": "$55.70/g", "22K": "$69.23/g", "24K": "$75.10/g", PT950: "$42.30/g" };
export const Hero = () => {
    // Countdown Timer Logic
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
        <section className="relative flex h-[90vh] min-h-[750px] w-full items-center overflow-hidden bg-black">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 z-10 bg-linear-to-r" />
                <img
                    src="https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt="Hero Jewelry Background"
                    className={`h-full w-full object-cover object-center opacity-90 ${styles["bg-animate"]}`}
                />

                {/* Cinematic Bokeh Atmosphere */}
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={styles["bokeh"]}
                        style={{
                            width: `${200 + i * 100}px`,
                            height: `${200 + i * 100}px`,
                            top: `${Math.random() * 80}%`,
                            left: `${Math.random() * 80}%`,
                            animationDelay: `${i * -3}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-20 container mx-auto flex h-full w-full flex-col items-center px-4 pt-20 lg:flex-row lg:px-12">
                {/* Hero Left Content */}
                <div
                    className="flex w-full flex-col justify-center lg:w-1/2"
                    data-aos="fade-up"
                    data-aos-duration="1200"
                >
                    <div className="text-gold mb-6 flex items-center gap-4">
                        <span className="bg-gold h-px w-12"></span>
                        <span className="text-xs font-bold tracking-[0.4em] text-white uppercase">
                            The 2026 Edition
                        </span>
                    </div>
                    <h2
                        className={`mb-6 font-serif text-5xl leading-[1.15] text-white drop-shadow-md md:text-7xl ${styles["shimmer-text"]}`}
                    >
                        Brilliance <span className="text-gold font-light italic">Defined</span>
                    </h2>
                    <p className="mb-10 max-w-lg text-base leading-relaxed font-light text-gray-300">
                        Discover our exquisite selection of high jewelry. Unparalleled craftsmanship meeting
                        extraordinary earth-mined diamonds.
                    </p>

                    {/* Scarcity / Sales Widget */}
                    <div className="group relative mb-10 inline-block overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-md">
                        <div className="from-gold/10 absolute inset-0 bg-linear-to-r to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                        <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row">
                            <div className="flex flex-col gap-2">
                                <span className="text-gold flex items-center gap-2 text-sm font-bold tracking-widest uppercase">
                                    <Flame size={16} className="animate-pulse text-red-500" /> Flash Event
                                </span>
                                <span className="font-serif text-lg text-white">Exclusive VIP Sale - 20% Off</span>
                            </div>
                            <div className="hidden h-12 w-px bg-white/20 sm:block"></div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black text-xl font-bold text-white shadow-inner">
                                        {String(timeLeft.hours).padStart(2, "0")}
                                    </span>
                                    <span className="mt-1 text-[10px] tracking-widest text-gray-400 uppercase">
                                        Hrs
                                    </span>
                                </div>
                                <span className="mt-1 text-xl font-bold text-white">:</span>
                                <div className="flex flex-col items-center">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black text-xl font-bold text-white shadow-inner">
                                        {String(timeLeft.minutes).padStart(2, "0")}
                                    </span>
                                    <span className="mt-1 text-[10px] tracking-widest text-gray-400 uppercase">
                                        Min
                                    </span>
                                </div>
                                <span className="mt-1 text-xl font-bold text-white">:</span>
                                <div className="flex flex-col items-center">
                                    <span
                                        className={`text-gold border-gold/30 ${styles["animate-pulse-glow"]} flex h-10 w-10 items-center justify-center rounded-lg border bg-black text-xl font-bold shadow-inner`}
                                    >
                                        {String(timeLeft.seconds).padStart(2, "0")}
                                    </span>
                                    <span className="text-gold mt-1 text-[10px] tracking-widest uppercase">Sec</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                            <div className="flex items-center gap-2 text-gray-300">
                                <span className="h-2 w-2 animate-ping rounded-full bg-red-500"></span>
                                Only <strong className="px-1 tracking-widest text-white">2 SLOTS</strong> remaining
                            </div>
                            <span className="text-gold cursor-pointer text-[10px] font-bold tracking-widest uppercase hover:underline">
                                Claim Yours &rarr;
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 sm:flex-row">
                        <button className="hover:bg-gold bg-white px-10 py-5 text-xs font-bold tracking-[0.2em] text-black uppercase transition-all duration-300 hover:text-white">
                            Shop Collection
                        </button>
                        <button className="hover:border-gold hover:text-gold flex items-center justify-center gap-3 border border-white/30 px-10 py-5 text-xs font-bold tracking-[0.2em] text-white uppercase backdrop-blur-md transition-all duration-300">
                            View Lookbook
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Hero Right Content - Floating Fancy Constellation */}
                <div
                    className="relative mt-20 flex h-[500px] w-full items-center justify-center lg:mt-0 lg:h-full lg:w-1/2"
                    data-aos="zoom-in"
                    data-aos-delay="300"
                    data-aos-duration="1500"
                >
                    <div className="relative flex h-full w-full max-w-lg items-center justify-center">
                        {/* Decorative Core Glow */}
                        <div className="bg-gold/20 absolute inset-0 m-auto h-64 w-64 animate-pulse rounded-full opacity-70 blur-[80px]"></div>

                        {/* Centerpiece Image - Large Diamond */}
                        {/* Hero Item Galaxy - Simplified Bulletproof Rotation */}
                        <div className={styles["orbit-container"]}>
                            {/* OUTER GALAXY RING */}
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
                                            transformOrigin: "50% 280px", // Half of 560px
                                        }}
                                    >
                                        <div className={styles["item-content"]}>
                                            <img src={url} alt="Jewel" className="w-full drop-shadow-2xl" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* INNER GALAXY RING */}
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
                                            transformOrigin: "50% 190px", // Half of 380px
                                        }}
                                    >
                                        <div className={styles["item-content"]}>
                                            <img src={url} alt="Jewel" className="w-full drop-shadow-xl" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Sparkles */}
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={`sparkle-${i}`}
                                    className="absolute h-1 w-1 animate-pulse rounded-full bg-white shadow-[0_0_8px_white]"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 5}s`,
                                    }}
                                ></div>
                            ))}
                        </div>

                        {/* Centerpiece Image - Large Diamond */}
                        <div className={`absolute z-30 m-auto w-[60%] ${styles["animate-float"]} sm:w-[45%]`}>
                            <img
                                src="https://cdn.hstatic.net/products/1000381168/upload_f1abf23f3d2d4abe8249e0881ae040c4_grande.jpg"
                                alt="Centerpiece Diamond"
                                className="h-auto w-full rounded-full object-cover mix-blend-lighten shadow-2xl"
                            />
                            {/* Price Tag */}
                            <div className="border-gold/30 absolute -right-4 bottom-4 z-40 animate-bounce rounded-xl border bg-white/10 p-3 shadow-[0_10px_30px_rgba(212,175,55,0.2)] backdrop-blur-md delay-100">
                                <span className="mb-1 block text-[8px] font-bold tracking-widest text-gray-300 uppercase">
                                    GIA Certified
                                </span>
                                <span className="font-serif text-lg text-white">$14,500</span>
                            </div>
                        </div>

                        {/* Decorative Orbit Rings */}
                        <div className="border-gold/20 pointer-events-none absolute inset-0 m-auto h-full max-h-[400px] w-full max-w-[400px] animate-[spin_20s_linear_infinite] rounded-full border border-dashed"></div>
                        <div className="pointer-events-none absolute inset-0 m-auto h-[110%] max-h-[450px] w-[110%] max-w-[450px] animate-[spin_35s_linear_infinite_reverse] rounded-full border-[0.5px] border-white/10"></div>
                    </div>
                </div>
            </div>

            {/* Live Gold Price Ticker */}
            <div
                className="absolute bottom-0 z-30 w-full border-t border-white/10 bg-black/70 p-3 backdrop-blur-lg"
                data-aos="fade-in"
                data-aos-delay="1000"
            >
                <div className="container mx-auto flex items-center justify-center gap-8 overflow-hidden text-[11px] font-bold tracking-widest text-white uppercase">
                    <span className="text-gold flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                        </span>
                        Live Market Prices:
                    </span>
                    {Object.entries(GOLD_PRICE).map(([k, v]) => (
                        <span key={k} className="hidden sm:inline">
                            {k}: <span className="ml-1 text-gray-300">{v}</span>
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};
