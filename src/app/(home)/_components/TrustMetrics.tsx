"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Award, Gem, ShieldCheck, Users } from "lucide-react";

interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
}

const Counter = ({ from, to, duration = 2, suffix = "" }: CounterProps) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number | null = null;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, from, to, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

export const TrustMetrics = () => {
  const secondaryMetrics = [
    {
      icon: <Users className="h-4 w-4 text-gold" />,
      label: "Global Customers",
      value: 12000,
      suffix: "+",
      description: "Connoisseurs of fine jewelry",
    },
    {
      icon: <Gem className="h-4 w-4 text-gold" />,
      label: "Luxury Boutiques",
      value: 50,
      suffix: "+",
      description: "Iconic flagship sanctuaries",
    },
    {
      icon: <ShieldCheck className="h-4 w-4 text-gold" />,
      label: "Original Guarantee",
      value: 100,
      suffix: "%",
      description: "GIA & IGI Certified Diamonds",
    },
  ];

  return (
    <section className="bg-white py-24 transition-colors duration-500 dark:bg-[#030303]">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="flex flex-col items-stretch overflow-hidden rounded-[40px] border border-gray-100 bg-gray-50/50 lg:flex-row dark:border-white/5 dark:bg-[#080808]">
          {/* Main Anchor Metric (Heritage) */}
          <div className="relative flex flex-col justify-center p-12 lg:w-1/2 lg:p-20">
            <div className="absolute inset-0 bg-linear-to-br from-gold/5 to-transparent dark:from-gold/10" />
            <div className="relative z-10">
              <span className="text-gold mb-6 block text-[10px] font-bold tracking-[0.5em] uppercase">
                The Yash Legacy
              </span>
              <h2 className="mb-8 font-serif text-5xl leading-tight text-gray-900 lg:text-7xl dark:text-white">
                25 <span className="font-light text-gray-500 italic">Years</span> <br />
                <span className="text-3xl font-light text-gray-400 lg:text-4xl">Of Excellence</span>
              </h2>
              <p className="max-w-md text-base leading-relaxed font-light text-gray-600 dark:text-gray-400">
                Since 2001, we have been the silent custodians of memories, crafting pieces that bridge the gap between human emotion and raw elemental beauty.
              </p>
              <div className="mt-10 h-px w-24 bg-gold" />
            </div>
          </div>

          {/* Secondary Metrics Grid */}
          <div className="flex flex-col justify-center bg-white p-8 lg:w-1/2 lg:p-16 dark:bg-[#0a0a0a]">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
              {secondaryMetrics.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 dark:bg-gold/20">
                      {m.icon}
                    </div>
                    <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase">
                      {m.label}
                    </span>
                  </div>
                  <div className="mb-2 font-serif text-3xl font-medium text-gray-900 dark:text-white">
                    <Counter from={0} to={m.value} suffix={m.suffix} />
                  </div>
                  <p className="text-xs font-light text-gray-500 dark:text-gray-400">
                    {m.description}
                  </p>
                  <div className="absolute -bottom-4 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full opacity-30" />
                </motion.div>
              ))}
              
              {/* Extra "Seal of Quality" for layout balance */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center justify-center rounded-2xl border border-dashed border-gold/30 bg-gold/5 p-6 text-center dark:bg-gold/10"
              >
                <div>
                  <Award className="mx-auto mb-2 h-8 w-8 text-gold" />
                  <span className="text-[9px] font-bold tracking-[0.2em] text-gray-900 uppercase dark:text-white">
                    Global Luxury Registry
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
