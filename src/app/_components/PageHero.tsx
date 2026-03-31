import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeroProps {
    title: string;
    subtitle?: string;
    breadcrumbs: BreadcrumbItem[];
    backgroundImage?: string;
}

export const PageHero = ({ title, subtitle, breadcrumbs, backgroundImage }: PageHeroProps) => {
    return (
        <section className="relative overflow-hidden bg-gray-50 py-16 md:py-24 transition-colors dark:bg-dark-bg">
            {/* Background Pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-5 dark:opacity-10">
                <svg className="absolute top-0 right-0 h-64 w-64" viewBox="0 0 100 100" fill="none">
                    <path d="M50 0L55 45H100L65 55L75 100L50 70L25 100L35 55L0 45H45L50 0Z" fill="currentColor" />
                </svg>
                <svg className="absolute bottom-0 left-0 h-48 w-48 rotate-180" viewBox="0 0 100 100" fill="none">
                    <path d="M50 0L55 45H100L65 55L75 100L50 70L25 100L35 55L0 45H45L50 0Z" fill="currentColor" />
                </svg>
            </div>

            {backgroundImage && (
                <div className="absolute inset-0">
                    <img src={backgroundImage} alt="" className="h-full w-full object-cover opacity-10 dark:opacity-5" />
                </div>
            )}

            <div className="container relative mx-auto px-4 lg:px-12">
                {/* Breadcrumbs */}
                <nav className="mb-6 flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                    <Link href="/" className="hover:text-gold transition-colors">Home</Link>
                    {breadcrumbs.map((crumb, i) => (
                        <span key={i} className="flex items-center gap-2">
                            <ChevronRight size={10} />
                            {crumb.href ? (
                                <Link href={crumb.href} className="hover:text-gold transition-colors">{crumb.label}</Link>
                            ) : (
                                <span className="text-gray-900 dark:text-white">{crumb.label}</span>
                            )}
                        </span>
                    ))}
                </nav>

                {/* Title */}
                <h1 className="font-serif text-3xl md:text-5xl tracking-tight text-gray-900 dark:text-white">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        {subtitle}
                    </p>
                )}

                {/* Decorative line */}
                <div className="mt-8 flex items-center gap-4">
                    <div className="h-px w-12 bg-gold" />
                    <div className="h-1.5 w-1.5 rounded-full bg-gold" />
                </div>
            </div>
        </section>
    );
};
