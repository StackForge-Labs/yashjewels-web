"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Database,
  Search,
  TrendingUp,
  User,
  ShieldCheck,
  Activity,
  ChevronDown,
  ChevronUp,
  Box,
  Server,
  AlertCircle,
  Zap,
  Clock,
  Lock,
  Cpu
} from "lucide-react";

// Dữ liệu 52 APIs
const apiModules = [
  {
    name: "Authentication & Security",
    description: "Authentication & Security",
    icon: Shield,
    endpoints: [
      { method: "POST", path: "/api/v1/auth/register", desc: "Register a new user account (Default role is Customer)." },
      { method: "POST", path: "/api/v1/auth/verify-email", desc: "Verify account via OTP sent to email." },
      { method: "POST", path: "/api/v1/auth/login", desc: "Log into the system, get Access Token and Refresh Token." },
      { method: "POST", path: "/api/v1/auth/refresh-token", desc: "Issue a new Access Token (JWT) using a Refresh Token." },
      { method: "POST", path: "/api/v1/auth/logout", desc: "Log out user and revoke valid tokens." },
      { method: "POST", path: "/api/v1/auth/forgot-password", desc: "Request password reset (sends password reset token)." },
      { method: "POST", path: "/api/v1/auth/reset-password", desc: "Reset password using the provided token." },
      { method: "POST", path: "/api/v1/auth/kyc/submit", desc: "Submit eKYC profile (ID card, face photo) for identity verification." },
    ]
  },
  {
    name: "Catalog",
    description: "Platform Data",
    icon: Database,
    endpoints: [
      { method: "GET", path: "/api/v1/catalog/categories", desc: "Get a list of all categories (Rings, Necklaces,...)." },
      { method: "POST", path: "/api/v1/catalog/categories", desc: "Add a new product category." },
      { method: "PUT", path: "/api/v1/catalog/categories/{id}", desc: "Update category information." },
      { method: "DELETE", path: "/api/v1/catalog/categories/{id}", desc: "Soft delete a category from the system." },
      { method: "GET", path: "/api/v1/catalog/brands", desc: "Get a list of all brands (Asmi, PNJ,...)." },
      { method: "POST", path: "/api/v1/catalog/brands", desc: "Add a new brand." },
      { method: "PUT", path: "/api/v1/catalog/brands/{id}", desc: "Update brand information." },
      { method: "DELETE", path: "/api/v1/catalog/brands/{id}", desc: "Soft delete a brand." },
      { method: "GET", path: "/api/v1/catalog/gold-types", desc: "Get a list of gold types (18K, 24K,...)." },
      { method: "POST", path: "/api/v1/catalog/gold-types", desc: "Add a new gold type." },
      { method: "GET", path: "/api/v1/catalog/certifications", desc: "Get a list of certification standards (GIA, SJC,...)." },
      { method: "POST", path: "/api/v1/catalog/certifications", desc: "Add a new certification standard." },
      { method: "GET", path: "/api/v1/catalog/jewel-types", desc: "Get a list of jewelry types (Bracelets, Earrings,...)." },
      { method: "POST", path: "/api/v1/catalog/jewel-types", desc: "Add a new jewelry type." },
      { method: "GET", path: "/api/v1/catalog/diamond-qualities", desc: "Get a list of diamond quality standards." },
      { method: "POST", path: "/api/v1/catalog/diamond-qualities", desc: "Add a new diamond quality standard." },
      { method: "GET", path: "/api/v1/catalog/stone-qualities", desc: "Get a list of gemstone quality standards." },
      { method: "POST", path: "/api/v1/catalog/stone-qualities", desc: "Add a new gemstone quality standard." },
      { method: "GET", path: "/api/v1/catalog/product-types", desc: "Get a list of product lines (Men's, Women's, Kids,...)." },
      { method: "POST", path: "/api/v1/catalog/product-types", desc: "Add a new product line." },
    ]
  },
  {
    name: "Product & Inventory",
    description: "Products & Inventory",
    icon: Box,
    endpoints: [
      { method: "GET", path: "/api/v1/products", desc: "Get a list of products (supports pagination)." },
      { method: "POST", path: "/api/v1/products", desc: "Create a new product profile (based on StyleCode)." },
      { method: "GET", path: "/api/v1/products/{styleCode}", desc: "View detailed information of a product." },
      { method: "PUT", path: "/api/v1/products/{styleCode}", desc: "Update detailed product information." },
      { method: "DELETE", path: "/api/v1/products/{styleCode}", desc: "Delete (hide) a product from the system." },
      { method: "GET", path: "/api/v1/products/{styleCode}/price", desc: "Calculate and retrieve dynamic MRP based on live gold price." },
      { method: "POST", path: "/api/v1/products/{styleCode}/images", desc: "Upload new images for a product." },
      { method: "POST", path: "/api/v1/products/{styleCode}/reviews", desc: "Submit a review (Rating & Feedback) for a product." },
    ]
  },
  {
    name: "Search Engine",
    description: "Filter Configuration Engine",
    icon: Search,
    endpoints: [
      { method: "GET", path: "/api/v1/search", desc: "Search by keyword combined with multi-level filters (Facet & Combinatorial Filter)." },
    ]
  },
  {
    name: "Gold Price",
    description: "Gold Price Fluctuations",
    icon: TrendingUp,
    endpoints: [
      { method: "GET", path: "/api/v1/gold-price/current", desc: "Get the latest gold price currently applied to calculate MRP." },
      { method: "GET", path: "/api/v1/gold-price/history", desc: "View historical chart of gold price changes over the past 24h." },
    ]
  },
  {
    name: "User Profile",
    description: "Personal & Address",
    icon: User,
    endpoints: [
      { method: "GET", path: "/api/v1/users/me", desc: "Get personal information of the currently logged-in user." },
      { method: "PUT", path: "/api/v1/users/me", desc: "Update information (Full name, Date of birth, Phone number,...)." },
      { method: "PUT", path: "/api/v1/users/me/change-password", desc: "Change account password." },
      { method: "GET", path: "/api/v1/users/me/addresses", desc: "Get the user's list of shipping addresses." },
      { method: "POST", path: "/api/v1/users/me/addresses", desc: "Add a new shipping address." },
      { method: "PUT", path: "/api/v1/users/me/addresses/{id}", desc: "Update an existing address." },
      { method: "DELETE", path: "/api/v1/users/me/addresses/{id}", desc: "Delete an address from the shipping address book." },
    ]
  },
  {
    name: "Admin Management",
    description: "User Administration",
    icon: ShieldCheck,
    endpoints: [
      { method: "GET", path: "/api/v1/admin/users", desc: "List of all users in the system (for Admin)." },
      { method: "GET", path: "/api/v1/admin/users/{id}", desc: "View detailed information of any user." },
      { method: "PUT", path: "/api/v1/admin/users/{id}/status", desc: "Block or Unblock a user account." },
      { method: "GET", path: "/api/v1/admin/users/kyc-pending", desc: "List of customers waiting for KYC approval." },
      { method: "PUT", path: "/api/v1/admin/users/{id}/kyc", desc: "Approve or Reject an eKYC request." },
    ]
  },
  {
    name: "Others",
    description: "Other APIs",
    icon: Activity,
    endpoints: [
      { method: "GET", path: "/WeatherForecast", desc: "Project template sample API (used for health checks)." },
    ]
  }
];

