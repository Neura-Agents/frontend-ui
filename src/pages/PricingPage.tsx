import React, { useEffect, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { PricingCard, type PricingCardProps } from '@/components/pricing/pricing-card';
import { FAQSection } from '@/components/pricing/faq-section';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/landingPage/footer';
import AboutSpacer from '@/components/aboutUs/AboutSpacer';
import { platformService } from '@/services/platformService';
import { modelsService, type Model } from '@/services/modelsService';
import { useUmami } from '@/hooks/useUmami';
import { useNavigate } from 'react-router-dom';
import { billingService } from '@/services/billingService';
import AddCreditsDialog from '@/components/billing/AddCreditsDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usageService } from '@/services/usageService';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { DataTable as ModelDataTable } from '@/tables/models/data-table';
import { columns as modelColumns } from '@/tables/models/columns';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const CURRENCIES = [
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
    { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
];

const fallbackPricingData: PricingCardProps[] = [
    {
        category: 'Starter',
        title: 'Pay as you go',
        buttonText: 'Get Started',
        buttonVariant: 'outline',
        features: [{ text: 'No Bonus Credits', subtext: 'Standard rate applies' }]
    }
];

const PricingPage: React.FC = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [showFooterGlow, setShowFooterGlow] = useState(false);
    const [plans, setPlans] = useState<PricingCardProps[]>([]);
    const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(true);
    const [modelsLoading, setModelsLoading] = useState(true);
    const [currency, setCurrency] = useState('USD');
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
        USD: 1,
        INR: 83.50,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 151.70,
        CAD: 1.35,
        AUD: 1.52,
    });

    // Payment-related state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState<number>(100);
    const [isProcessing, setIsProcessing] = useState(false);

    const { track } = useUmami();

    const handleTopUp = async (data: { credits?: number; amount?: number }) => {
        try {
            setIsProcessing(true);
            const displayValue = data.credits || data.amount || 0;
            track('top-up-initiated-pricing', data);

            // 1. Create Order
            const orderData = await billingService.createRazorpayOrder(data);

            // 1.5 Load Razorpay Script if not present
            if (!(window as any).Razorpay) {
                const loaded = await loadRazorpayScript();
                if (!loaded) {
                    throw new Error('Failed to load Razorpay SDK');
                }
            }

            // 2. Configure Razorpay
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "WormLabs",
                image: `${window.location.origin}/WormLabsLogoDark.png`,
                description: `Top up ${displayValue} ${data.credits ? 'credits' : 'INR'}`,
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    try {
                        // 3. Verify Payment
                        await billingService.verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: displayValue
                        });

                        track('top-up-success-pricing', data);
                        setIsProcessing(false);
                        // 4. Navigate to billing page on success
                        navigate('/billing');
                    } catch (error) {
                        console.error('Verification failed:', error);
                        track('top-up-verification-failed-pricing');
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: user?.name || "User",
                    email: user?.email || "user@example.com",
                },
                theme: {
                    color: "#000000",
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Top-up failed:', error);
            track('top-up-failed-pricing');
            setIsProcessing(false);
        }
    };

    const handleBuyPlan = (planData: PricingCardProps) => {
        const APP_MODE = (import.meta.env.VITE_APP_MODE as 'public' | 'dashboard') || 'dashboard';
        
        if (APP_MODE === 'public') {
            // Jump to dashboard pricing which handles auth & flow
            const dashboardUrl = import.meta.env.VITE_DASHBOARD_URL || window.location.origin.replace(':7999', ':8005');
            window.location.href = `${dashboardUrl}/pricing`;
            return;
        }

        if (!user) {
            login();
            return;
        }

        // If numeric title found, set it as default amount
        const isNumeric = /^\d+(\.\d+)?$/.test(planData.title.trim());
        if (isNumeric) {
            setSelectedAmount(parseFloat(planData.title));
        } else {
            setSelectedAmount(100); // Starter/default
        }
        setIsDialogOpen(true);
    };

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const data = await usageService.getExchangeRates();
                if (data && data.rates) {
                    setExchangeRates(prev => ({ ...prev, ...data.rates }));
                }
            } catch (error) {
                console.error('Failed to fetch internal exchange rates:', error);
            }
        };
        fetchRates();
    }, []);

    const formatPrice = (title: string) => {
        // If it's not a number (e.g. "Pay as you go"), return it as is
        const isNumeric = /^\d+(\.\d+)?$/.test(title.trim());
        if (!isNumeric) return title;

        const numValue = parseFloat(title);
        const rate = exchangeRates[currency] || 1;
        
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numValue * rate);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const fetchData = async () => {
                setLoading(true);
                setModelsLoading(true);

                // Fetch Plans and FAQs
                try {
                    const pricingData = await platformService.getPricing();
                    if (pricingData && pricingData.plans) {
                        setPlans(pricingData.plans);
                        setFaqs(pricingData.faqs || []);
                    } else {
                        setPlans(fallbackPricingData);
                    }
                } catch (error) {
                    console.error('Failed to fetch pricing:', error);
                    setPlans(fallbackPricingData);
                } finally {
                    setLoading(false);
                }

                // Fetch Model Prices independently
                try {
                    const modelsData = await modelsService.getModels();
                    setModels(modelsData || []);
                } catch (error) {
                    console.error('Failed to fetch models:', error);
                } finally {
                    setModelsLoading(false);
                }
            };

            fetchData();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const PricingContent = (
        <div className={`container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-6 ${user ? 'pt-32 md:pt-0 pb-12' : 'pt-24'}`}>
            {
                user ? (
                    <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                        <Typography variant="page-header">
                            Pricing
                        </Typography>
                        <Typography variant="page-description">
                            Simple, transparent pricing for every use case.
                        </Typography>
                    </section>
                )
                    :
                    (
                        <section className="px-2">
                            <Typography variant="page-header">
                                Pricing
                            </Typography>
                            <Typography variant="page-description">
                                Simple, transparent pricing for every use case.
                            </Typography>
                        </section>
                    )
            }

            <div className="flex flex-col gap-16 px-4">
                <div className='flex flex-col gap-8'>
                    <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
                        <div className='flex flex-col'>
                            <Typography scale='2xl' font='season-mix' className="tracking-tight">
                                Simple transparent pricing
                            </Typography>
                            <Typography scale='sm' className='text-muted-foreground max-w-2xl'>
                                Add credits anytime. No subscriptions, no hidden fees. Credits never expire.
                            </Typography>
                        </div>
                        
                        <div className="flex flex-col gap-1.5 min-w-[140px]">
                            <Typography scale='xs' className='text-muted-foreground ml-1'>Currency</Typography>
                            <Select value={currency} onValueChange={(val) => setCurrency(val)}>
                                <SelectTrigger className="h-10 rounded-full border border-border bg-card/50 backdrop-blur-sm px-4">
                                    <SelectValue placeholder="USD" />
                                </SelectTrigger>
                                <SelectContent className='rounded-xl'>
                                    {CURRENCIES.map(curr => (
                                        <SelectItem key={curr.code} value={curr.code} className='rounded-lg'>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground w-4">{curr.symbol}</span>
                                                <span>{curr.code}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center'>
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <Card key={i} className="flex flex-col h-96 border-border/50 bg-card/30 animate-pulse">
                                    <CardHeader className="space-y-4 pt-10">
                                        <div className="h-6 w-1/3 bg-muted rounded mx-auto" />
                                        <div className="h-10 w-2/3 bg-muted/70 rounded mx-auto" />
                                    </CardHeader>
                                    <CardContent className="space-y-6 px-10">
                                        <div className="space-y-2">
                                            <div className="h-4 w-full bg-muted/50 rounded" />
                                            <div className="h-4 w-5/6 bg-muted/50 rounded" />
                                            <div className="h-4 w-4/5 bg-muted/50 rounded" />
                                            <div className="h-4 w-full bg-muted/50 rounded" />
                                        </div>
                                        <div className="h-12 w-full bg-muted/60 rounded-full mt-auto" />
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            plans.map((data, index) => (
                                <PricingCard
                                    key={index}
                                    {...data}
                                    title={formatPrice(data.title)}
                                    onButtonClick={() => {
                                        track('pricing-plan-select', {
                                            plan_category: data.category,
                                            plan_title: data.title
                                        });
                                        handleBuyPlan(data);
                                    }}
                                />
                            ))
                        )}
                    </div>
                </div>

                <AddCreditsDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onAdd={(amount) => {
                        setIsDialogOpen(false);
                        handleTopUp(amount);
                    }}
                    isLoading={isProcessing}
                    defaultAmount={selectedAmount}
                    defaultMode="credits"
                    exchangeRate={exchangeRates.INR}
                />

                <div className="flex flex-col gap-4">
                    <div className='flex flex-col'>
                        <Typography scale='2xl' font='season-mix' className="tracking-tight">
                            Model Pricing
                        </Typography>
                        <Typography scale='sm' className='text-muted-foreground max-w-2xl'>
                            Detailed breakdown of costs per token for all available models.
                        </Typography>
                    </div>

                    <ModelDataTable
                        columns={modelColumns}
                        data={models}
                        loading={modelsLoading}
                        meta={{ currency, exchangeRates }}
                    />
                </div>
                <section className="pb-12">
                    <FAQSection items={faqs} />
                </section>
            </div>
        </div>
    );

    if (user) {
        return PricingContent;
    }

    return (
        <div className="relative min-h-screen w-screen overflow-x-hidden">
            {/* Main Content */}
            <div className="relative z-10 rounded-b-4xl pointer-events-none">
                <div className="pointer-events-auto bg-card rounded-b-4xl pb-10">
                    {PricingContent}
                </div>
                <AboutSpacer onVisible={setShowFooterGlow} />
            </div>

            {/* Footer (behind) */}
            <div className="fixed bottom-0 left-0 w-full z-0">
                <Footer animateGlow={showFooterGlow} />
            </div>
        </div>
    );
};

export default PricingPage;
