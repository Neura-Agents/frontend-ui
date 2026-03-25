import React from 'react';
import { Typography } from '@/components/ui/typography';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import type { IconSvgElement } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

export interface PricingFeature {
    text: string;
    subtext?: string;
    icon?: IconSvgElement;
}

export interface PricingCardProps {
    category: string;
    title: string;
    buttonText: string;
    features: PricingFeature[];
    onButtonClick?: () => void;
    className?: string;
    buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

/**
 * A reusable Pricing Card component that can be populated via a JSON-like object.
 * 
 * @param props - Category, Title, Button Text, and Features list.
 */
export const PricingCard: React.FC<PricingCardProps> = ({
    category,
    title,
    buttonText,
    features,
    onButtonClick,
    className,
    buttonVariant = 'outline'
}) => {
    return (
        <Card className={cn('w-full transition-all duration-300 hover:shadow-lg hover:border-primary/20', className)}>
            <CardHeader className="space-y-1">
                <Typography scale='sm' className='text-muted-foreground uppercase tracking-wider font-medium'>
                    {category}
                </Typography>
                <Typography scale='lg' font='season-mix' className="text-2xl">
                    {title}
                </Typography>
            </CardHeader>
            <CardContent className="space-y-6">
                <Button 
                    variant={buttonVariant} 
                    size='lg' 
                    className='w-full rounded-full font-semibold transition-all hover:scale-[1.02]'
                    onClick={onButtonClick}
                >
                    {buttonText}
                </Button>
                
                <div className="space-y-4">
                    {features.map((feature, index) => (
                        <div key={index} className='flex items-start gap-3 group'>
                            <div className="mt-1 shrink-0 text-primary">
                                <HugeiconsIcon 
                                    icon={(feature.icon || Tick02Icon) as IconSvgElement} 
                                    size={18} 
                                />
                            </div>
                            <div className='flex flex-col'>
                                <Typography scale='sm' className="font-medium">
                                    {feature.text}
                                </Typography>
                                {feature.subtext && (
                                    <Typography scale='xs' className='text-muted-foreground'>
                                        {feature.subtext}
                                    </Typography>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
