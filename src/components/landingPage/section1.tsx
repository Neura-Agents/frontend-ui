import React from 'react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Section1: React.FC = () => {
    const { login } = useAuth();
    const location = useLocation();
    const from = location.state?.from || "/agents";

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative bg-card w-screen h-screen flex flex-col gap-10 items-center justify-between pt-50 overflow-hidden pointer-events-auto"
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.4, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 
    w-[900px] h-[900px] rounded-full 
    bg-[radial-gradient(ellipse_100%_30%,var(--color-primary)_40%,transparent_70%)] 
    blur-3xl pointer-events-none"
            />
            <div className='flex flex-col items-center justify-center gap-10'>
                <motion.div variants={itemVariants}>
                    <Typography font="matter" weight='semibold' className='bg-transparent px-4 py-1.5 rounded-full border border-border text-primary text-xs md:text-sm'>
                        World's Soverign Agents Platform
                    </Typography>
                </motion.div>
                <div className='flex flex-col gap-4 items-center'>
                    <motion.h1
                        variants={itemVariants}
                        className="font-season-mix text-3xl sm:text-3xl md:text-5xl lg:text-7xl leading-none text-center px-4 tracking-tighter"
                    >
                        Agents for all
                    </motion.h1>
                    <motion.h2
                        variants={itemVariants}
                        className='text-base md:text-lg lg:text-xl max-w-2xl text-center px-6 opacity-80 font-matter'
                    >
                        Create, deploy, and manage autonomous agents with ease. Powered by frontier-class models. Delivering population-scale impact.
                    </motion.h2>
                </div>
                <motion.div
                    variants={itemVariants}
                    className="relative z-30 pointer-events-auto cursor-pointer"
                >
                    <Button
                        size="lg"
                        onClick={() => login('', from)}
                        className='rounded-full text-sm md:text-base px-6 py-4 md:py-6 font-semibold font-season-mix hover:cursor-pointer relative z-40'
                    >
                        Experience the future
                    </Button>
                </motion.div>
            </div>
            <motion.div
                variants={itemVariants}
                className='flex flex-col w-full items-center gap-2'
            >
                <Typography className='text-xs md:text-sm text-muted-foreground'>
                    Trusted by leading organizations worldwide
                </Typography>
                <div className="w-full overflow-hidden bg-primary/10 py-4 md:py-8 lg:py-10">
                    <div className="flex w-max gap-10 animate-[scrollRight_60s_linear_infinite]">
                        {[...Array(2)].map((_, j) =>
                            [...Array(10)].map((_, i) => (
                                <div
                                    key={`${j}-${i}`}
                                    className="flex items-center gap-2 text-primary font-medium"
                                >
                                    <HugeiconsIcon icon={SparklesIcon} size={18} className="w-5 h-5 md:w-[18px] md:h-[18px]" />
                                    <span className='text-base md:text-lg'>Deploy Agents Faster</span>
                                    <HugeiconsIcon icon={SparklesIcon} size={18} className="w-5 h-5 md:w-[18px] md:h-[18px]" />
                                    <span className='text-base md:text-lg'>Scale Seamlessly</span>
                                    <HugeiconsIcon icon={SparklesIcon} size={18} className="w-5 h-5 md:w-[18px] md:h-[18px]" />
                                    <span className='text-base md:text-lg'>Frontier Models</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Section1;