import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'outline' | 'accent' | 'alt';
    className?: string;
    pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    className = '',
    pulse = false
}) => {
    const variants = {
        default: "bg-white/5 text-gray-400 border-white/10",
        outline: "bg-transparent text-white border-white/10",
        accent: "bg-accent/10 text-accent border-accent/20",
        alt: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };

    return (
        <div className={`inline-flex items-center gap-2 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border rounded transition-all duration-300 ${variants[variant]} ${className}`}>
            {pulse && (
                <span className="relative flex w-1.5 h-1.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${variant === 'accent' ? 'bg-accent' : variant === 'alt' ? 'bg-blue-500' : 'bg-white'}`}></span>
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${variant === 'accent' ? 'bg-accent' : variant === 'alt' ? 'bg-blue-500' : 'bg-white'}`}></span>
                </span>
            )}
            {children}
        </div>
    );
};
