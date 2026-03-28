import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Logo from '../reusable/Logo';

const AboutHero: React.FC = () => {
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
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    };

    const content = [
        {
            title: "AI for All through Agents",
            text: "We're building toward a future where AI is widely accessible to everyone via autonomous agents. With a world-class team of researchers and experts, we're dedicated to developing agents that understand your needs. What excites us is the chance to build and shape this technology to reflect how you think, speak, reason, and solve problems."
        },
        {
            title: "We are Building with Autonomous Agents",
            text: "We want everyone to embrace the most important technological shift of our time with confidence and control. Our ambition is to build foundational components and apply them to your unique needs. To this end, we've built a full-stack AI agents platform, with everything developed, deployed, and governed with precision."
        },
        {
            title: "We are Building for Everyday Use",
            text: "We believe the real value of our research work will come from everyday use. That means translating our research into compelling products and applications that can be put to work by enterprises, governments and developers."
        },
        {
            title: "We are Building for the Community",
            text: "Sovereign AI is a global, collective effort. With AI opening the door to a new builder era, we want to help catalyze momentum in the agentic ecosystem. It starts by powering the ecosystem with cost-efficient, high-quality models and tools, so developers, researchers, builders, and startups can create with full agency. The goal is to enable creation at scale by putting state-of-the-art AI in the hands of the community."
        }
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative w-screen min-h-screen py-10 md:py-16 px-4 md:px-12 overflow-hidden bg-card flex flex-col items-center justify-center pt-24"
        >
            {/* ✅ CENTER RADIAL GRADIENT (VISIBLE) */}
            <div
                className="
                    absolute inset-0 z-0
                    bg-[radial-gradient(ellipse_90%_70%_at_center,var(--color-primary)_0%,transparent_60%)]
                    pointer-events-none
                "
            />

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-12 w-full max-w-6xl pt-8">

                {/* CARD */}
                <motion.div variants={itemVariants} className="w-full flex justify-center">
                    <div className="
                        relative w-full max-w-[850px]
                        p-8 md:p-14
                        bg-card backdrop-blur-xl
                        shadow-2xl rounded-4xl
                        border border-border
                        overflow-hidden
                    ">

                        {/* LOGO */}
                        <div className="mx-auto mb-12 flex justify-center">
                            <Logo />
                        </div>

                        {/* CONTENT */}
                        <div className="flex flex-col gap-16 items-center text-center">
                            {content.map((item, index) => (
                                <div key={index} className="flex flex-col gap-5 max-w-2xl">
                                    <h2 className="font-season-mix text-xl md:text-2xl lg:text-3xl tracking-tight text-foreground leading-tight">
                                        {item.title}
                                    </h2>
                                    <p className="font-matter text-sm md:text-md lg:text-lg text-foreground leading-relaxed font-normal px-2">
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* GRAIN */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </motion.div>
    );
};

export default AboutHero;