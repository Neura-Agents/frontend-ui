import React from 'react';

type TextScale = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
type FontFamily = 'sans' | 'matter' | 'season' | 'season-mix';
type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';

interface TypographyProps {
    as?: React.ElementType;
    scale?: TextScale;
    font?: FontFamily;
    weight?: FontWeight;
    className?: string;
    children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
    as: Component = 'p',
    scale = 'base',
    font = 'matter',
    weight = 'normal',
    className = '',
    children,
}) => {
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

    const combinedClasses = `${fonts[font]} ${scales[scale]} ${weights[weight]} ${className}`.trim();

    return (
        <Component className={combinedClasses}>
            {children}
        </Component>
    );
};
