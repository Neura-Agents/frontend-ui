import React from 'react';
import { cn } from "@/lib/utils";

/**
 * Reusable GlassElement component representing the premium frosted glass visuals.
 * The component is designed to be highly flexible, allowing layout and animation
 * to be managed by the parent container.
 */

interface GlassElementProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'square' | 'circle' | 'flower';
    innerSize?: string;
    innerBlur?: string;
}

const GlassElement = React.forwardRef<HTMLDivElement, GlassElementProps>(({ 
    className, 
    variant = 'square',
    innerSize = "w-1/4 h-1/4",
    innerBlur = "blur-md",
    ...props 
}, ref) => {
    // Shared glass styles
    const glassBase = "backdrop-blur-3xl border border-white/20 shadow-2xl flex items-center justify-center bg-white/10";

    if (variant === 'flower') {
        const flowerPath = "M26.6816 55C22.4084 50.5975 20.605 44.5849 21.29 38.8359C19.0727 40.3552 16.3294 41.2537 13.3594 41.2539L13.3594 39.8096C13.3595 37.4651 14.0681 35.2743 15.2969 33.4092C10.0253 33.9921 4.55356 32.2031 0.512697 28.04L-0.000974451 27.5107C4.23184 23.15 9.99828 21.2855 15.5303 21.9365C14.1564 19.999 13.3564 17.6815 13.3564 15.1904L13.3564 13.7461C16.3368 13.746 19.0883 14.6511 21.3096 16.1797C20.6194 10.426 22.4221 4.40646 26.6992 -2.17597e-06C30.9759 4.40617 32.7787 10.4254 32.0889 16.1787C34.3098 14.651 37.0599 13.7453 40.0391 13.7451L40.0391 15.6152C40.039 17.9206 39.3278 20.0716 38.1006 21.8936C43.5551 21.3278 49.2105 23.2007 53.3789 27.4951L52.8652 28.0244C48.8273 32.1843 43.3607 33.9736 38.0928 33.3945C39.3271 35.2626 40.0392 37.4592 40.0391 39.8096L40.0391 41.2539C37.0522 41.254 34.2941 40.3452 32.0703 38.8105C32.7637 44.5671 30.961 50.5911 26.6816 55ZM26.7002 27.5264C26.7039 27.5203 26.7088 27.5158 26.7148 27.5117C26.713 27.5032 26.7119 27.4949 26.7129 27.4863C26.7088 27.4831 26.7062 27.4787 26.7031 27.4746C26.7009 27.4747 26.6986 27.4747 26.6963 27.4746C26.6896 27.4853 26.6781 27.4935 26.665 27.4971C26.6654 27.499 26.6658 27.5009 26.666 27.5029C26.6808 27.5063 26.6932 27.5142 26.7002 27.5264Z";

        return (
            <div 
                ref={ref} 
                className={cn("relative flex items-center justify-center", className)} 
                {...props}
            >
                {/* Visual Glass Flower Layer */}
                <svg width="100%" height="100%" viewBox="0 0 54 55" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full filter drop-shadow-xl">
                    <defs>
                        <mask id="flower-mask">
                            <path d={flowerPath} fill="white" />
                        </mask>
                        <radialGradient id="flower-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="white" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    
                    {/* The Background Blur Layer clipped and masked to the flower shape */}
                    <rect 
                        width="100%" 
                        height="100%" 
                        fill="white" 
                        fillOpacity="0.1" 
                        mask="url(#flower-mask)" 
                        style={{ backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)' }}
                    />
                    
                    {/* The Border Stroke - Thinner and sharper */}
                    <path 
                        d={flowerPath} 
                        stroke="rgba(255,255,255,0.3)" 
                        strokeWidth="0.5"
                    />

                    {/* Central Glow point for depth */}
                    <circle cx="27" cy="27.5" r="5" fill="white" fillOpacity="0.1" filter="blur(3px)" />
                    
                    {/* Subtle surface highlight */}
                    <path 
                        d={flowerPath} 
                        fill="url(#flower-glow)"
                    />
                </svg>
            </div>
        );
    }

    return (
        <div 
            ref={ref}
            className={cn(
                glassBase,
                variant === 'square' ? 'rounded-3xl' : 'rounded-full',
                className
            )}
            {...props}
        >
            <div className={cn(
                "bg-white/10 rounded-full",
                innerSize,
                innerBlur
            )} />
        </div>
    );
});

GlassElement.displayName = 'GlassElement';

export default GlassElement;
