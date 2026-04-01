"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cubic bezier interpolation helper.
 */
function cubicBezier(
    t: number,
    p0: [number, number],
    p1: [number, number],
    p2: [number, number],
    p3: [number, number],
): [number, number] {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;
    const x = uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0];
    const y = uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1];
    return [x, y];
}

function multiSegmentBezier(
    progress: number,
    segments: Array<[[number, number], [number, number], [number, number], [number, number]]>,
): [number, number] {
    const totalSegments = segments.length;
    const scaledProgress = progress * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
    const segmentT = scaledProgress - segmentIndex;
    const seg = segments[segmentIndex];
    return cubicBezier(segmentT, seg[0], seg[1], seg[2], seg[3]);
}

/**
 * ScrollDiamond — A "dance" of 3 diamonds that follow unique paths as the user scrolls.
 */
export const ScrollDiamond = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const rafRef = useRef<number>(0);

    // Diamond 1: Main piece (The Hero centerpiece)
    const PATH_1: Array<[[number, number], [number, number], [number, number], [number, number]]> = [
        [
            [72, 48],
            [85, 20],
            [10, 30],
            [15, 45],
        ],
        [
            [15, 45],
            [20, 65],
            [90, 60],
            [80, 75],
        ],
        [
            [80, 75],
            [70, 90],
            [15, 85],
            [12, 92],
        ],
    ];

    // Diamond 2: Smaller accompanist (Curves more wildly)
    const PATH_2: Array<[[number, number], [number, number], [number, number], [number, number]]> = [
        [
            [75, 52],
            [60, 10],
            [90, 20],
            [85, 40],
        ],
        [
            [85, 40],
            [80, 70],
            [20, 60],
            [25, 78],
        ],
        [
            [25, 78],
            [30, 95],
            [85, 90],
            [82, 95],
        ],
    ];

    // Diamond 3: Distant shimmer (Moves slower, stays high longer)
    const PATH_3: Array<[[number, number], [number, number], [number, number], [number, number]]> = [
        [
            [68, 45],
            [50, 0],
            [10, 10],
            [12, 35],
        ],
        [
            [12, 35],
            [15, 55],
            [30, 70],
            [45, 65],
        ],
        [
            [45, 65],
            [60, 60],
            [80, 85],
            [78, 92],
        ],
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const maxScroll = 2500;
                setScrollProgress(Math.min(scrollY / maxScroll, 1));
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener("scroll", handleScroll);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const renderDiamond = (
        progress: number,
        path: Array<[[number, number], [number, number], [number, number], [number, number]]>,
        config: { baseSize: number; rotateOffset: number; z: number; glowColor: string; delayFactor: number },
    ) => {
        // Apply individual delay/easing logic for organic feel
        const individualProgress = Math.min(Math.pow(progress, config.delayFactor), 1);
        const easedProgress = 1 - Math.pow(1 - individualProgress, 3);
        const [x, y] = multiSegmentBezier(easedProgress, path);

        const opacity = progress > 0.98 ? 1 - (progress - 0.98) / 0.02 : 1;
        const scale = (1 + Math.sin(individualProgress * Math.PI) * 0.15) * (0.8 + config.z * 0.2);
        const rotateY = individualProgress * (720 + config.rotateOffset);
        const rotateZ = Math.sin(individualProgress * Math.PI * 4) * 25;
        const glowScale = 1.3 + Math.sin(individualProgress * Math.PI * 2) * 0.4;

        return (
            <div
                style={{
                    position: "absolute",
                    left: `${x}vw`,
                    top: `${y}vh`,
                    transform: `translate(-50%, -50%) scale(${scale}) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
                    opacity,
                    willChange: "transform, left, top, opacity",
                    transformStyle: "preserve-3d",
                    zIndex: Math.floor(config.z * 100),
                }}
            >
                <img
                    src="https://sancydiamond.vn/wp-content/uploads/2025/05/4.png"
                    alt=""
                    className="object-contain drop-shadow-[0_20px_50px_rgba(212,175,55,0.4)]"
                    style={{
                        width: `${config.baseSize}px`,
                        height: `${config.baseSize}px`,
                        filter: config.z < 0.5 ? "blur(1px) brightness(1.2)" : "brightness(1.1)",
                    }}
                    draggable={false}
                />

                {/* Sparkling Ring Orbit around diamond */}
                <div
                    className="absolute inset-0 -m-8 animate-[spin_5s_linear_infinite] rounded-full border border-white/10"
                    style={{
                        background: `radial-gradient(circle at center, transparent 70%, ${config.glowColor}22 100%)`,
                    }}
                />

                {/* Secondary Sparkle Layer */}
                <div className="border-gold/5 absolute inset-0 -m-12 animate-[spin_8s_linear_infinite_reverse] rounded-full border" />

                <div
                    className="absolute inset-0 -z-10 rounded-full opacity-40 blur-2xl"
                    style={{
                        backgroundColor: config.glowColor,
                        transform: `scale(${glowScale})`,
                        filter: "blur(40px)",
                    }}
                />
            </div>
        );
    };

    return (
        <div
            className="pointer-events-none fixed top-0 left-0 z-50 hidden h-screen w-screen lg:block"
            aria-hidden="true"
            style={{ perspective: "1500px" }}
        >
            {/* Diamond 1: The Lead (Larger) */}
            {renderDiamond(scrollProgress, PATH_1, {
                baseSize: 220,
                rotateOffset: 0,
                z: 1,
                glowColor: "#d4af37",
                delayFactor: 1,
            })}

            {/* Diamond 2: The Sider */}
            {renderDiamond(scrollProgress, PATH_2, {
                baseSize: 130,
                rotateOffset: 180,
                z: 0.7,
                glowColor: "#f5d76e",
                delayFactor: 1.1,
            })}

            {/* Diamond 3: The Distant Shimmer */}
            {renderDiamond(scrollProgress, PATH_3, {
                baseSize: 90,
                rotateOffset: -90,
                z: 0.4,
                glowColor: "#ffffff",
                delayFactor: 0.9,
            })}
        </div>
    );
};
