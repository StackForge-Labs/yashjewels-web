import { PageHero } from "../../_components/PageHero";
import { ShieldCheck, RefreshCcw, Clock, CheckCircle, XCircle, ArrowRight, Award, Settings, Gem, Phone } from "lucide-react";
import Link from "next/link";

const WARRANTY_TIERS = [
    { period: "6 Months", coverage: "Manufacturing defects, stone loosening", price: "Included", highlight: false },
    { period: "1 Year", coverage: "All above + free polishing & rhodium plating", price: "+1% of MRP", highlight: true },
    { period: "Lifetime", coverage: "All above + stone replacement + resizing", price: "+3% of MRP", highlight: false },
];

const COVERED = [
    "Manufacturing defects in craftsmanship",
    "Loose or missing stones (natural wear)",
    "Tarnishing or discoloration of metal",
    "Broken clasps, prongs, or settings",
    "Ring resizing (one time)",
];

const NOT_COVERED = [
    "Physical damage from impact or misuse",
    "Loss or theft of the jewelry item",
    "Damage from chemical exposure",
    "Unauthorized repairs or alterations",
    "Normal wear and scratching over time",
];

export default function WarrantyPage() {
    return (
        <>
            <PageHero
                title="Warranty Policy"
                subtitle="Every Yash Jewels piece is crafted to last. Our warranty ensures your investment is protected."
                breadcrumbs={[{ label: "Policies", href: "/policies/warranty" }, { label: "Warranty" }]}
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    {/* Warranty Tiers */}
                    <div className="mb-20">
                        <h2 className="mb-3 font-serif text-2xl md:text-3xl text-gray-900 dark:text-white">Protection Plans</h2>
                        <p className="mb-10 text-sm text-gray-500 dark:text-gray-400">Choose the level of protection that suits your needs.</p>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {WARRANTY_TIERS.map((tier) => (
                                <div key={tier.period} className={`relative rounded-2xl border-2 p-8 transition-all ${tier.highlight ? "border-gold bg-gold/5 shadow-xl shadow-gold/10" : "border-gray-100 dark:border-white/5"}`}>
                                    {tier.highlight && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
                                            Recommended
                                        </div>
                                    )}
                                    <Award size={28} className={`mb-4 ${tier.highlight ? "text-gold" : "text-gray-300 dark:text-gray-600"}`} />
                                    <h3 className="mb-2 font-serif text-xl text-gray-900 dark:text-white">{tier.period}</h3>
                                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{tier.coverage}</p>
                                    <p className={`text-lg font-bold ${tier.highlight ? "text-gold" : "text-gray-900 dark:text-white"}`}>{tier.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Covered / Not Covered */}
                    <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="rounded-2xl border border-gray-100 p-8 dark:border-white/5">
                            <h3 className="mb-6 flex items-center gap-3 font-serif text-xl text-gray-900 dark:text-white">
                                <CheckCircle size={22} className="text-green-500" /> What&apos;s Covered
                            </h3>
                            <ul className="space-y-4">
                                {COVERED.map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                        <CheckCircle size={16} className="mt-0.5 shrink-0 text-green-500" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded-2xl border border-gray-100 p-8 dark:border-white/5">
                            <h3 className="mb-6 flex items-center gap-3 font-serif text-xl text-gray-900 dark:text-white">
                                <XCircle size={22} className="text-red-400" /> Not Covered
                            </h3>
                            <ul className="space-y-4">
                                {NOT_COVERED.map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                        <XCircle size={16} className="mt-0.5 shrink-0 text-red-400" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* How to Claim */}
                    <div className="mb-20">
                        <h2 className="mb-10 font-serif text-2xl md:text-3xl text-gray-900 dark:text-white">How to Claim Warranty</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                            {[
                                { icon: Phone, step: "01", title: "Contact Us", desc: "Reach out via phone, email, or the contact form on our website." },
                                { icon: Gem, step: "02", title: "Submit Details", desc: "Provide your order number, product photos, and describe the issue." },
                                { icon: Settings, step: "03", title: "Assessment", desc: "Our artisans will evaluate your piece within 3-5 business days." },
                                { icon: RefreshCcw, step: "04", title: "Resolution", desc: "Repair, replacement, or store credit based on the assessment." },
                            ].map((s) => (
                                <div key={s.step} className="group text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gold/10 dark:bg-white/5">
                                        <s.icon size={24} className="text-gray-400 transition-colors group-hover:text-gold" />
                                    </div>
                                    <p className="text-gold mb-2 text-[10px] font-bold tracking-widest">STEP {s.step}</p>
                                    <h4 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">{s.title}</h4>
                                    <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="rounded-2xl bg-gray-50 p-8 text-center md:p-16 dark:bg-white/2">
                        <h3 className="mb-4 font-serif text-2xl text-gray-900 dark:text-white">Need Assistance?</h3>
                        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">Our customer service team is available to help with any warranty questions.</p>
                        <Link href="/contact" className="bg-gold group inline-flex items-center gap-3 rounded-xl px-10 py-4 text-[12px] font-bold tracking-[0.3em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105">
                            Contact Us <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
