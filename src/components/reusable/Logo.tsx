import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
interface LogoProps {
    className?: string;
    linkClassName?: string;
    showIcon?: boolean;
    fontSize?: string; // Still supported for custom sizes
    variant?: 'sm' | 'md' | 'lg';
    noLink?: boolean;
}

const Logo: React.FC<LogoProps> = ({
    className,
    linkClassName,
    showIcon = true,
    fontSize,
    variant = 'md',
    noLink = false
}) => {
    const variantStyles = {
        sm: {
            icon: 'h-5 w-20',
            text: 'text-lg',
            gap: 'gap-2'
        },
        md: {
            icon: 'h-7 w-28',
            text: 'text-xl',
            gap: 'gap-3'
        },
        lg: {
            icon: 'h-10 w-40',
            text: 'text-2xl',
            gap: 'gap-4'
        }
    };

    const styles = variantStyles[variant];

    const baseClasses = cn(
        fontSize || styles.text,
        "group/logo font-light tracking-tight text-foreground flex flex-row items-center transition-all duration-300 font-season-mix whitespace-nowrap flex-nowrap",
        styles.gap,
        linkClassName || "",
        noLink ? "" : "hover:cursor-pointer"
    );

    const logoContent = (
        <>
            {showIcon && (
                <div
                    className={cn(
                        styles.icon,
                        "bg-foreground transition-all duration-300",
                        !noLink && "group-hover/logo:scale-110"
                    )}
                    style={{ 
                        WebkitMaskImage: 'var(--logo-url)',
                        maskImage: 'var(--logo-url)',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain',
                        WebkitMaskPosition: 'left',
                        maskPosition: 'left'
                    }}
                />
            )}
        </>
    );

    return (
        <div className={cn("flex items-center", styles.gap, className)}>
            {noLink ? (
                <div className={baseClasses}>
                    {logoContent}
                </div>
            ) : (
                <Link to="/" className={baseClasses}>
                    {logoContent}
                </Link>
            )}
        </div>
    );
};

export default Logo;
