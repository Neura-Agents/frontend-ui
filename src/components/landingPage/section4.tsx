import React from 'react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import GlassElement from '../reusable/GlassElement';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { useUmami } from '@/hooks/useUmami';

const APP_NAME = import.meta.env.VITE_APP_NAME;

const Section4: React.FC = () => {
    const { login } = useAuth();
    const location = useLocation();
    const from = location.state?.from || "/agents";
    const { track } = useUmami();

    // Configuration for background floating elements
    const floatingElements = [
        // Core elements (Show on all screens)
        { top: '10%', left: '8%', size: 'w-16 h-16', rotate: -15, delay: 0.1, show: 'always' },
        { top: '15%', right: '12%', size: 'w-24 h-24', rotate: 65, delay: 0.3, show: 'always' },
        { bottom: '10%', right: '8%', size: 'w-28 h-28', rotate: -35, delay: 0.5, show: 'always' },

        // Mid-sized/extra elements (Show on tablet and above)
        { bottom: '12%', left: '14%', size: 'w-20 h-20', rotate: 110, delay: 0.2, show: 'md' },
        { top: '45%', left: '4%', size: 'w-16 h-16', rotate: 180, delay: 0.4, show: 'md' },

        // Detailed elements (Only on large screens)
        { top: '40%', right: '5%', size: 'w-18 h-18', rotate: -90, delay: 0.25, show: 'lg' },
        { top: '8%', left: '45%', size: 'w-14 h-14', rotate: 30, delay: 0.15, show: 'lg' },
        { bottom: '6%', left: '48%', size: 'w-16 h-16', rotate: -120, delay: 0.35, show: 'lg' },
    ];

    // Wrap GlassElement with motion for simplified animation use
    const MotionGlass = motion(GlassElement);

    return (
        <div className="bg-card rounded-b-4xl w-screen h-screen flex flex-col items-center justify-center pt-30 md:pt-20 pointer-events-auto relative">
            <div className='flex flex-col items-center justify-center gap-8 md:gap-16 w-full max-w-6xl px-4'>
                {/* Outer Border Frame with Padding for the card */}
                <div className='relative w-full max-w-[960px] p-4 sm:p-4 md:p-4 rounded-[4.5rem] border border-warning/20 bg-warning/5 shadow-2xl shadow-warning/10'>

                    {/* Visual Card - Constant height, responsive width */}
                    <div className='relative w-full h-[420px] rounded-[3.5rem] bg-warning flex items-center justify-center overflow-hidden shadow-xl'>

                        {/* Background Floating Elements - Full Opacity with Breakpoint Visibility */}
                        {floatingElements.map((el, i) => (
                            <MotionGlass
                                key={i}
                                variant='flower'
                                initial={{ scale: 0, rotate: el.rotate - 180, opacity: 0 }}
                                whileInView={{ scale: 1, rotate: el.rotate, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 3.5,
                                    delay: el.delay,
                                    ease: [0.16, 1, 0.3, 1],
                                    rotate: { duration: 4.5, ease: "easeOut" }
                                }}
                                className={cn(
                                    "absolute pointer-events-none rounded-2xl border-white/20",
                                    el.size,
                                    el.show === 'md' ? 'hidden md:flex' : '',
                                    el.show === 'lg' ? 'hidden lg:flex' : '',
                                    el.show === 'always' ? 'flex' : ''
                                )}
                                style={{ top: el.top, left: el.left, right: el.right, bottom: el.bottom }}
                            />
                        ))}

                        <div className='flex flex-col items-center gap-6 md:gap-10 relative z-10 pointer-events-auto'>

                            {/* Card Heading - Perfectly Centered */}
                            <div className="flex flex-col gap-8 items-center">
                                <h2 className="font-season-mix text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-background text-center px-4 md:px-8 leading-tight max-w-2xl">
                                    Build the future of Agents <br className="hidden md:block" /> with {APP_NAME}.
                                </h2>

                                {/* Call to Action Button - Faded Glass with Premium Hover - Responsive Sizing */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="pointer-events-auto"
                                >
                                    <Button
                                        size="lg"
                                        onClick={() => {
                                            track('landing-footer-cta-click');
                                            login('', from);
                                        }}
                                        className={cn(
                                            "rounded-full font-bold group cursor-pointer pointer-events-auto transition-all duration-300 shadow-xl",
                                            "bg-white/10 backdrop-blur-md border border-white/30 text-background",
                                            "hover:bg-white/20 hover:backdrop-blur-xl",
                                            "px-8 py-6 text-md",           // Mobile default
                                            "md:px-10 md:py-7 md:text-lg", // Tablet
                                            "lg:px-12 lg:py-8 lg:text-xl"  // Desktop
                                        )}
                                    >
                                        Get Started
                                    </Button>
                                </motion.div>
                            </div>

                        </div>

                        {/* Decorative Blurs */}
                        <div className="absolute top-0 -left-10 w-60 h-60 bg-white/5 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 -right-10 w-60 h-60 bg-white/5 rounded-full blur-[100px]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Section4;