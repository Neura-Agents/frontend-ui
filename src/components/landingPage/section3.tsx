import React, { useRef } from 'react';
import { Typography } from '../ui/typography';
import { motion, useScroll, useTransform } from 'framer-motion';
import GlassElement from '../reusable/GlassElement';

const Section3: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const MotionGlass = motion(GlassElement);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    const stepsContent = [
        {
            title: "Custom Capabilities",
            description: "Add your own custom tools and integrate Model Context Protocol (MCP) servers to extend your agents' reach into any API or service.",
            range: [0, 0.2, 0.25]
        },
        {
            title: "Knowledge Synthesis",
            description: "Leverage Knowledge Bases (KB) and Knowledge Graphs (KG) to give your agents a structured, factual understanding of your complex data.",
            range: [0.2, 0.25, 0.45, 0.5]
        },
        {
            title: "Precision Design",
            description: "Architect task-specific agents with custom prompts and specialized toolsets tailored for your most critical business workflows.",
            range: [0.45, 0.5, 0.7, 0.75]
        },
        {
            title: "Universal Integration",
            description: "Once perfected, deploy your autonomous agents seamlessly across your entire application ecosystem or existing workspaces.",
            range: [0.7, 0.75, 1]
        }
    ];

    return (
        <section ref={sectionRef} className="h-[400vh] relative pointer-events-auto">

            {/* Sticky wrapper */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-card">

                <div className='flex flex-col items-center justify-center gap-8 md:gap-16 w-full max-w-6xl px-4 '>

                    {/* Heading */}
                    <div className='flex flex-col gap-4'>
                        <h1 className="font-matter text-muted-foreground text-sm sm:text-sm md:text-md lg:text-lg leading-none text-center px-4">
                            For Enterprise | Government | Developers
                        </h1>
                        <h1 className="font-season-mix text-xl sm:text-xl md:text-3xl lg:text-5xl leading-none text-center px-4">
                            Full-stack sovereign Agents platform
                        </h1>
                    </div>

                    {/* Card Container - Borderless and clean */}
                    <div className='flex flex-col md:flex-row gap-4 md:gap-12 items-center justify-center w-full'>

                        {/* Left block (Visual/Icon) */}
                        <div className='relative w-full max-w-[450px] aspect-square rounded-[3rem] bg-warning flex items-center justify-center overflow-hidden shadow-2xl shadow-warning/20'>
                            {stepsContent.map((_, index) => {
                                const input = index === 0 ? [0, 0.2, 0.25] :
                                    index === 3 ? [0.7, 0.75, 1] :
                                        [index * 0.25 - 0.05, index * 0.25, (index + 1) * 0.25 - 0.05, (index + 1) * 0.25];

                                const opacity = useTransform(scrollYProgress, input, index === 0 ? [1, 1, 0] : index === 3 ? [0, 1, 1] : [0, 1, 1, 0]);
                                const scale = useTransform(scrollYProgress, input, index === 0 ? [1, 1, 0.8] : index === 3 ? [0.8, 1, 1] : [0.8, 1, 1, 0.8]);
                                const rotate = useTransform(scrollYProgress, input, index === 0 ? [45, 45, 30] : index === 3 ? [60, 45, 45] : [60, 45, 45, 30]);

                                return (
                                    <MotionGlass
                                        key={index + "-glass-icon"}
                                        style={{ opacity, scale, rotate }}
                                        className="absolute w-48 h-48 border-white/20 shadow-xl"
                                    />
                                );
                            })}
                        </div>

                        {/* Right block (Text content) */}
                        <div className='relative w-full max-w-[400px] h-60'>
                            {stepsContent.map((step, index) => {
                                const input = index === 0 ? [0, 0.2, 0.25] :
                                    index === 3 ? [0.7, 0.75, 1] :
                                        [index * 0.25 - 0.05, index * 0.25, (index + 1) * 0.25 - 0.05, (index + 1) * 0.25];

                                const opacity = useTransform(scrollYProgress, input, index === 0 ? [1, 1, 0] : index === 3 ? [0, 1, 1] : [0, 1, 1, 0]);
                                const y = useTransform(scrollYProgress, input, index === 0 ? [0, 0, -20] : index === 3 ? [20, 0, 0] : [20, 0, 0, -20]);

                                // Blur effect: Start blurred, sharpen when active, blur when exiting
                                const blurRaw = useTransform(scrollYProgress, input, index === 0 ? [0, 0, 10] : index === 3 ? [10, 0, 0] : [10, 0, 0, 10]);
                                const blur = useTransform(blurRaw, (v) => `blur(${v}px)`);

                                return (
                                    <motion.div
                                        key={index}
                                        style={{ opacity, y, filter: blur }}
                                        className="absolute inset-0 flex flex-col gap-6 justify-center"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <Typography className="text-foreground font-bold text-2xl md:text-3xl tracking-tight">
                                                {step.title}
                                            </Typography>
                                            <Typography className="text-muted-foreground text-md leading-relaxed">
                                                {step.description}
                                            </Typography>
                                        </div>

                                        <div className='flex gap-3'>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default Section3;