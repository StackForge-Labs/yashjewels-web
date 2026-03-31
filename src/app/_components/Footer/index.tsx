import { ChevronRight, Phone, MapPin, ArrowRight } from "lucide-react";
import { Facebook } from "../icon/Facebook";
import { Instagram } from "../icon/Instagram";
import { Youtube } from "../icon/Youtube";
import { ScrollToTop } from "./ScrollToTop";
import { FomoNotification } from "./FomoNotification";

export const Footer = () => {
    return (
        <footer className="border-t border-gray-200 bg-gray-50 pt-24 pb-12 transition-colors dark:border-white/5 dark:bg-[#050505]">
            <div className="container mx-auto px-4 lg:px-12">
                <div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Column 1: Brand Info */}
                    <div className="lg:col-span-4 lg:pr-12">
                        <div className="mb-8 flex items-center gap-3">
                            <div className="text-gold">
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
                            <h2 className="font-serif text-3xl font-bold tracking-[0.2em] text-gray-900 uppercase dark:text-white">
                                Yash
                            </h2>
                        </div>
                        <p className="mb-8 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                            The ultimate destination for earth-mined diamonds, high jewelry, and bespoke engagement
                            rings. Handcrafted with passion, built for eternity. Discover true luxury crafted to your
                            dreams.
                        </p>
                        <div className="mb-8 flex items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                            <MapPin size={18} className="text-gold" />
                            <span>123 Diamond Avenue, New York, NY 10036</span>
                        </div>
                        <div className="mb-8 flex items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                            <Phone size={18} className="text-gold" />
                            <span>+1 (800) 123-4567</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hover:bg-gold hover:border-gold flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:text-white dark:border-white/5 dark:bg-[#111] dark:text-gray-400">
                                <Facebook size={18} />
                            </div>
                            <div className="hover:bg-gold hover:border-gold flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:text-white dark:border-white/5 dark:bg-[#111] dark:text-gray-400">
                                <Instagram size={18} />
                            </div>
                            <div className="hover:bg-gold hover:border-gold flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:text-white dark:border-white/5 dark:bg-[#111] dark:text-gray-400">
                                <Youtube size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Links Groups */}
                    <div className="grid grid-cols-2 gap-8 lg:col-span-4">
                        <div>
                            <h3 className="mb-8 font-serif text-lg font-bold tracking-widest text-gray-900 uppercase dark:text-white">
                                Customer Care
                            </h3>
                            <ul className="space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {[
                                    "Contact Us",
                                    "Shipping & Returns",
                                    "Ring Size Guide",
                                    "Track Order",
                                    "FAQ",
                                    "Book Appointment",
                                ].map((link, idx) => (
                                    <li key={idx}>
                                        <a
                                            href="#"
                                            className="hover:text-gold flex items-center gap-2 transition-all hover:translate-x-1"
                                        >
                                            <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />{" "}
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-8 font-serif text-lg font-bold tracking-widest text-gray-900 uppercase dark:text-white">
                                Discover Yash
                            </h3>
                            <ul className="space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {[
                                    "Our Story",
                                    "High Jewelry",
                                    "The Journal",
                                    "Diamond Guide",
                                    "Boutiques",
                                    "Careers",
                                ].map((link, idx) => (
                                    <li key={idx}>
                                        <a
                                            href="#"
                                            className="hover:text-gold flex items-center gap-2 transition-all hover:translate-x-1"
                                        >
                                            <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />{" "}
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Column 3: Maps & Newsletter */}
                    <div className="lg:col-span-4">
                        <h3 className="mb-8 font-serif text-lg font-bold tracking-widest text-gray-900 uppercase dark:text-white">
                            Visit Our Boutique
                        </h3>
                        <div className="mb-8 w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-white/10">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.1583088354!2d-74.11976383964463!3d40.69766374871431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1714489835824!5m2!1sen!2s"
                                width="100%"
                                height="200"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                        <p className="mb-6 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <div className="group relative">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="focus:border-gold dark:focus:border-gold block w-full rounded-sm border border-gray-200 bg-white px-5 py-4 text-sm text-gray-900 shadow-sm transition-colors outline-none dark:border-white/10 dark:bg-[#111] dark:text-white"
                            />
                            <button className="hover:text-gold absolute top-0 right-0 bottom-0 flex items-center justify-center px-6 text-gray-900 transition-colors dark:text-white">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 pb-4 md:flex-row dark:border-white/5">
                    <p className="text-xs font-medium tracking-wide text-gray-500">
                        &copy; {new Date().getFullYear()} Yash Jewels. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4 text-gray-400">
                        <span className="rounded border border-gray-300 bg-white px-2 py-1 text-[10px] font-bold tracking-widest opacity-70 dark:border-gray-700 dark:bg-[#111]">
                            GIA CERTIFIED
                        </span>
                        <span className="font-serif text-lg italic">Visa</span>
                        <span className="font-sans text-lg font-bold italic">
                            Pay<span className="text-blue-500">Pal</span>
                        </span>
                    </div>

                    <div className="flex gap-6 text-[11px] font-medium tracking-wider text-gray-500 uppercase">
                        <a href="#" className="hover:text-gold transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-gold transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="hover:text-gold transition-colors">
                            Sitemap
                        </a>
                    </div>
                </div>
            </div>
            <ScrollToTop />
            <FomoNotification />
        </footer>
    );
};
