import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    linkClassName?: string;
    showIcon?: boolean;
    fontSize?: string; // Still supported for custom sizes
    variant?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({
    className,
    linkClassName,
    showIcon = true,
    fontSize,
    variant = 'md',
}) => {
    const variantStyles = {
        sm: {
            icon: 'size-5',
            text: 'text-lg',
            gap: 'gap-2'
        },
        md: {
            icon: 'size-6',
            text: 'text-xl',
            gap: 'gap-3'
        },
        lg: {
            icon: 'size-8',
            text: 'text-2xl',
            gap: 'gap-4'
        }
    };

    const styles = variantStyles[variant];

    return (
        <div className={cn("flex items-center", styles.gap, className)}>
            <Link
                to="/"
                className={cn(
                    fontSize || styles.text,
                    "group/logo font-light tracking-tight text-foreground hover:cursor-pointer flex flex-row items-center transition-all duration-300 font-season-mix whitespace-nowrap flex-nowrap",
                    styles.gap,
                    linkClassName
                )}
            >
                {showIcon && (
                    <div
                        className={cn(
                            styles.icon,
                            "bg-contain bg-no-repeat bg-center transition-all duration-300 group-hover/logo:scale-110"
                        )}
                        style={{ backgroundImage: 'var(--logo-url)' }}
                    />
                )}
                <span className="transition-all duration-300 group-hover/logo:scale-105 origin-left inline-block">
                    Neura Agents
                </span>
            </Link>
        </div>
    );
};

export default Logo;