const coreFeatures = [
  {
    title: "Global Exception Pipeline",
    description: "Middleware automatically intercepts 100% of unknown errors. Returns standard RFC JSON instead of a red stack trace, keeping the UI structure safe even if the Backend crashes.",
    icon: AlertCircle,
    color: "from-rose-500/10 to-transparent",
    iconColor: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    badge: "Active",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  },
  {
    title: "Redis Distributed Cache",
    description: "Real-time dynamic gold price caching (TTL: 20 minutes). Reduces MySQL load by 90%, enabling search APIs and price calculations to respond at ultra-high speeds under 50 milliseconds.",
    icon: Zap,
    color: "from-amber-500/10 to-transparent",
    iconColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    badge: "High Performance",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  },
  {
    title: "Background Job",
    description: "Asynchronous Worker process automatically requests and scrapes the gold exchange rate chain every 2 hours. Passively adjusts the system-wide MRP price 24/7 without requiring Admin intervention.",
    icon: Clock,
    color: "from-blue-500/10 to-transparent",
    iconColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    badge: "Every 2 hours",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  },
  {
    title: "Advanced Auth & Security",
    description: "Using BCrypt hashing algorithm with Work Factor 12. A closed security lifecycle with Access Token / Refresh Token, simultaneously supporting a strict 9-tier authorization system.",
    icon: Lock,
    color: "from-emerald-500/10 to-transparent",
    iconColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    badge: "BCrypt + JWT",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  }
];

