"use client";

import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const TOUR_KEY = "yash_admin_tour_done_v2";

interface DashboardTourProps {
    runTour: boolean;
    setRunTour: (val: boolean) => void;
}

export function DashboardTour({ runTour, setRunTour }: DashboardTourProps) {
    const isFirstMount = useRef(true);

    useEffect(() => {
        // Always run if explicitly requested, OR if it's the first mount and never done before
        const done = localStorage.getItem(TOUR_KEY);
        
        if (isFirstMount.current) {
            isFirstMount.current = false;
            // Auto trigger once
            if (!done) {
                setRunTour(true);
            }
        }

        if (runTour) {
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
                    setRunTour(false);
                },
                steps: [
                    {
                        element: "#tour-dashboard-header",
                        popover: { title: "👋 Welcome to Yash ERP", description: "This represents your central nervous system.", side: "bottom" },
                    },
                    {
                        element: "#tour-stats-row",
                        popover: { title: "📊 Key Metrics", description: "The most important stats: Revenue and User base are at the very top.", side: "bottom" },
                    },
                    {
                        element: "#tour-revenue-chart",
                        popover: { title: "📈 Market Trends", description: "Large data visual. Contains Date filtering for dynamic reporting.", side: "top" },
                    },
                    {
                        element: "#tour-sidebar-widgets",
                        popover: { title: "💡 Auxiliary Data", description: "Secondary but critical info like live Gold Rate and pending action items grouped here.", side: "left" },
                    },
                    {
                        element: "#tour-recent-orders",
                        popover: { title: "🛍️ Operations", description: "Daily operations monitor. Look left for wide data tables.", side: "top" },
                    },
                    {
                        element: "#tour-sidebar-nav",
                        popover: { title: "🗂️ Navigation", description: "Access all 15 core functions down this side pane.", side: "right" },
                    },
                ],
            });
            driverObj.drive();
        }
    }, [runTour, setRunTour]);

    return null;
}
