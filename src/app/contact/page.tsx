"use client";
import { PageHero } from "../_components/PageHero";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Loader2 } from "lucide-react";
import { Instagram } from "../_components/icon/Instagram";
import { Facebook } from "../_components/icon/Facebook";
import { Youtube } from "../_components/icon/Youtube";
import { useState } from "react";
import { vendorService } from "@/services/vendor.service";
import { toast } from "sonner";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        city: "",
        subject: "General Inquiry",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const res = await vendorService.submitInquiry({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message
            });

            if (res.success) {
                toast.success("Thank you! Your inquiry has been sent to our experts.");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    city: "",
                    subject: "General Inquiry",
                    message: "",
                });
            } else {
                toast.error(res.message || "Failed to send inquiry. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <PageHero
                title="Get in Touch"
                subtitle="Our experts are here to help you with your jewelry and custom design needs."
                breadcrumbs={[{ label: "Contact" }]}
                backgroundImage="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=2000"
            />

            <section className="dark:bg-dark-bg bg-white py-12 transition-colors md:py-24">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
                        {/* Contact Form */}
                        <div className="rounded-3xl border border-gray-100 p-8 shadow-sm md:p-12 dark:border-white/5 dark:bg-white/2">
                            <h2 className="mb-8 font-serif text-3xl text-gray-900 dark:text-white">Send a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                            Full Name *
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            className="focus:border-gold w-full rounded-xl border border-gray-100 bg-white px-5 py-4 text-sm transition-colors outline-none dark:border-white/5 dark:bg-white/5 dark:text-white"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                            Email Address *
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            className="focus:border-gold w-full rounded-xl border border-gray-100 bg-white px-5 py-4 text-sm transition-colors outline-none dark:border-white/5 dark:bg-white/5 dark:text-white"
                                            placeholder="email@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                            Phone Number *
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            className="focus:border-gold w-full rounded-xl border border-gray-100 bg-white px-5 py-4 text-sm transition-colors outline-none dark:border-white/5 dark:bg-white/5 dark:text-white"
                                            placeholder="+84 900 000 000"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            className="focus:border-gold w-full rounded-xl border border-gray-100 bg-white px-5 py-4 text-sm transition-colors outline-none dark:border-white/5 dark:bg-white/5 dark:text-white"
                                            placeholder="Your location"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                        Subject
                                    </label>
                                    <select
                                        className="focus:border-gold w-full rounded-xl border border-gray-100 bg-white px-5 py-4 text-sm transition-colors outline-none dark:border-white/5 dark:bg-white/5 dark:text-white"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    >
                                        <option>General Question</option>
                                        <option>Custom Jewelry</option>
                                        <option>Repair Service</option>
                                        <option>Order Shipping</option>
                                        <option>Become a Partner</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                        Message *
                                    </label>
                                    <textarea
                                        required
                                        className="focus:border-gold w-full rounded-xl border border-gray-100 bg-white px-5 py-4 text-sm transition-colors outline-none dark:border-white/5 dark:bg-white/5 dark:text-white"
                                        rows={5}
                                        placeholder="How can we assist you today?"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-gold group shadow-gold/20 flex h-16 w-full items-center justify-center gap-3 rounded-2xl text-xs font-bold tracking-[0.3em] text-white uppercase shadow-lg transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            Send Message
                                            <Send size={16} className="transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Contact Info & Locations */}
                        <div className="flex flex-col justify-between space-y-12">
                            <div className="relative aspect-4/5 overflow-hidden rounded-3xl">
                                <img
                                    src="https://images.unsplash.com/photo-1596944222042-498c56cc77b2?auto=format&fit=crop&q=80&w=800"
                                    className="h-full w-full object-cover brightness-90 grayscale"
                                    alt="Necklace Guide Visual"
                                />
                                <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/60 to-transparent p-8">
                                    <p className="text-xs font-medium text-white italic opacity-80">
                                        Reference guide for standard necklace lengths.
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h2 className="mb-8 font-serif text-3xl text-gray-900 dark:text-white">Our Story</h2>
                                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="text-gold flex items-center gap-3">
                                            <Phone size={18} />
                                            <span className="text-[10px] font-bold tracking-widest uppercase">
                                                Hotline
                                            </span>
                                        </div>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                                            +1 (800) 123-4567
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Available 24/7 for VIP Service
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-gold flex items-center gap-3">
                                            <Mail size={18} />
                                            <span className="text-[10px] font-bold tracking-widest uppercase">
                                                Email
                                            </span>
                                        </div>
                                        <div className="from-gold w-full rounded-t-lg bg-linear-to-t to-amber-300 transition-all hover:brightness-110" />
                                    </div>
                                </div>
                            </div>

                            {/* Boutique Locations */}
                            <div className="space-y-6">
                                <h3 className="text-[11px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                                    Flagship Boutiques
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        {
                                            city: "New York",
                                            address: "123 Diamond Avenue, NY 10036",
                                            hours: "10AM - 8PM Daily",
                                        },
                                        {
                                            city: "London",
                                            address: "45 Mayfair Street, W1K 2PB",
                                            hours: "10AM - 7PM Mon-Sat",
                                        },
                                        {
                                            city: "Ho Chi Minh City",
                                            address: "99 Dong Khoi, District 1, HCMC",
                                            hours: "9AM - 9PM Daily",
                                        },
                                    ].map((location, i) => (
                                        <div
                                            key={location.city}
                                            className="flex gap-4 rounded-2xl border border-gray-100 p-6 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                                        >
                                            <div className="bg-gold/10 text-gold flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {location.city}
                                                </h4>
                                                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
                                                    <div
                                                        className="from-gold h-full rounded-full bg-linear-to-r to-amber-300"
                                                        style={{ width: `${100 - i * 20}%` }}
                                                    />
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    {location.address}
                                                </p>
                                                <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400">
                                                    <Clock size={12} className="text-gold" />
                                                    {location.hours}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Social Presence */}
                            <div className="space-y-6">
                                <h3 className="text-[11px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                                    Connect With Us
                                </h3>
                                <div className="flex gap-4">
                                    {[Instagram, Facebook, Youtube, MessageSquare].map((Icon, i) => (
                                        <a
                                            key={i}
                                            href="#"
                                            className="hover:bg-gold flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 text-gray-400 transition-all hover:-translate-y-1 hover:text-white dark:border-white/5 dark:bg-white/5"
                                        >
                                            <Icon size={20} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple Map Placeholder */}
            <section className="h-[500px] w-full grayscale transition-all hover:grayscale-0">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.1583088354!2d-74.11976383964463!3d40.69766374871431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1714489835824!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </section>
        </>
    );
}
