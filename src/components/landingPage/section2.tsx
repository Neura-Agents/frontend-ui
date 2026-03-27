import React from 'react';
import { Typography } from '../ui/typography';
import GlassElement from '../reusable/GlassElement';

const Section2: React.FC = () => {
    return (
        <section className="relative w-screen h-screen bg-card flex flex-col items-center justify-center pointer-events-auto pt-30 md:pt-20">
            <div className='flex flex-col items-center justify-center gap-8 md:gap-16 w-full max-w-6xl px-4'>

                {/* Heading */}
                <h1 className="font-season-mix text-xl sm:text-xl md:text-3xl lg:text-5xl leading-none text-center px-4">
                    Powering Agents First Future
                </h1>

                {/* Static Card Design */}
                <div className='flex flex-col md:flex-row gap-4 md:gap-12 items-center justify-center w-full'>

                    {/* Left block (Visual/Icon) */}
                    <div className='relative w-full max-w-[450px] aspect-square rounded-[3rem] bg-primary flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/20'>
                        <GlassElement className="w-48 h-48 rotate-45 shadow-xl" />
                    </div>

                    {/* Right block (Text content) */}
                    <div className='flex flex-col gap-6 w-full max-w-[400px]'>
                        <div className="flex flex-col gap-2">
                            <Typography className="text-foreground font-bold text-2xl md:text-3xl tracking-tight">
                                Autonomous Core
                            </Typography>
                            <Typography className="text-muted-foreground text-md leading-relaxed">
                                Our sovereign platform provides the bedrock for a future where agents handle complexity. From private cloud to edge deployment, build with total data ownership.
                            </Typography>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Section2;