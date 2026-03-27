import React from 'react';
import { Typography } from '@/components/ui/typography';
import GlassElement from '../reusable/GlassElement';
import { motion } from 'framer-motion';

const AboutVision: React.FC = () => {
    const visions = [
        {
            title: "Sovereignty",
            description: "We believe in a future where users own their agents and the data they generate. No lock-ins, just pure autonomy."
        },
        {
            title: "Scalability",
            description: "From local tasks to global impact, our platform scales agents as your needs grow, handled by our high-performance orchestrators."
        },
        {
            title: "Security",
            description: "Safety and security are built into the core. Agent behaviors are governed by strict protocols and verifiable logic."
        }
    ];

    return (
        <section className="min-h-screen w-screen bg-card py-24 flex flex-col items-center justify-center gap-16 px-8 md:px-24 pointer-events-auto">
            <div className="flex flex-col gap-4 text-center">
                <Typography font="matter" weight="semibold" className="text-primary text-xs md:text-sm uppercase tracking-widest">
                    Our Values
                </Typography>
                <h2 className="font-season-mix text-2xl md:text-4xl lg:text-5xl tracking-tight">
                    Powered by Purpose
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
                {visions.map((vision, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <GlassElement className="p-8 h-full flex flex-col gap-6 hover:border-primary/50 transition-colors duration-500 group">
                            <Typography scale="xl" weight="bold" className="font-season-mix group-hover:text-primary transition-colors">
                                {vision.title}
                            </Typography>
                            <Typography scale="base" className="text-muted-foreground leading-relaxed">
                                {vision.description}
                            </Typography>
                        </GlassElement>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default AboutVision;
