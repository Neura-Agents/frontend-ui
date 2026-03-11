import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'shadow' | 'borderless';
    rounded?: 'none' | 'sm' | 'DEFAULT' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default',
    rounded = 'xl',
    glow = false
}) => {
    const variants = {
        default: 'bg-card border border-white/10 shadow-sm',
        shadow: 'bg-card shadow-2xl shadow-black/50',
        borderless: 'bg-card border-none shadow-xl shadow-black/40'
    };

    const roundedStyles = {
        none: "rounded-none",
        sm: "rounded-sm",
        DEFAULT: "rounded",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        '2xl': "rounded-2xl",
        full: "rounded-full",
    };

    return (
        <div className={`${variants[variant]} ${roundedStyles[rounded]} p-6 ${glow ? 'hover:border-accent/30 transition-colors' : ''} ${className}`}>
            {children}
        </div>
    );
};
