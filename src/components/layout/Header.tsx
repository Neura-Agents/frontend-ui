import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Login01Icon, ArrowRight01Icon, Menu01Icon, Cancel01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import Logo from "../reusable/Logo";

const NAV_DATA = [
    {
        title: "Platform",
        items: [
            { title: "Agent Builder", desc: "Create intelligent agents visually" },
            { title: "Deployment", desc: "Deploy agents at scale" },
            { title: "Monitoring", desc: "Track performance & logs" },
        ],
    },
    {
        title: "Developers",
        items: [
            { title: "SDKs", desc: "Integrate with our SDKs" },
            { title: "API Docs", desc: "Explore API endpoints" },
            { title: "CLI Tools", desc: "Powerful dev tools" },
        ],
    },
    {
        title: "Resources",
        items: [
            { title: "Documentation", desc: "Learn the platform" },
            { title: "Guides", desc: "Step-by-step tutorials" },
            { title: "Blog", desc: "Latest updates & insights" },
        ],
    },
    {
        title: "Company",
        items: [
            { title: "About Us", desc: "Who we are" },
            { title: "Careers", desc: "Join our team" },
            { title: "Contact", desc: "Get in touch" },
        ],
    },
];

const Header: React.FC = () => {
    const { login } = useAuth();
    const location = useLocation();
    const from = location.state?.from || "/agents";

    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [lastMenu, setLastMenu] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = (menu: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveMenu(menu);
        setLastMenu(menu);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveMenu(null);
        }, 120); // small delay to avoid flicker
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (isMobileMenuOpen) {
            setMobileExpandedItem(null);
        }
    };

    const toggleMobileAccordion = (title: string) => {
        setMobileExpandedItem(mobileExpandedItem === title ? null : title);
    };

    return (
        <>
            {/* OVERLAY / BACKDROP - FULL SCREEN */}
            <div
                className={`
                    fixed inset-0 backdrop-blur-md 
                    transition-opacity duration-500 ease-in-out z-40
                    ${(activeMenu || isMobileMenuOpen) ? "opacity-100" : "opacity-0 pointer-events-none"}
                `}
                onMouseEnter={!isMobileMenuOpen ? handleMouseLeave : undefined}
                onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveMenu(null);
                }}
            />

            <header className="app-header px-2">
                <div className="container mx-auto py-2 md:py-4">
                    <div
                        onMouseLeave={!isMobileMenuOpen ? handleMouseLeave : undefined}
                        className={`
                        relative flex flex-col w-full border border-border backdrop-blur-md bg-background/60
                        shadow-2xl shadow-primary/10 transition-all duration-300 ease-in-out rounded-4xl
                        ${isMobileMenuOpen ? "max-h-[85vh] overflow-y-auto" : activeMenu ? "max-h-[400px]" : "max-h-[52px] md:max-h-[62px]"}
                        overflow-hidden
                    `}
                    >
                        {/* MAIN HEADER ROW */}
                        <div className="flex items-center justify-between px-4 lg:px-8 h-[52px] md:h-[62px] shrink-0">
                            {/* LEFT */}
                            <Logo className="hidden md:flex" />
                            <Logo variant="sm" className="md:hidden" />

                            {/* CENTER NAV - DESKTOP */}
                            <nav className="hidden md:flex items-center gap-4">
                                {NAV_DATA.map((item) => (
                                    <Button
                                        key={item.title}
                                        onMouseEnter={() => handleMouseEnter(item.title)}
                                        variant="ghost"
                                        size="default"
                                    >
                                        {item.title}
                                    </Button>
                                ))}
                            </nav>

                            {/* RIGHT - DESKTOP */}
                            <nav className="hidden md:flex items-center gap-4">
                                <Button
                                    onClick={() => login("", from)}
                                    variant="ghost"
                                    size="default"
                                    className="gap-2 hover:cursor-pointer"
                                >
                                    <HugeiconsIcon icon={Login01Icon} />
                                    Login
                                </Button>
                            </nav>

                            {/* MOBILE MENU TOGGLE */}
                            <Button
                                variant="ghost"
                                size="default"
                                className="gap-2 hover:cursor-pointer md:hidden"
                                onClick={toggleMobileMenu}
                            >
                                <HugeiconsIcon icon={isMobileMenuOpen ? Cancel01Icon : Menu01Icon} />
                            </Button>
                        </div>

                        {/* DESKTOP DROPDOWN */}
                        <div
                            className={`
                            hidden md:block transition-all duration-300 ease-in-out
                            ${activeMenu ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}
                        `}
                        >
                            <div className="w-full px-8 pb-8 pt-2 border-t border-border/50">
                                <div
                                    onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {NAV_DATA.map((menu) => (
                                        lastMenu === menu.title && (
                                            <div key={menu.title} className={`grid grid-cols-3 gap-6 transition-opacity duration-300 ${activeMenu === menu.title ? "opacity-100" : "opacity-0"}`}>
                                                {menu.items.map((subItem) => (
                                                    <MenuItem
                                                        key={subItem.title}
                                                        title={subItem.title}
                                                        desc={subItem.desc}
                                                    />
                                                ))}
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* MOBILE MENU CONTENT */}
                        <div
                            className={`
                            md:hidden transition-all duration-300 ease-in-out
                            ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}
                        `}
                        >
                            <div className="w-full px-4 pb-8 pt-2 border-t border-border/50">
                                <div className="flex flex-col gap-2">
                                    {NAV_DATA.map((menu) => (
                                        <div key={menu.title} className="flex flex-col">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-between px-4 py-6 h-auto text-lg font-medium"
                                                onClick={() => toggleMobileAccordion(menu.title)}
                                            >
                                                {menu.title}
                                                <HugeiconsIcon
                                                    icon={ArrowDown01Icon}
                                                    className={`transition-transform duration-300 ${mobileExpandedItem === menu.title ? "rotate-180" : ""}`}
                                                    size={18}
                                                />
                                            </Button>

                                            <div className={`
                                                grid transition-all duration-300 ease-in-out
                                                ${mobileExpandedItem === menu.title ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"}
                                            `}>
                                                <div className="overflow-hidden flex flex-col gap-2 px-2">
                                                    {menu.items.map((subItem) => (
                                                        <MenuItem
                                                            key={subItem.title}
                                                            title={subItem.title}
                                                            desc={subItem.desc}
                                                            isMobile
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="h-px bg-border/50 my-4" />

                                    <Button
                                        onClick={() => login("", from)}
                                        variant="default"
                                        size="lg"
                                        className="w-full gap-2 hover:cursor-pointer mt-2"
                                    >
                                        <HugeiconsIcon icon={Login01Icon} />
                                        Login
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;

/* -------------------------------- */
/* Reusable Menu Item Component */
/* -------------------------------- */

const MenuItem = ({
    title,
    desc,
    isMobile,
}: {
    title: string;
    desc: string;
    isMobile?: boolean;
}) => {
    return (
        <div className={`
            flex flex-col gap-1.5 rounded-2xl hover:bg-muted/50 transition-all duration-300 cursor-pointer group/item border border-transparent hover:border-border/50
            ${isMobile ? "p-3 bg-muted/20" : "p-4"}
        `}>
            <span className="font-semibold text-[0.95rem] group-hover/item:text-primary transition-colors flex items-center gap-2">
                {title}
                <span className={`transition-all ${isMobile ? "opacity-100 translate-x-0 ml-auto" : "opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0"}`}>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </span>
            </span>
            <span className="text-sm text-muted-foreground leading-relaxed">{desc}</span>
        </div>
    );
};