"use client";

import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const TOUR_KEY = "yash_admin_tour_done";

interface DashboardTourProps {
    forced?: boolean;
    onDone?: () => void;
}

export function DashboardTour({ forced = false, onDone }: DashboardTourProps) {
    const ran = useRef(false);

    useEffect(() => {
        if (ran.current) return;
        const done = localStorage.getItem(TOUR_KEY);
        if (done && !forced) return;

        ran.current = true;

        const driverObj = driver({
            showProgress: true,
            animate: true,
            overlayOpacity: 0.55,
            smoothScroll: true,
            allowClose: true,
            nextBtnText: "Next →",
            prevBtnText: "← Back",
            doneBtnText: "Get Started!",
            onDestroyStarted: () => {
                localStorage.setItem(TOUR_KEY, "1");
                driverObj.destroy();
                onDone?.();
            },
            steps: [
                {
                    element: "#tour-dashboard-header",
                    popover: {
                        title: "👋 Welcome to Yash Admin ERP",
                        description: "This is your command center. You can monitor revenue, orders, and team actions from here.",
                        side: "bottom",
                        align: "start",
                    },
                },
                {
                    element: "#tour-stat-revenue",
                    popover: {
                        title: "📊 Revenue Overview",
                        description: "Track total revenue at a glance with trend indicators showing change vs. last period.",
                        side: "bottom",
                    },
                },
                {
                    element: "#tour-pending-alerts",
                    popover: {
                        title: "🔔 Pending Alerts",
                        description: "Critical items requiring your attention — KYC verifications, returns, and low-stock products.",
                        side: "right",
                    },
                },
                {
                    element: "#tour-gold-rate",
                    popover: {
                        title: "🏅 Live Gold Rate",
                        description: "The current gold price feeds directly into all product pricing calculations.",
                        side: "left",
                    },
                },
                {
                    element: "#tour-revenue-chart",
                    popover: {
                        title: "📈 Revenue Chart",
                        description: "Use the date range filters to compare sales performance across different time periods.",
                        side: "top",
                    },
                },
                {
                    element: "#tour-recent-orders",
                    popover: {
                        title: "🛍️ Recent Orders",
                        description: "Monitor the latest customer orders. Click 'View All' to manage them in the Orders module.",
                        side: "top",
                    },
                },
                {
                    element: "#tour-sidebar-nav",
                    popover: {
                        title: "🗂️ Navigation",
                        description: "Access all 15 management modules from the sidebar — grouped by domain for quick navigation.",
                        side: "right",
                    },
                },
            ],
        });

        driverObj.drive();
    }, [forced, onDone]);

    return null;
}

export function retriggerTour() {
    localStorage.removeItem(TOUR_KEY);
}
