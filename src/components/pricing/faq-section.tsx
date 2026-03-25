import React, { useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-border/50 last:border-0 transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-3 flex items-center justify-between text-left group hover:cursor-pointer rounded-lg px-4 -mx-4 transition-colors"
                aria-expanded={isOpen}
            >
                <Typography scale="base" className="pr-8 group-hover:text-primary transition-colors">
                    {question}
                </Typography>
                <div className={cn(
                    "transition-transform duration-300 text-muted-foreground group-hover:text-primary",
                    isOpen ? "rotate-180" : "rotate-0"
                )}>
                    <HugeiconsIcon icon={ArrowDown01Icon} size={20} />
                </div>
            </button>
            <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
            )}>
                <Typography scale="sm" className="text-muted-foreground leading-relaxed">
                    {answer}
                </Typography>
            </div>
        </div>
    );
};

export const FAQSection: React.FC = () => {
    const faqs = [
        {
            question: "How do credits work?",
            answer: "Credits are the currency of our platform. You can purchase them on a pay-as-you-go basis or receive them as part of a recurring plan. One credit typically equates to one API request, depending on the model used."
        },
        {
            question: "Do my credits expire?",
            answer: "No, credits purchased on the platform never expire. Use them whenever you need, whether that's today or a year from now."
        },
        {
            question: "Can I upgrade my plan at any time?",
            answer: "Yes, you can upgrade or downgrade your plan at any time through your billing dashboard. Changes are applied immediately."
        },
        {
            question: "Is there a limit to how many credits I can buy?",
            answer: "There are no hard limits. For high-volume enterprise needs, please contact our support team for custom volume discounts."
        },
        {
            question: "What happens if I run out of credits?",
            answer: "If your balance reaches zero, API requests will be paused until you add more credits. We recommend setting up auto-recharge for mission-critical applications."
        },
        {
            question: "How do credits work?",
            answer: "Credits are the currency of our platform. You can purchase them on a pay-as-you-go basis or receive them as part of a recurring plan. One credit typically equates to one API request, depending on the model used."
        },
        {
            question: "Do my credits expire?",
            answer: "No, credits purchased on the platform never expire. Use them whenever you need, whether that's today or a year from now."
        },
        {
            question: "Can I upgrade my plan at any time?",
            answer: "Yes, you can upgrade or downgrade your plan at any time through your billing dashboard. Changes are applied immediately."
        },
        {
            question: "Is there a limit to how many credits I can buy?",
            answer: "There are no hard limits. For high-volume enterprise needs, please contact our support team for custom volume discounts."
        },
        {
            question: "What happens if I run out of credits?",
            answer: "If your balance reaches zero, API requests will be paused until you add more credits. We recommend setting up auto-recharge for mission-critical applications."
        },
        {
            question: "How do credits work?",
            answer: "Credits are the currency of our platform. You can purchase them on a pay-as-you-go basis or receive them as part of a recurring plan. One credit typically equates to one API request, depending on the model used."
        },
        {
            question: "Do my credits expire?",
            answer: "No, credits purchased on the platform never expire. Use them whenever you need, whether that's today or a year from now."
        },
        {
            question: "Can I upgrade my plan at any time?",
            answer: "Yes, you can upgrade or downgrade your plan at any time through your billing dashboard. Changes are applied immediately."
        },
        {
            question: "Is there a limit to how many credits I can buy?",
            answer: "There are no hard limits. For high-volume enterprise needs, please contact our support team for custom volume discounts."
        },
        {
            question: "What happens if I run out of credits?",
            answer: "If your balance reaches zero, API requests will be paused until you add more credits. We recommend setting up auto-recharge for mission-critical applications."
        }
    ];

    return (
        <div className="flex flex-col lg:flex-row lg:gap-32 gap-12 px-4 relative">
            <div className="lg:w-1/3 text-center lg:text-left lg:sticky lg:top-0 h-fit">
                <Typography scale="2xl" font="season-mix" className="lg:leading-tight">
                    Frequently Asked Questions
                </Typography>
            </div>
            <div className="flex-1">
                <div className="divide-y divide-border/50">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} {...faq} />
                    ))}
                </div>
            </div>
        </div>
    );
};
