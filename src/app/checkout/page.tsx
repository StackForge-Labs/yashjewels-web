"use client";

import { useState } from "react";
import { PageHero } from "../_components/PageHero";
import {
    MapPin, CreditCard, Shield, ChevronRight, Check,
    Truck, ShieldCheck, ArrowRight, Package, Gift,
    AlertTriangle, Lock
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const STEPS = ["Address", "Insurance", "Payment", "Review"];

const MOCK_ITEMS = [
    { name: "Mia Diamond Heart Earrings", sku: "ERFNJ2504921", price: "13,990,200 VND", qty: 1, image: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=200" },
    { name: "Classic Tennis Bracelet", sku: "BRJ2504800", price: "75,650,000 VND", qty: 1, image: "https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=200" },
];

export default function CheckoutPage() {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
    const [step, setStep] = useState(0);
    const [insurance, setInsurance] = useState("none");
    const [payment, setPayment] = useState("card");
    const [isGift, setIsGift] = useState(false);

    // KYC Check Enforcement
    const kycStatus = user?.kycStatus?.toLowerCase();
    const isKycApproved = kycStatus === "verified" || kycStatus === "approved";

    if (!isKycApproved) {
        return (
            <>
                <PageHero
                    title="Action Required"
                    subtitle="Identity verification is required for high-value jewelry checkout."
                    breadcrumbs={[{ label: "Cart", href: "/cart" }, { label: "Verification Required" }]}
                />
                <section className="bg-white py-24 transition-colors dark:bg-[#050505]">
                    <div className="container mx-auto px-4 text-center">
                        <div className="mx-auto max-w-lg rounded-3xl border border-gold/20 bg-gold/5 p-12 shadow-2xl backdrop-blur-sm">
                            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl dark:bg-[#111]">
                                <Lock className="text-gold" size={40} />
                            </div>
                            <h2 className="font-serif text-3xl text-gray-900 dark:text-white">Security Check</h2>
                            <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                To protect our clients and maintain the integrity of our Maison, we require identity verification for all jewelry purchases over <span className="font-bold text-gray-900 dark:text-white">5,000,000 VND</span>.
                            </p>
                            
                            <div className="mt-10 flex flex-col gap-4">
                                <Link href="/auth/kyc" className="bg-gold rounded-xl py-4 text-xs font-bold tracking-[0.2em] text-white uppercase transition-all hover:brightness-110 shadow-lg shadow-gold/20">
                                    Verify My Identity Now
                                </Link>
                                <Link href="/cart" className="rounded-xl border border-gray-100 py-4 text-xs font-bold tracking-[0.2em] text-gray-500 uppercase transition-all hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5">
                                    Return to Shopping Bag
                                </Link>
                            </div>

                            <p className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                <ShieldCheck size={14} /> Bank Grade Encryption Protected
                            </p>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <PageHero
                title="Checkout"
                subtitle="Complete your order securely"
                breadcrumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    {/* Progress Steps */}
                    <div className="mx-auto mb-12 flex max-w-2xl items-center justify-between">
                        {STEPS.map((s, i) => (
                            <div key={s} className="flex items-center gap-2">
                                <button
                                    onClick={() => setStep(i)}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                                        i <= step
                                            ? "bg-gold text-white shadow-lg shadow-gold/20"
                                            : "border border-gray-200 text-gray-400 dark:border-white/10"
                                    }`}
                                >
                                    {i < step ? <Check size={14} /> : i + 1}
                                </button>
                                <span className={`hidden text-[11px] font-bold tracking-widest uppercase md:block ${i <= step ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                                    {s}
                                </span>
                                {i < STEPS.length - 1 && (
                                    <div className={`mx-2 hidden h-px w-8 md:block lg:w-16 ${i < step ? "bg-gold" : "bg-gray-200 dark:bg-white/10"}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-7">
                            {/* Step 1: Address */}
                            {step === 0 && (
                                <div className="space-y-6 rounded-2xl border border-gray-100 p-6 md:p-8 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <MapPin size={20} className="text-gold" />
                                        <h2 className="font-serif text-xl text-gray-900 dark:text-white">Delivery Address</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <input placeholder="First Name *" className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white" />
                                        <input placeholder="Last Name *" className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white" />
                                        <input placeholder="Email Address *" className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white md:col-span-2" />
                                        <input placeholder="Phone Number *" className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white md:col-span-2" />
                                        <input placeholder="Street Address *" className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white md:col-span-2" />
                                        <input placeholder="City *" className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white" />
                                        <input placeholder="State / Province *" className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white" />
                                        <input placeholder="ZIP / Postal Code *" className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white" />
                                        <input placeholder="Country *" className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white" />
                                    </div>

                                    {/* Gift Option */}
                                    <div className="rounded-xl border border-gray-100 p-4 dark:border-white/5">
                                        <label className="flex cursor-pointer items-center gap-3">
                                            <input type="checkbox" checked={isGift} onChange={() => setIsGift(!isGift)} className="accent-gold h-4 w-4" />
                                            <Gift size={16} className="text-gold" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">This is a gift</span>
                                        </label>
                                        {isGift && (
                                            <textarea placeholder="Write a gift message (optional)" className="mt-3 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white" rows={3} />
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Insurance */}
                            {step === 1 && (
                                <div className="space-y-4 rounded-2xl border border-gray-100 p-6 md:p-8 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Shield size={20} className="text-gold" />
                                        <h2 className="font-serif text-xl text-gray-900 dark:text-white">Order Protection</h2>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose a protection plan for your precious items during transit and after delivery.</p>

                                    {[
                                        { id: "none", title: "No Insurance", desc: "Standard delivery without additional coverage", price: "Free", icon: Package },
                                        { id: "shipping", title: "Shipping Insurance", desc: "Covers damage or loss during transit (48h claim window)", price: "+449,318 VND", icon: Truck },
                                        { id: "full", title: "Full Coverage", desc: "Shipping + 30-day product protection after delivery", price: "+1,347,955 VND", icon: ShieldCheck },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setInsurance(opt.id)}
                                            className={`flex w-full items-start gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                                                insurance === opt.id
                                                    ? "border-gold bg-gold/5 shadow-lg shadow-gold/10"
                                                    : "border-gray-100 hover:border-gray-200 dark:border-white/5 dark:hover:border-white/10"
                                            }`}
                                        >
                                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${insurance === opt.id ? "bg-gold text-white" : "bg-gray-100 text-gray-400 dark:bg-white/5"}`}>
                                                <opt.icon size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{opt.title}</p>
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{opt.desc}</p>
                                            </div>
                                            <span className={`text-sm font-bold ${insurance === opt.id ? "text-gold" : "text-gray-400"}`}>{opt.price}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 3: Payment */}
                            {step === 2 && (
                                <div className="space-y-4 rounded-2xl border border-gray-100 p-6 md:p-8 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <CreditCard size={20} className="text-gold" />
                                        <h2 className="font-serif text-xl text-gray-900 dark:text-white">Payment Method</h2>
                                    </div>

                                    {[
                                        { id: "card", title: "Credit / Debit Card", desc: "Visa, Mastercard, AMEX" },
                                        { id: "bank", title: "Bank Transfer", desc: "Direct bank transfer with auto-verification" },
                                        { id: "cod", title: "Cash on Delivery", desc: "Available for orders under 2,000,000 VND" },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setPayment(opt.id)}
                                            className={`flex w-full items-center gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                                                payment === opt.id
                                                    ? "border-gold bg-gold/5"
                                                    : "border-gray-100 hover:border-gray-200 dark:border-white/5 dark:hover:border-white/10"
                                            }`}
                                        >
                                            <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${payment === opt.id ? "border-gold" : "border-gray-300 dark:border-white/20"}`}>
                                                {payment === opt.id && <div className="h-2.5 w-2.5 rounded-full bg-gold" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{opt.title}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{opt.desc}</p>
                                            </div>
                                        </button>
                                    ))}

                                    {payment === "card" && (
                                        <div className="mt-4 space-y-4 rounded-xl border border-gray-100 p-5 dark:border-white/5">
                                            <input placeholder="Card Number" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input placeholder="MM / YY" className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white" />
                                                <input placeholder="CVC" className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white" />
                                            </div>
                                            <input placeholder="Cardholder Name" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white" />
                                        </div>
                                    )}

                                    {/* Deposit Info */}
                                    <div className="mt-4 rounded-xl bg-gold/5 border border-gold/10 p-5">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">Deposit Options</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                            For orders above 10,000,000 VND, you may choose to pay a deposit (30%-50%) and complete the remaining payment after vendor confirms your order.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Review */}
                            {step === 3 && (
                                <div className="space-y-6 rounded-2xl border border-gray-100 p-6 md:p-8 dark:border-white/5">
                                    <h2 className="font-serif text-xl text-gray-900 dark:text-white">Review Your Order</h2>

                                    <div className="space-y-4">
                                        {MOCK_ITEMS.map((item) => (
                                            <div key={item.sku} className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 dark:border-white/5">
                                                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                                                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">REF: {item.sku} • QTY: {item.qty}</p>
                                                </div>
                                                <p className="text-gold text-sm font-bold">{item.price}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="rounded-xl border border-gray-100 p-4 dark:border-white/5">
                                            <p className="mb-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Delivery Address</p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">John Doe<br />123 Diamond Ave, Suite 100<br />New York, NY 10036</p>
                                        </div>
                                        <div className="rounded-xl border border-gray-100 p-4 dark:border-white/5">
                                            <p className="mb-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Payment Method</p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">Credit Card<br />•••• •••• •••• 4242<br />Exp: 12/28</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="mt-8 flex justify-between">
                                <button
                                    onClick={() => setStep(Math.max(0, step - 1))}
                                    className={`flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-xs font-bold tracking-wider text-gray-600 uppercase transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5 ${step === 0 ? "invisible" : ""}`}
                                >
                                    Back
                                </button>
                                {step < STEPS.length - 1 ? (
                                    <button
                                        onClick={() => setStep(step + 1)}
                                        className="bg-gold group flex items-center gap-2 rounded-xl px-8 py-3 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105"
                                    >
                                        Continue <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                    </button>
                                ) : (
                                    <button className="bg-gold group flex items-center gap-2 rounded-xl px-8 py-3 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105">
                                        Place Order <Check size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-32 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 md:p-8 dark:border-white/5 dark:bg-white/2">
                                <h3 className="mb-6 font-serif text-lg text-gray-900 dark:text-white">Order Summary</h3>

                                <div className="mb-6 space-y-3">
                                    {MOCK_ITEMS.map((item) => (
                                        <div key={item.sku} className="flex items-center gap-3">
                                            <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                                            <div className="flex-1 text-sm">
                                                <p className="line-clamp-1 font-medium text-gray-900 dark:text-white">{item.name}</p>
                                                <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{item.price}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-white/5">
                                    <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span className="text-gray-900 dark:text-white">89,640,200 VND</span></div>
                                    <div className="flex justify-between text-sm text-gray-500"><span>Shipping</span><span className="text-green-600 font-medium">Free</span></div>
                                    <div className="flex justify-between text-sm text-gray-500"><span>Insurance</span><span className="text-gray-900 dark:text-white">{insurance === "none" ? "-" : insurance === "shipping" ? "449,318 VND" : "1,347,955 VND"}</span></div>
                                    <div className="flex justify-between text-sm text-gray-500"><span>VAT (10%)</span><span className="text-gray-900 dark:text-white">8,964,020 VND</span></div>
                                </div>

                                <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 dark:border-white/5">
                                    <span className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Total</span>
                                    <span className="text-gold text-xl font-bold">98,604,220 VND</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
