"use client";

import { motion } from "framer-motion";

const lookbookImages = [
  {
    src: "https://images.unsplash.com/photo-1633934542430-0905ccb5f050?q=80&w=2225&auto=format&fit=crop",
    title: "The Regal Aura",
    description: "Necklace Collection 2026",
    className: "md:col-span-2 md:row-span-2",
    delay: 0.1,
  },
  {
    src: "/images/lookbook/model_1.png",
    title: "Timeless Grace",
    description: "Gala Dinner Set",
    className: "md:col-span-1 md:row-span-1",
    delay: 0.2,
  },
  {
    src: "/images/lookbook/model_2.png",
    title: "Celestial Spark",
    description: "Bridal Couture",
    className: "md:col-span-1 md:row-span-1",
    delay: 0.3,
  },
  {
    src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1288&auto=format&fit=crop",
    title: "Eternal Bonds",
    description: "Diamond Masterpiece",
    className: "md:col-span-2 md:row-span-2",
    delay: 0.4,
  },
  {
    src: "/images/lookbook/model_3.png",
    title: "Modern Muse",
    description: "Contemporary Style",
    className: "md:col-span-1 md:row-span-2",
    delay: 0.5,
  },
  {
    src: "https://images.unsplash.com/photo-1599458349289-18f0ee82e6ed?q=80&w=1289&auto=format&fit=crop",
    title: "Luminous Glow",
    description: "Golden Accent",
    className: "md:col-span-1 md:row-span-1",
    delay: 0.6,
  },
  {
    src: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
    title: "Midnight Star",
    description: "Royal Collection",
    className: "md:col-span-2 md:row-span-1",
    delay: 0.7,
  },
  {
    src: "/images/lookbook/model_4.png",
    title: "Infinite Harmony",
    description: "Soulmate Bands",
    className: "md:col-span-1 md:row-span-1",
    delay: 0.8,
  },
];

export const JewelryLookbook = () => {
  return (
    <section className="bg-white py-24 transition-colors duration-500 dark:bg-[#030303]">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="mb-16 text-center" data-aos="fade-up">
          <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.4em] uppercase">
            The Living Art
          </span>
          <h2 className="mb-6 font-serif text-4xl text-gray-900 lg:text-5xl dark:text-white">
            Jewelry <span className="font-light text-gray-500 italic">In Action</span>
          </h2>
          <p className="mx-auto max-w-2xl font-light text-gray-500 dark:text-gray-400">
            Witness the confluence of craftsmanship and personality. Our pieces are more than jewelry; they are a statement of your unique soul.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {lookbookImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: img.delay }}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 ${img.className}`}
            >
              <img
                src={img.src}
                className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                alt={img.title}
                loading="lazy"
              />
              <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/20 to-transparent p-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="flex h-full flex-col justify-end">
                  <span className="text-gold mb-2 text-xs font-bold tracking-widest uppercase">
                    {img.description}
                  </span>
                  <h3 className="mb-2 font-serif text-2xl text-white lg:text-3xl">
                    {img.title}
                  </h3>
                  <div className="h-0.5 w-12 bg-gold transition-all duration-500 group-hover:w-24" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
