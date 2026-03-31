import { ChevronRight, Phone, MapPin, ArrowRight } from "lucide-react";
import { Facebook } from "../icon/Facebook";
import { Instagram } from "../icon/Instagram";
import { Youtube } from "../icon/Youtube";
import { ScrollToTop } from "./ScrollToTop";
import { FomoNotification } from "./FomoNotification";
import { PromoBar } from "./PromoBar";
import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="border-t border-gray-200 bg-gray-50 pt-24 pb-12 transition-colors dark:border-white/5 dark:bg-[#050505]">
            <div className="container mx-auto px-4 lg:px-12">
                <div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Column 1: Brand Info */}
                    <div className="lg:col-span-4 lg:pr-12">
                        <div className="mb-6 md:mb-8 flex items-center justify-center lg:justify-start gap-3">
                            <div className="text-gold scale-90 md:scale-100">
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 2L2 9L12 22L22 9L12 2Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-[0.2em] text-gray-900 uppercase dark:text-white">
                                Yash
                            </h2>
                        </div>
                        <p className="mb-8 text-[13px] md:text-sm leading-relaxed text-gray-500 dark:text-gray-400 text-center lg:text-left">
                            Earth-mined diamonds, high jewelry, and bespoke engagement
                            rings. Handcrafted with passion, built for eternity.
                        </p>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-center lg:justify-start gap-4 text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
                                <MapPin size={16} className="text-gold shrink-0" />
                                <span>123 Diamond Avenue, NY 10036</span>
                            </div>
                            <div className="flex items-center justify-center lg:justify-start gap-4 text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
                                <Phone size={16} className="text-gold shrink-0" />
                                <span>+1 (800) 123-4567</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start gap-4">
                            {[Facebook, Instagram, Youtube].map((Icon, i) => (
                                <div key={i} className="hover:bg-gold hover:border-gold flex h-9 w-9 md:h-10 md:w-10 transform cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-gray-400 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:text-white dark:border-white/5 dark:bg-white/5">
                                    <Icon size={16} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Links Groups */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:col-span-4 md:px-10 lg:px-0">
                        <div>
                            <h3 className="mb-6 md:mb-8 font-serif text-[13px] md:text-lg font-bold tracking-[0.2em] text-gray-900 uppercase dark:text-white">
                                Service
                            </h3>
                            <ul className="space-y-3 md:space-y-4 text-[11px] md:text-sm font-medium text-gray-500 dark:text-gray-400">
                                <li>
                                    <Link href="/contact" className="hover:text-gold flex items-center gap-2 transition-all hover:translate-x-1">
                                        <ChevronRight size={12} className="text-gray-300" /> Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/policies/payment-guide" className="hover:text-gold flex items-center gap-2 transition-all hover:translate-x-1">
                                        <ChevronRight size={12} className="text-gray-300" /> Shipping
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/policies/exchange" className="hover:text-gold flex items-center gap-2 transition-all hover:translate-x-1">
                                        <ChevronRight size={12} className="text-gray-300" /> Returns
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/size-guide" className="hover:text-gold flex items-center gap-2 transition-all hover:translate-x-1">
                                        <ChevronRight size={12} className="text-gray-300" /> Size Guide
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:text-gold flex items-center gap-2 transition-all hover:translate-x-1">
                                        <ChevronRight size={12} className="text-gray-300" /> FAQ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-6 md:mb-8 font-serif text-[13px] md:text-lg font-bold tracking-[0.2em] text-gray-900 uppercase dark:text-white">
                                Discover
                            </h3>
                            <ul className="space-y-3 md:space-y-4 text-[11px] md:text-sm font-medium text-gray-500 dark:text-gray-400">
                                <li>
                                    <Link href="/about" className="hover:text-gold flex items-center gap-2 transition-all hover:translate-x-1">
                                        <ChevronRight size={12} className="text-gray-300" /> Our Story
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/collections" className="hover:text-gold flex items-center gap-2 transition-all hover:translate-x-1">
                                        <ChevronRight size={12} className="text-gray-300" /> High Jewelry
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="hover:text-gold flex items-center gap-2 transition-all hover:translate-x-1">
                                        <ChevronRight size={12} className="text-gray-300" /> Journal
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/diamond-guide" className="hover:text-gold flex items-center gap-2 transition-all hover:translate-x-1">
                                        <ChevronRight size={12} className="text-gray-300" /> Diamond Guide
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:text-gold flex items-center gap-2 transition-all hover:translate-x-1">
                                        <ChevronRight size={12} className="text-gray-300" /> Boutiques
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Column 3: Boutique & Newsletter */}
                    <div className="lg:col-span-4">
                        <h3 className="mb-6 md:mb-8 font-serif text-[13px] md:text-lg font-bold tracking-[0.2em] text-gray-900 uppercase dark:text-white text-center lg:text-left">
                            Boutique
                        </h3>
                        <div className="mb-8 h-40 md:h-48 w-full overflow-hidden rounded-xl border border-gray-100 shadow-sm dark:border-white/5">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.1583088354!2d-74.11976383964463!3d40.69766374871431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1714489835824!5m2!1sen!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                            ></iframe>
                        </div>

                        <div className="group relative max-w-md mx-auto lg:mx-0">
                            <input
                                type="email"
                                placeholder="Newsletter sign-up"
                                className="block w-full rounded-sm border border-gray-100 bg-white px-5 py-4 text-xs md:text-sm text-gray-900 shadow-sm transition-colors outline-none focus:border-gold dark:border-white/5 dark:bg-white/5 dark:text-white"
                            />
                            <button className="absolute top-0 right-0 bottom-0 flex items-center justify-center px-6 text-gold">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - Restored and Polished */}
                <div className="flex flex-col items-center justify-between gap-6 border-t border-gray-100 mt-16 pt-10 pb-6 md:flex-row dark:border-white/5">
                    <p className="text-[10px] md:text-xs font-bold tracking-widest text-gray-400 uppercase text-center md:text-left">
                        &copy; {new Date().getFullYear()} Yash Jewels. Artisan Handcrafted.
                    </p>

                    <div className="flex items-center gap-6">
                        <span className="rounded border border-gray-200 bg-white px-2 py-1 text-[9px] font-bold tracking-widest text-gray-400 dark:border-white/10 dark:bg-white/5 uppercase">
                            GIA Certified
                        </span>
                        <div className="flex items-center gap-3 text-gray-300 dark:text-gray-600">
                             <div className="h-4 w-8 rounded bg-gray-100 dark:bg-white/5 border border-transparent"></div>
                             <div className="h-4 w-8 rounded bg-gray-100 dark:bg-white/5 border border-transparent"></div>
                        </div>
                    </div>

                    <div className="flex gap-6 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        <Link href="/policies/privacy" className="hover:text-gold transition-colors">Privacy</Link>
                        <Link href="/policies/payment-guide" className="hover:text-gold transition-colors">Terms</Link>
                        <Link href="/" className="hover:text-gold transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
            <ScrollToTop />
            <FomoNotification />
            <PromoBar />
        </footer>
    );
};
