import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeroProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: BreadcrumbItem[];
    backgroundImage?: string;
}

export const PageHero = ({ title, subtitle, breadcrumbs = [], backgroundImage }: PageHeroProps) => {
    return (
        <section className="dark:bg-dark-bg relative overflow-hidden bg-gray-50 py-16 transition-colors md:py-24">
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
                    <img
                        src={backgroundImage}
                        alt=""
                        className="h-full w-full object-cover opacity-10 dark:opacity-5"
                    />
                </div>
            )}

            <div className="relative container mx-auto px-4 lg:px-12">
                {/* Breadcrumbs */}
                <nav className="mb-6 flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                    <Link href="/" className="hover:text-gold transition-colors">
                        Home
                    </Link>
                    {breadcrumbs.map((crumb, i) => (
                        <span key={i} className="flex items-center gap-2">
                            <ChevronRight size={10} />
                            {crumb.href ? (
                                <Link href={crumb.href} className="hover:text-gold transition-colors">
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-gray-900 dark:text-white">{crumb.label}</span>
                            )}
                        </span>
                    ))}
                </nav>

                {/* Title */}
                <h1 className="font-serif text-3xl tracking-tight text-gray-900 md:text-5xl dark:text-white">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-500 md:text-base dark:text-gray-400">
                        {subtitle}
                    </p>
                )}

                {/* Decorative line */}
                <div className="mt-8 flex items-center gap-4">
                    <div className="bg-gold h-px w-12" />
                    <div className="bg-gold h-1.5 w-1.5 rounded-full" />
                </div>
            </div>
        </section>
    );
};
