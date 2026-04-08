import React from 'react';
import { Typography } from '@/components/ui/typography';
import Logo from '../reusable/Logo';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

interface FooterLink {
    label: string;
    href: string;
    external?: boolean;
}

const APP_NAME = import.meta.env.VITE_APP_NAME;

const Footer: React.FC<{ animateGlow: boolean }> = ({ animateGlow }) => {
    const footerLinks: Record<string, FooterLink[]> = {
        Products: [
            { label: 'A2A Agents', href: '/a2a-agents' },
            { label: 'Orchestrator Agents', href: '/orchestrator-agents' },
            { label: 'Capabilities', href: '/capabilities' }
        ],
        API: [
            { label: 'Documentation', href: '#' },
            { label: 'Pricing', href: '/pricing' }
        ],
        Company: [
            { label: 'About Us', href: '/about' },
            { label: 'Contact Sales', href: '/contact' },
            { label: 'Terms of Use', href: '/terms' },
            { label: 'Privacy Policy', href: '/privacy' }
        ],
        Socials: [
            { label: 'Twitter', href: 'https://twitter.com', external: true },
            { label: 'Github', href: 'https://github.com', external: true },
            { label: 'Linkedin', href: 'https://linkedin.com', external: true },
            { label: 'Instagram', href: 'https://instagram.com', external: true }
        ]
    };

    return (
        <footer className="w-screen h-screen md:h-[60vh] relative overflow-hidden flex flex-col justify-between pt-16 md:pt-24 pb-8 md:pb-12 px-8 md:px-24">
            <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={
                    animateGlow
                        ? { scale: 1.4, opacity: 1 }
                        : { scale: 0.6, opacity: 0 }
                }
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
    w-[900px] h-[900px] rounded-full
    bg-[radial-gradient(ellipse_100%_30%,var(--color-primary),transparent_40%)]
    blur-3xl pointer-events-none"
            />

            {/* Background Accent */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,var(--color-primary),transparent_60%)]/3 -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full flex flex-col justify-between h-full gap-12 md:gap-0">
                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 grow items-start">

                    {/* Brand Section */}
                    <div className="md:col-span-4 flex flex-col gap-6 items-start">
                        <Logo />
                        <Typography scale="sm" className="text-muted-foreground max-w-xs leading-relaxed">
                            The world's first sovereign agents platform. We're building the infrastructure for a future powered by autonomous, intelligent agents that work for everyone.
                        </Typography>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 md:pl-10">
                        {Object.entries(footerLinks).map(([title, links]) => (
                            <div key={title} className="flex flex-col gap-5">
                                <Typography font="matter" weight="semibold" className="text-xs uppercase">
                                    {title}
                                </Typography>
                                <ul className="flex flex-col gap-3">
                                    {links.map((link) => {
                                        const isExternal = link.external || link.href.startsWith('http');
                                        return (
                                            <li key={link.label}>
                                                {isExternal ? (
                                                    <a
                                                        href={link.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block border-b border-transparent hover:border-primary/20 w-fit pb-0.5"
                                                    >
                                                        {link.label}
                                                    </a>
                                                ) : (
                                                    <Link
                                                        to={link.href}
                                                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block border-b border-transparent hover:border-primary/20 w-fit pb-0.5"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-8">
                    <Typography scale="xs" className="text-muted-foreground/80 flex items-center gap-1.5">
                        Copyright {APP_NAME} {new Date().getFullYear()}
                    </Typography>
                    <Typography scale="xs" className="text-muted-foreground/80 flex items-center gap-1.5">
                        All rights reserved Bengaluru - 560032
                    </Typography>
                </div>
            </div>
        </footer>
    );
};

export default Footer;