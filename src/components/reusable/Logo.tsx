import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    linkClassName?: string;
    showIcon?: boolean;
    fontSize?: string;
}

const Logo: React.FC<LogoProps> = ({
    className,
    linkClassName,
    showIcon = true,
    fontSize = "text-xl"
}) => {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <Link
                to="/"
                className={cn(
                    fontSize,
                    "group/logo font-light tracking-tight text-foreground hover:cursor-pointer flex flex-row items-center gap-2 transition-all duration-300 font-season-mix whitespace-nowrap flex-nowrap",
                    linkClassName
                )}
            >
                {showIcon && (
                    <div
                        className="size-6 bg-contain bg-no-repeat bg-center transition-all duration-300 group-hover/logo:scale-110"
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