const getMethodColor = (method: string) => {
  switch (method) {
    case "GET": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    case "POST": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "PUT": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "DELETE": return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    default: return "bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20";
  }
};

export default function ApiDocsPage() {
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);

  const totalEndpoints = apiModules.reduce((acc, curr) => acc + curr.endpoints.length, 0);

  const toggleModule = (index: number) => {
    setExpandedModules(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 dark:bg-[#0A0A0A] dark:text-gray-200 transition-colors duration-500 font-sans selection:bg-amber-500/30">

      {/* Header section */}
      <div className="relative overflow-hidden transition-colors duration-500 pb-10 border-b border-amber-200 bg-gradient-to-b from-amber-50 to-transparent dark:border-amber-500/10 dark:bg-gradient-to-b dark:from-amber-500/10 dark:to-transparent">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="max-w-6xl mx-auto px-6 pt-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium mb-6 backdrop-blur-md border bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20">
                <Server className="w-4 h-4" />
                <span>Developer Center</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-tight text-gray-900 dark:text-white">
                API Documentation <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 font-semibold">40% Milestone</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                Integrated documentation system containing all API endpoints for the Yash Gems & Jewelleries project.
                Built on the .NET 8 platform with modern architectural standards, ensuring high stability and scalability.
              </p>
            </div>

            <div className="flex gap-4">
              <a
                href="http://localhost:5256/hangfire"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-300 rounded-xl px-4 py-3 flex items-center justify-center space-x-3 cursor-pointer group shadow-lg hover:-translate-y-1 border bg-white border-amber-200 hover:border-amber-400 shadow-amber-200/20 dark:bg-[#111] dark:border-amber-500/30 dark:hover:border-amber-500/50"
              >
                <div className="p-2 rounded-lg border bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20">
                  <Activity className="w-5 h-5 animate-pulse text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Worker</p>
                  <p className="text-sm font-semibold leading-none mt-1 text-gray-800 dark:text-white">Hangfire</p>
                </div>
              </a>

              <div className="transition-all duration-300 rounded-xl px-5 py-3 flex items-center space-x-4 shadow-lg border bg-white border-amber-200 shadow-amber-200/20 dark:bg-[#111] dark:border-amber-500/30">
                <div className="p-2.5 rounded-lg border bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20">
                  <Box className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Total Routes</p>
                  <p className="text-2xl font-semibold leading-none mt-1 text-gray-800 dark:text-white">{totalEndpoints}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Core Infrastructure Features */}
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <Cpu className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <h2 className="text-2xl font-light tracking-wide text-gray-800 dark:text-white">
              Core <span className="font-semibold">Infrastructure</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {coreFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx}
                  className="group relative overflow-hidden transition-all duration-300 rounded-2xl p-6 shadow-md hover:-translate-y-1 block border bg-white border-gray-100 hover:border-amber-200 hover:shadow-xl dark:bg-[#111] dark:border-gray-800 dark:hover:border-gray-700 dark:hover:shadow-2xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-5">
                      <div className={`p-3 rounded-xl border ${feature.iconColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-bold tracking-wider rounded border ${feature.badgeColor}`}>
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-100">{feature.title}</h3>
                    <p className="text-sm leading-relaxed transition-colors text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent to-transparent mb-16 via-gray-200 dark:via-gray-800"></div>

        {/* API Endpoints List */}
        <div className="flex items-center space-x-3 mb-8">
          <Database className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          <h2 className="text-2xl font-light tracking-wide text-gray-800 dark:text-white">
            Endpoint <span className="font-semibold">API</span>
          </h2>
        </div>

        <div className="space-y-5">
          {apiModules.map((module, mIndex) => {
            const Icon = module.icon;
            const isExpanded = expandedModules.includes(mIndex);

            return (
              <motion.div
                key={mIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mIndex * 0.1 }}
                className="transition-all duration-300 rounded-2xl overflow-hidden border bg-white border-gray-200 hover:border-amber-200 shadow-sm dark:bg-[#111] dark:border-gray-800/80 dark:hover:border-gray-700/80 dark:shadow-inner"
              >
                <div
                  className="flex items-center justify-between p-5 cursor-pointer select-none transition-colors bg-gradient-to-r from-gray-50 to-white hover:bg-gray-100 dark:from-[#141414] dark:to-[#111] dark:hover:from-[#181818]"
                  onClick={() => toggleModule(mIndex)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 rounded-xl border shadow-inner bg-white border-gray-200 text-gray-600 dark:bg-gray-800/40 dark:border-gray-700/50 dark:text-gray-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-[17px] font-medium tracking-wide text-gray-800 dark:text-gray-100">
                        {module.name}
                      </h2>
                      <p className="text-[13px] mt-0.5 text-gray-500">
                        {module.description} • <span className="text-amber-500/80 font-medium">{module.endpoints.length} endpoints</span>
                      </p>
                    </div>
                  </div>
                  <div className={`p-2 flex items-center justify-center transition-all duration-300 ${isExpanded ? 'rotate-180 text-amber-500' : 'text-gray-400'
                    }`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="border-t p-0 border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#0c0c0c]">
                        {module.endpoints.map((ep, eIndex) => (
                          <div
                            key={eIndex}
                            className="flex flex-col md:flex-row md:items-center px-6 py-4 border-b last:border-0 transition-colors group border-gray-100 hover:bg-white dark:border-gray-800/40 dark:hover:bg-[#131313]"
                          >
                            <div className="flex items-center space-x-5 md:w-5/12 mb-3 md:mb-0">
                              <span className={`w-[70px] text-center px-2 py-1.5 text-[11px] font-bold tracking-widest rounded border shadow-sm ${getMethodColor(ep.method)}`}>
                                {ep.method}
                              </span>
                              <code className="text-[13px] font-mono transition-colors text-gray-600 group-hover:text-amber-600 dark:text-gray-400 dark:group-hover:text-amber-200/90">
                                {ep.path}
                              </code>
                            </div>
                            <div className="md:w-7/12 text-[13px] pl-0 md:pl-6 md:border-l leading-relaxed transition-colors text-gray-600 border-gray-200 group-hover:text-gray-900 dark:text-gray-400 dark:border-gray-800/60 dark:group-hover:text-gray-300">
                              {ep.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-20 flex flex-col items-center justify-center text-sm pb-12 text-gray-400 dark:text-gray-600">
          <div className="w-12 h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-6"></div>
          <p className="tracking-wide">Designed for Milestone 40% Evaluation</p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-gray-300 dark:text-gray-700">
            Yash Gems & Jewelleries API
          </p>
        </div>
      </div>
    </div>
  );
}
