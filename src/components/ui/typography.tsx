import React from 'react';

type TextScale = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
type FontFamily = 'sans' | 'matter' | 'season' | 'season-mix';
type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';

interface TypographyProps {
    as?: React.ElementType;
    variant?: 'page-header' | 'page-description';
    scale?: TextScale;
    font?: FontFamily;
    weight?: FontWeight;
    className?: string;
    children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
    as: Component = 'p',
    variant,
    scale,
    font,
    weight,
    className = '',
    children,
}) => {
    // Define variant defaults
    const variantStyles: Record<string, Partial<TypographyProps>> = {
        'page-header': {
            font: 'season-mix',
            weight: 'normal',
            className: 'text-3xl md:text-4xl lg:text-5xl tracking-tight mb-2',
        },
        'page-description': {
            font: 'matter',
            weight: 'normal',
            className: 'text-base md:text-lg text-muted-foreground max-w-2xl',
        }
    };

    // Get current variant styles or fallback to empty
    const currentVariant = variant ? variantStyles[variant] : {};

    // Determine values
    // If a variant is used, we prefer its font/weight unless overridden by individual props.
    // However, for scale, we don't want to apply 'text-base' if the variant handles size via className.
    const finalFont = font || currentVariant.font || 'matter';
    const finalWeight = weight || currentVariant.weight || 'normal';
    const finalScale = scale || currentVariant.scale;
    const finalClassName = `${currentVariant.className || ''} ${className}`.trim();

    const scales: Record<TextScale, string> = {
        'xs': 'text-xs',
        'sm': 'text-sm',
        'base': 'text-base',
        'lg': 'text-lg',
        'xl': 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
    };

    const fonts: Record<FontFamily, string> = {
        'sans': 'font-sans',
        'matter': 'font-matter',
        'season': 'font-season',
        'season-mix': 'font-season-mix',
    };

    const weights: Record<FontWeight, string> = {
        'normal': 'font-normal',
        'medium': 'font-medium',
        'semibold': 'font-semibold',
        'bold': 'font-bold',
    };

    // Construct class list
    const classList = [
        fonts[finalFont],
        finalScale ? scales[finalScale] : (!variant ? 'text-base' : ''),
        weights[finalWeight],
        finalClassName
    ].filter(Boolean).join(' ');

    const combinedClasses = classList.trim();

    return (
        <Component className={combinedClasses}>
            {children}
        </Component>
    );
};
