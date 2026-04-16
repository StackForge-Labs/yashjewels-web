"use client";

import ProductCard from "./ProductCard";
import { ArrowRight, MapPin, Clock, Flame } from "lucide-react";
import { Hero } from "./Hero";
import { ScrollDiamond } from "./ScrollDiamond";
import { TrustMetrics } from "./TrustMetrics";
import { JewelryLookbook } from "./JewelryLookbook";

interface DiamondData {
    sku: string;
    name: string;
    original: string;
    sale: string;
    discount: string;
    quantity?: number;
    status?: string;
}

export const HomeViews = ({ diamonds }: { diamonds: DiamondData[] }) => {
    return (
        <>
            {/* Scroll-driven floating diamond */}
            <ScrollDiamond />

            {/* SECTION 1: HERO / BANNER */}
            <Hero />

            {/* NEW SECTION: TRUST METRICS */}
            <TrustMetrics />

            {/* SECTION 2: SHOP BY CATEGORY (Bento Grid) */}
            <section className="bg-white py-24 transition-colors duration-500 dark:bg-[#030303]">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="mb-16 text-center" data-aos="fade-up">
                        <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">
                            Infinite Choices
                        </span>
                        <h2 className="font-serif text-3xl text-gray-900 lg:text-4xl dark:text-white">
                            Shop By Category
                        </h2>
                    </div>
                    {/* Bento Grid */}
                    <div className="grid h-auto grid-cols-1 gap-4 md:h-[600px] md:grid-cols-4">
                        <div
                            className="group relative col-span-1 h-[300px] cursor-pointer overflow-hidden rounded-xl bg-gray-100 md:col-span-2 md:row-span-2 md:h-full dark:bg-zinc-900"
                            data-aos="fade-right"
                        >
                            <img
                                src="https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=800"
                                className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                                alt="Engagement Rings"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent p-8 opacity-90 transition-opacity">
                                <span className="mb-2 font-serif text-2xl text-white lg:text-3xl">
                                    Engagement Rings
                                </span>
                                <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase transition-transform group-hover:translate-x-2">
                                    Discover Tokens of Love &rarr;
                                </span>
                            </div>
                        </div>
                        <div
                            className="group relative col-span-1 h-[250px] cursor-pointer overflow-hidden rounded-xl bg-gray-100 md:col-span-2 md:h-[292px] dark:bg-zinc-900"
                            data-aos="fade-left"
                            data-aos-delay="100"
                        >
                            <img
                                src="https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=800"
                                className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                                alt="Necklaces"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent p-8 opacity-90">
                                <span className="mb-2 font-serif text-2xl text-white lg:text-3xl">
                                    Necklaces & Masterpieces
                                </span>
                            </div>
                        </div>
                        <div
                            className="group relative col-span-1 h-[250px] cursor-pointer overflow-hidden rounded-xl bg-gray-100 md:h-[292px] dark:bg-zinc-900"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <img
                                src="https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400"
                                className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                                alt="Earrings"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent p-6 opacity-90">
                                <span className="mb-1 font-serif text-xl text-white">Diamond Earrings</span>
                            </div>
                        </div>
                        <div
                            className="group relative col-span-1 h-[250px] cursor-pointer overflow-hidden rounded-xl bg-gray-100 md:h-[292px] dark:bg-zinc-900"
                            data-aos="fade-up"
                            data-aos-delay="300"
                        >
                            <img
                                src="https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400"
                                className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                                alt="Bracelets"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent p-6 opacity-90">
                                <span className="mb-1 font-serif text-xl text-white">Luxury Bracelets</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: FEATURED COLLECTION */}
            <section className="overflow-hidden bg-gray-50 py-24 transition-colors duration-500 dark:bg-[#0a0a0a]">
                <div className="container mx-auto flex flex-col items-center gap-16 px-4 lg:flex-row lg:px-12">
                    <div className="w-full lg:w-5/12" data-aos="fade-right">
                        <span className="text-gold mb-6 block text-[10px] font-bold tracking-[0.4em] uppercase">
                            High Jewelry
                        </span>
                        <h2 className="mb-8 font-serif text-4xl leading-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                            The Imperial <br />
                            <span className="font-light text-gray-500 italic">Collection</span>
                        </h2>
                        <p className="mb-10 text-base leading-relaxed font-light text-gray-600 dark:text-gray-400">
                            A perfect intersection between centuries-old craftsmanship and the raw beauty of the world's
                            most scarce diamonds. Every masterpiece is an impeccable statement of class.
                        </p>
                        <button className="hover:bg-gold dark:hover:bg-gold bg-gray-900 px-10 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase transition-colors duration-300 dark:bg-white dark:text-black dark:hover:text-white">
                            View Details
                        </button>
                    </div>
                    <div
                        className="relative h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl lg:h-[650px] lg:w-7/12"
                        data-aos="fade-left"
                        data-aos-delay="200"
                    >
                        <div className="absolute inset-0 z-10 bg-linear-to-t from-black/60 to-transparent" />
                        <img
                            src="https://images.pexels.com/photos/2253818/pexels-photo-2253818.jpeg?auto=compress&cs=tinysrgb&w=1200"
                            alt="Featured Collection"
                            className="h-full w-full object-cover transition-transform duration-[3s] hover:scale-110"
                        />
                        <div className="custom-scrollbar absolute right-8 bottom-8 left-8 z-20 flex gap-6 overflow-x-auto pb-4">
                            <div className="flex min-w-[250px] cursor-pointer items-center gap-4 rounded-xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur-md transition-transform hover:-translate-y-2 dark:border-white/10 dark:bg-black/90">
                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                                    <img
                                        src="https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=100"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="mb-1 text-sm font-bold text-gray-900 dark:text-white">
                                        VVS1 Diamond
                                    </h4>
                                    <p className="text-gold text-xs font-bold">$12,000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: NEW ARRIVALS */}
            <section className="bg-white py-24 transition-colors duration-500 dark:bg-[#030303]">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="mb-16 flex flex-col items-end justify-between gap-4 sm:flex-row" data-aos="fade-up">
                        <div>
                            <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">
                                The Modern Essentials
                            </span>
                            <h2 className="font-serif text-3xl text-gray-900 lg:text-4xl dark:text-white">
                                Latest Arrivals
                            </h2>
                        </div>
                        <button className="hover:text-gold hover:border-gold items-center gap-2 border-b border-gray-900 pb-1 text-xs font-bold tracking-[0.2em] text-gray-900 uppercase transition-colors dark:border-white dark:text-white">
                            View Entire Collection &rarr;
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {diamonds.slice(0, 4).map((d, i) => (
                            <div data-aos="fade-up" data-aos-delay={i * 100} key={d.sku}>
                                <ProductCard
                                    sku={d.sku}
                                    productId={d.sku} // Enable live features for all
                                    name={d.name}
                                    category="New Collection"
                                    original={d.original}
                                    sale={d.sale}
                                    discount={d.discount}
                                    image1={
                                        "https://tamluxury.vn/wp-content/uploads/2026/01/Thiet-ke-nam-2026-Nhan-nu-kim-cuong-Organ-Ma-SP-NNU1618-scaled.jpg"
                                    }
                                    image2={
                                        "https://tamluxury.vn/wp-content/uploads/2025/12/Nhan-nu-kim-cuong-thien-nhien-Mia-Ma-SP-NNU1544-scaled.jpg"
                                    }
                                    badge="NEW"
                                    quantity={d.quantity}
                                    status={d.status}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 5: BEST SELLERS */}
            <section className="bg-gray-50 py-24 transition-colors duration-500 dark:bg-[#080808]">
                <div className="container mx-auto mb-16 px-4 text-center lg:px-12" data-aos="fade-up">
                    <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">
                        Signature Selection
                    </span>
                    <h2 className="font-serif text-3xl text-gray-900 lg:text-4xl dark:text-white">Best Sellers</h2>
                </div>
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {diamonds.slice(4, 8).map((d, i) => (
                            <div data-aos="fade-up" data-aos-delay={i * 100} key={d.sku}>
                                <ProductCard
                                    sku={d.sku}
                                    productId={d.sku}
                                    name={d.name.replace("Diamond", "Pendant")}
                                    category="Signature"
                                    original={d.original}
                                    sale={d.sale}
                                    discount={d.discount}
                                    image1={
                                        "https://tamluxury.vn/wp-content/uploads/2026/03/Thiet-ke-mat-day-chuyen-Halo-tron-dac-biet-Melody-Ma-MD878-1-scaled.jpg"
                                    }
                                    image2={
                                        "https://tamluxury.vn/wp-content/uploads/2026/03/Mat-day-chuyen-kim-cuong-thien-nhien-Milkway-Ma-MD773-1-scaled.jpg"
                                    }
                                    badge="HOT"
                                    quantity={d.quantity}
                                    status={d.status}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW SECTION: JEWELRY LOOKBOOK */}
            <JewelryLookbook />

            {/* SECTION 6 & 7: HIS & HERS (Women's & Men's Split Layout) */}
            <section className="bg-white transition-colors duration-500 dark:bg-[#030303]">
                {/* Women's Component */}
                <div className="flex flex-col xl:flex-row">
                    <div className="group relative min-h-[500px] overflow-hidden xl:w-1/2">
                        <img
                            src="https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=1200"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                            alt="Women Jewelry"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-8 text-center">
                            <span
                                className="text-gold mb-4 text-[10px] font-bold tracking-[0.4em] uppercase"
                                data-aos="fade-down"
                            >
                                Radiant Elegance
                            </span>
                            <h2 className="mb-8 font-serif text-4xl text-white lg:text-6xl" data-aos="fade-up">
                                Women's Jewelry
                            </h2>
                            <button
                                className="hover:bg-gold bg-white px-8 py-3 text-xs font-bold tracking-[0.2em] text-black uppercase transition-colors hover:text-white"
                                data-aos="zoom-in"
                                data-aos-delay="200"
                            >
                                Discover
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center bg-gray-50 p-8 lg:p-16 xl:w-1/2 dark:bg-[#0a0a0a]">
                        <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
                            {diamonds.slice(0, 2).map((d) => (
                                <ProductCard
                                    key={d.sku}
                                    sku={d.sku}
                                    productId={d.sku}
                                    name={"Premium Women's Ring " + d.sku}
                                    category="Women's Line"
                                    original={d.original}
                                    sale={d.sale}
                                    discount={d.discount}
                                    image1="https://tamluxury.vn/wp-content/uploads/2025/11/Xu-huong-2025-Nhan-nu-kim-cuong-Dia-NNU1480-scaled.jpg"
                                    image2="https://tamluxury.vn/wp-content/uploads/2025/11/Nhan-nu-kim-cuong-xuat-sac-Queenie-Ma-NNU1533-scaled.jpg"
                                />
                            ))}
                        </div>
                    </div>
                </div>
                {/* Men's Component */}
                <div className="flex flex-col-reverse xl:flex-row">
                    <div className="flex items-center justify-center bg-gray-50 p-8 lg:p-16 xl:w-1/2 dark:bg-[#0a0a0a]">
                        <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
                            {diamonds.slice(2, 4).map((d) => (
                                <ProductCard
                                    key={d.sku}
                                    sku={d.sku}
                                    productId={d.sku}
                                    name={"Majestic Men's Ring " + d.sku}
                                    category="Men's Line"
                                    original={d.original}
                                    sale={d.sale}
                                    discount={d.discount}
                                    image1="https://tamluxury.vn/wp-content/uploads/2025/11/3.NHAN-NAM-POST-WEB-UP-LAI-SIZE-NHO.jpg"
                                    image2="https://tamluxury.vn/wp-content/uploads/2025/11/3.NHAN-NAM-POST-WEB-UP-LAI-SIZE-NHO.jpg"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="group relative min-h-[500px] overflow-hidden xl:w-1/2">
                        <img
                            src="https://images.pexels.com/photos/298859/pexels-photo-298859.jpeg?auto=compress&cs=tinysrgb&w=1200"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                            alt="Men Jewelry"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-8 text-center">
                            <span
                                className="text-gold mb-4 text-[10px] font-bold tracking-[0.4em] uppercase"
                                data-aos="fade-down"
                            >
                                Sophisticated Power
                            </span>
                            <h2 className="mb-8 font-serif text-4xl text-white lg:text-6xl" data-aos="fade-up">
                                Men's Jewelry
                            </h2>
                            <button
                                className="hover:bg-gold bg-white px-8 py-3 text-xs font-bold tracking-[0.2em] text-black uppercase transition-colors hover:text-white"
                                data-aos="zoom-in"
                                data-aos-delay="200"
                            >
                                Discover
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 8: BRIDAL PARALLAX */}
            <section className="relative overflow-hidden bg-black/80 py-40">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.pexels.com/photos/2253818/pexels-photo-2253818.jpeg?auto=compress&cs=tinysrgb&w=1600"
                        className="fixed-bg h-full w-full object-cover opacity-60"
                        alt="Bridal"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                </div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <span
                        className="text-gold mb-4 inline-block text-[10px] font-bold tracking-[0.4em] uppercase"
                        data-aos="fade-down"
                    >
                        The Wedding Sanctuary
                    </span>
                    <h2 className="mb-6 font-serif text-5xl text-white lg:text-7xl" data-aos="fade-up">
                        Bridal Collection
                    </h2>
                    <p
                        className="mx-auto mb-12 max-w-xl text-lg font-light text-gray-300"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        The beginning of eternal happiness. Meticulously crafted wedding rings exclusively for your
                        grand momentous day.
                    </p>
                    <button
                        className="hover:bg-gold hover:shadow-gold/50 bg-white px-12 py-4 text-xs font-bold tracking-[0.2em] text-black uppercase shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 hover:text-white"
                        data-aos="zoom-in"
                        data-aos-delay="200"
                    >
                        Enter Pavilion
                    </button>
                </div>
            </section>

            {/* SECTION 9: JOURNAL & EDUCATION */}
            <section className="bg-white py-24 transition-colors duration-500 dark:bg-[#030303]">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="mb-16 flex flex-col items-end justify-between gap-4 sm:flex-row" data-aos="fade-up">
                        <div>
                            <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">
                                Magazine & Education
                            </span>
                            <h2 className="font-serif text-3xl text-gray-900 lg:text-4xl dark:text-white">
                                Journal Spotlight
                            </h2>
                        </div>
                        <button className="hover:text-gold hover:border-gold items-center gap-2 border-b border-gray-900 pb-1 text-xs font-bold tracking-[0.2em] text-gray-900 uppercase transition-colors dark:border-white dark:text-white">
                            Read All Articles &rarr;
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                        {[
                            {
                                title: "The First-Time Diamond Buyer's Guide (The 4Cs)",
                                img: "https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg",
                            },
                            {
                                title: "How to maintain your 18K Gold Jewelry brilliantly",
                                img: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg",
                            },
                            {
                                title: "Platinum Wedding Band Trends for Fall 2026",
                                img: "https://images.pexels.com/photos/3266700/pexels-photo-3266700.jpeg",
                            },
                        ].map((post, i) => (
                            <div key={i} className="group cursor-pointer" data-aos="fade-up" data-aos-delay={i * 150}>
                                <div className="mb-6 h-64 overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-900">
                                    <img
                                        src={post.img + "?auto=compress&cs=tinysrgb&w=600"}
                                        className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                                        alt="Blog"
                                        loading="lazy"
                                    />
                                </div>
                                <span className="mb-3 block text-[10px] font-bold tracking-widest text-gray-400 uppercase dark:text-gray-500">
                                    Diamond Knowledge
                                </span>
                                <h3 className="group-hover:text-gold font-serif text-xl tracking-wide text-gray-900 transition-colors dark:text-gray-100">
                                    {post.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 10: STORES (Luxurious Floating Cards) */}
            <section className="dark:bg-dark-bg relative bg-gray-50 py-32 transition-colors duration-500">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="mb-16 text-center" data-aos="fade-up">
                        <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.4em] uppercase">
                            Global Presence
                        </span>
                        <h2 className="font-serif text-4xl text-gray-900 lg:text-5xl dark:text-white">
                            Discover <span className="font-light text-gray-500 italic">Our Boutiques</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl font-light text-gray-500">
                            Step into a world of ultimate luxury. Experience world-class personalized service provided
                            by our expert jewelry consultants in our flagship sanctuaries.
                        </p>
                    </div>

                    <div className="group relative h-[850px] overflow-hidden rounded-3xl shadow-2xl md:h-[600px]">
                        {/* Background Image with Parallax effect */}
                        <div className="absolute inset-0">
                            <img
                                src="https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=1600"
                                className="h-full w-full object-cover transition-transform duration-[10s] group-hover:scale-110"
                                alt="Flagship Boutique"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/10 dark:from-black dark:via-black/70 dark:to-black/30" />
                        </div>

                        {/* Store Cards Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-12">
                            <div className="relative z-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {/* Vietnam Flagship */}
                                <div
                                    className="hover:border-gold/50 transform cursor-pointer rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/20 dark:bg-black/40"
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                >
                                    <div className="mb-6 flex items-start justify-between">
                                        <div>
                                            <span className="text-gold mb-1 block text-[9px] font-bold tracking-widest uppercase">
                                                Flagship Store
                                            </span>
                                            <h3 className="font-serif text-2xl text-white">Ho Chi Minh</h3>
                                        </div>
                                        <div className="bg-gold/20 rounded-full p-2">
                                            <MapPin className="text-gold h-5 w-5" />
                                        </div>
                                    </div>
                                    <ul className="mb-8 space-y-4 text-sm font-light text-gray-300">
                                        <li className="flex items-start gap-3">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                            <span>
                                                Unit L1-01, Saigon Centre,
                                                <br />
                                                65 Le Loi, District 1
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <Clock className="h-4 w-4 shrink-0 text-gray-400" />
                                            <span>Mon - Sun: 09:30 - 22:00</span>
                                        </li>
                                    </ul>
                                    <button className="w-full border border-white/30 py-3 text-xs tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black">
                                        Book Appointment
                                    </button>
                                </div>

                                {/* Hanoi Boutique */}
                                <div
                                    className="hover:border-gold/50 transform cursor-pointer rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/20 dark:bg-black/40"
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                >
                                    <div className="mb-6 flex items-start justify-between">
                                        <div>
                                            <span className="text-gold mb-1 block text-[9px] font-bold tracking-widest uppercase">
                                                Grand Boutique
                                            </span>
                                            <h3 className="font-serif text-2xl text-white">Hanoi</h3>
                                        </div>
                                        <div className="bg-gold/20 rounded-full p-2">
                                            <MapPin className="text-gold h-5 w-5" />
                                        </div>
                                    </div>
                                    <ul className="mb-8 space-y-4 text-sm font-light text-gray-300">
                                        <li className="flex items-start gap-3">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                            <span>
                                                Lotte Center Hanoi,
                                                <br />
                                                54 Lieu Giai, Ba Dinh
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <Clock className="h-4 w-4 shrink-0 text-gray-400" />
                                            <span>Mon - Sun: 10:00 - 21:00</span>
                                        </li>
                                    </ul>
                                    <button className="w-full border border-white/30 py-3 text-xs tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black">
                                        Book Appointment
                                    </button>
                                </div>

                                {/* Singapore Concept */}
                                <div
                                    className="hover:border-gold/50 group/box hidden cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-transparent p-8 text-center transition-colors duration-300 lg:flex"
                                    data-aos="fade-up"
                                    data-aos-delay="300"
                                >
                                    <div className="border-gold/50 group-hover/box:bg-gold/10 mb-6 flex h-16 w-16 items-center justify-center rounded-full border transition-colors">
                                        <ArrowRight className="text-gold h-6 w-6 animate-pulse" />
                                    </div>
                                    <h3 className="mb-2 font-serif text-xl text-white">Singapore Pavilion</h3>
                                    <p className="mb-6 text-sm font-light text-gray-400">
                                        Opening Winter 2026 at Marina Bay Sands.
                                    </p>
                                    <span className="text-gold group-hover/box:border-gold border-b border-transparent text-[10px] tracking-widest uppercase transition-colors">
                                        Join Waiting List
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
