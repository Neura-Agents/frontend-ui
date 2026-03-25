import React from 'react';
import { Typography } from '@/components/ui/typography';
import { PricingCard, type PricingCardProps } from '@/components/pricing/pricing-card';
import { FAQSection } from '@/components/pricing/faq-section';

const pricingData: PricingCardProps[] = [
    {
        category: 'Starter',
        title: 'Pay as you go',
        buttonText: 'Get Started',
        buttonVariant: 'outline',
        features: [
            {
                text: 'No Bonus Credits',
                subtext: 'Standard rate applies',
            },
            {
                text: 'Full API Access',
                subtext: 'Access to all models',
            },
            {
                text: 'Community Support',
                subtext: '24/7 access to docs',
            }
        ]
    },
    {
        category: 'Pro',
        title: '$49 / month',
        buttonText: 'Upgrade to Pro',
        buttonVariant: 'default',
        features: [
            {
                text: '5000 Bonus Credits',
                subtext: 'Monthly recurring',
            },
            {
                text: 'Priority API Access',
                subtext: 'Higher rate limits',
            },
            {
                text: 'Premium Support',
                subtext: 'Direct email support',
            }
        ]
    },
    {
        category: 'Business',
        title: '$200 / month',
        buttonText: 'Upgrade to Business',
        buttonVariant: 'default',
        features: [
            {
                text: '25000 Bonus Credits',
                subtext: 'Monthly recurring',
            },
            {
                text: 'Priority API Access',
                subtext: 'Higher rate limits',
            },
            {
                text: 'Premium Support',
                subtext: 'Direct email support',
            },
            {
                text: 'Advanced Analytics',
                subtext: 'Real-time usage tracking',
            }
        ]
    }
];

const PricingPage: React.FC = () => {

    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-24 pt-32 md:pt-0">
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <Typography variant="page-header">
                    Pricing
                </Typography>
                <Typography variant="page-description">
                    Simple, transparent pricing for every use case.
                </Typography>
            </section>

            <div className="space-y-12 px-4">
                <div className='flex flex-col items-center text-center'>
                    <Typography scale='2xl' font='season-mix' className="tracking-tight">
                        Simple transparent pricing
                    </Typography>
                    <Typography scale='sm' className='text-muted-foreground max-w-2xl'>
                        Add credits anytime. No subscriptions, no hidden fees. Credits never expire.
                    </Typography>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center pb-12'>
                    {pricingData.map((data, index) => (
                        <PricingCard key={index} {...data} />
                    ))}
                </div>
            </div>

            <section className="pb-12 pt-12">
                <FAQSection />
            </section>
        </div>
    );
};

export default PricingPage;
