"use client";

import { PageHero } from "../_components/PageHero";
import { MapPin, Clock, ChevronRight, ArrowRight, Briefcase, Heart, GraduationCap, Coffee, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const POSITIONS = [
    { id: 1, title: "Senior Gemologist", dept: "Quality & Certification", location: "New York, NY", type: "Full-time", desc: "Evaluate and certify diamonds and gemstones using GIA standards. 5+ years experience required." },
    { id: 2, title: "Digital Marketing Specialist", dept: "Marketing", location: "Remote", type: "Full-time", desc: "Drive online growth through SEO, social media, and paid campaigns. Jewelry or luxury experience is a plus." },
    { id: 3, title: "Full-Stack Developer", dept: "Technology", location: "Ho Chi Minh City", type: "Full-time", desc: "Build and maintain our e-commerce platform using Next.js and .NET 8. Strong React skills required." },
    { id: 4, title: "Jewelry Design Intern", dept: "Design Studio", location: "New York, NY", type: "Internship", desc: "Assist master designers in creating new collections. CAD skills (Rhino/Matrix) preferred." },
    { id: 5, title: "Customer Experience Associate", dept: "Customer Service", location: "Ho Chi Minh City", type: "Full-time", desc: "Provide premium service to our VIP clients via phone, email, and chat. Bilingual English/Vietnamese." },
];

const BENEFITS = [
    { icon: Heart, title: "Health & Wellness", desc: "Comprehensive health, dental, and vision insurance for you and your family." },
    { icon: GraduationCap, title: "Learning Budget", desc: "$2,000 annual learning stipend for courses, conferences, and certifications." },
    { icon: Coffee, title: "Flexible Schedule", desc: "Hybrid work model with flexible hours for work-life balance." },
    { icon: Users, title: "Employee Perks", desc: "40% employee discount on all Yash Jewels products." },
];

export default function CareersPage() {
    const [selectedDept, setSelectedDept] = useState("All");
    const departments = ["All", ...new Set(POSITIONS.map((p) => p.dept))];
    const filtered = selectedDept === "All" ? POSITIONS : POSITIONS.filter((p) => p.dept === selectedDept);

    return (
        <>
            <PageHero
                title="Careers"
                subtitle="Help us craft the future of high jewelry. We're looking for passionate people who share our love for excellence."
                breadcrumbs={[{ label: "Careers" }]}
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    {/* Benefits */}
                    <div className="mb-20">
                        <div className="mb-10 text-center">
                            <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">Perks</span>
                            <h2 className="font-serif text-3xl text-gray-900 dark:text-white">Why Work With Us</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {BENEFITS.map((b) => (
                                <div key={b.title} className="group rounded-2xl border border-gray-100 p-6 text-center transition-all hover:border-gold/20 hover:shadow-lg dark:border-white/5">
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 transition-transform group-hover:scale-110">
                                        <b.icon size={24} className="text-gold" />
                                    </div>
                                    <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">{b.title}</h3>
                                    <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{b.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Open Positions */}
                    <div className="mb-20">
                        <div className="mb-10 text-center">
                            <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">Opportunities</span>
                            <h2 className="font-serif text-3xl text-gray-900 dark:text-white">Open Positions</h2>
                        </div>

                        {/* Department Filter */}
                        <div className="mb-8 flex flex-wrap justify-center gap-2">
                            {departments.map((dept) => (
                                <button
                                    key={dept}
                                    onClick={() => setSelectedDept(dept)}
                                    className={`rounded-lg px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all ${
                                        selectedDept === dept
                                            ? "bg-gold text-white shadow-lg shadow-gold/20"
                                            : "border border-gray-200 text-gray-600 hover:border-gold/30 dark:border-white/10 dark:text-gray-400"
                                    }`}
                                >
                                    {dept}
                                </button>
                            ))}
                        </div>

                        {/* Position List */}
                        <div className="space-y-4">
                            {filtered.map((pos) => (
                                <div key={pos.id} className="group flex flex-col gap-4 rounded-2xl border border-gray-100 p-6 transition-all hover:border-gold/20 hover:shadow-lg md:flex-row md:items-center md:justify-between dark:border-white/5">
                                    <div className="flex-1">
                                        <div className="mb-2 flex flex-wrap items-center gap-3">
                                            <h3 className="text-base font-bold text-gray-900 dark:text-white">{pos.title}</h3>
                                            <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-[10px] font-bold text-gold">{pos.type}</span>
                                        </div>
                                        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{pos.desc}</p>
                                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-400">
                                            <span className="flex items-center gap-1"><Briefcase size={12} /> {pos.dept}</span>
                                            <span className="flex items-center gap-1"><MapPin size={12} /> {pos.location}</span>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-xs font-bold tracking-wider text-gray-600 uppercase transition-all hover:border-gold hover:text-gold dark:border-white/10 dark:text-gray-400 md:shrink-0">
                                        Apply Now <ChevronRight size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Application Form */}
                    <div className="rounded-2xl border border-gray-100 p-8 md:p-12 dark:border-white/5">
                        <div className="mb-8 text-center">
                            <h2 className="mb-3 font-serif text-2xl text-gray-900 dark:text-white">General Application</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Don&apos;t see a role that fits? Send us your resume and we&apos;ll keep you in mind.</p>
                        </div>
                        <div className="mx-auto max-w-2xl space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <input placeholder="Full Name *" className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white" />
                                <input placeholder="Email Address *" className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white" />
                            </div>
                            <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 outline-none focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
                                <option>Select Position of Interest</option>
                                {POSITIONS.map((p) => <option key={p.id}>{p.title}</option>)}
                            </select>
                            <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center dark:border-white/10">
                                <p className="mb-2 text-sm font-medium text-gray-500">Drag & drop your resume here</p>
                                <p className="text-xs text-gray-400">PDF, DOC, or DOCX (max 5MB)</p>
                            </div>
                            <textarea placeholder="Cover letter or message (optional)" rows={4} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white" />
                            <button className="bg-gold group flex w-full items-center justify-center gap-3 rounded-xl py-4 text-[12px] font-bold tracking-[0.3em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105">
                                Submit Application <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
