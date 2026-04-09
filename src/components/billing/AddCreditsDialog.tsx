import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Minus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { GiftIcon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface AddCreditsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { credits?: number, amount?: number }) => void;
    isLoading: boolean;
    defaultAmount?: number;
    defaultMode?: 'credits' | 'inr';
    exchangeRate?: number;
}

const AddCreditsDialog: React.FC<AddCreditsDialogProps> = ({
    isOpen,
    onClose,
    onAdd,
    isLoading,
    defaultAmount = 100,
    defaultMode = 'credits',
    exchangeRate = 83.50 // Fallback
}) => {
    const [amount, setAmount] = useState<number>(defaultAmount); // This will hold the primary value based on mode
    const [mode, setMode] = useState<'credits' | 'inr'>(defaultMode);
    const MAX_CREDITS_PER_TXN = 100000;

    // Reset internal state when dialog opens with new defaults
    React.useEffect(() => {
        if (isOpen) {
            setAmount(defaultAmount);
            setMode(defaultMode);
        }
    }, [isOpen, defaultAmount, defaultMode]);

    // The 'credits' value we always need for the 'onAdd' callback
    const baseCredits = mode === 'credits' ? amount : amount / exchangeRate;
    const totalInr = mode === 'inr' ? amount : amount * exchangeRate;

    const getFixedBonus = (usd: number) => {
        if (usd >= 500) return { amount: 75, tier: 'BUSINESS' };
        if (usd >= 100) return { amount: 10, tier: 'PRO' };
        return { amount: 0, tier: null };
    };

    const bonus = getFixedBonus(baseCredits);
    const finalCredits = baseCredits + bonus.amount;

    const isOverLimit = baseCredits > MAX_CREDITS_PER_TXN;

    const handleIncrement = () => {
        const increment = (mode === 'credits' ? 50 : 500);
        setAmount(prev => prev + increment);
    };

    const handleDecrement = () => {
        const decrement = (mode === 'credits' ? 50 : 500);
        setAmount(prev => Math.max(1, prev - decrement));
    };

    const handleAddPreset = (value: number) => {
        if (mode === 'credits') {
            setAmount(prev => prev + value);
        } else {
            setAmount(prev => prev + (value * exchangeRate));
        }
    };

    const toggleMode = () => {
        if (mode === 'credits') {
            setAmount(totalInr);
            setMode('inr');
        } else {
            setAmount(baseCredits);
            setMode('credits');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Add Credits</DialogTitle>
                    <DialogDescription>
                        {mode === 'credits' ? 'How many credits you want to add?' : 'How much would you like to pay?'}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center py-6 space-y-4">
                    <div className="flex items-center w-fit">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all active:scale-90"
                            onClick={handleDecrement}
                            disabled={amount <= 1}
                        >
                            <Minus className="h-6 w-6" strokeWidth={2} />
                        </Button>

                        <div className="flex flex-col items-center max-w-[200px] relative">
                            <div className={cn("flex items-center gap-1 transition-all", mode === 'inr' ? 'translate-x-0' : '')}>
                                {mode === 'inr' && <span className={`text-[36px] font-season-mix ${isOverLimit ? 'text-destructive' : ''}`}>₹</span>}
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                                    className={cn(
                                        "w-full bg-transparent text-center text-[36px] font-season-mix transition-colors focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                        isOverLimit ? "text-destructive" : "text-foreground"
                                    )}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all active:scale-90"
                            onClick={handleIncrement}
                        >
                            <Plus className="h-6 w-6" strokeWidth={2} />
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        {[100, 500, 1000].map(val => (
                            <Button
                                key={val}
                                variant="outline"
                                className="rounded-full border-border/60 font-medium px-4 h-9 hover:bg-secondary transition-all active:scale-95"
                                onClick={() => handleAddPreset(val)}
                            >
                                +{val.toLocaleString()}
                            </Button>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleMode}
                        className="rounded-full"
                    >
                        <RefreshCw className="h-3 w-3" />
                        Switch to {mode === 'credits' ? 'Currency' : 'Credits'}
                    </Button>

                    <div className="text-center space-y-3 w-full max-w-[320px]">
                        {mode === 'credits' ? (
                            <p className="text-[12px] text-muted-foreground font-medium flex items-center justify-center gap-1">
                                You Pay Approx. <span className="text-foreground font-bold">₹{(baseCredits * exchangeRate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <button className="inline-flex items-center text-muted-foreground/60 hover:text-foreground transition-colors focus:outline-none">
                                            <HugeiconsIcon icon={InformationCircleIcon} size={14} />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[200px] text-xs" side="top">
                                        Amount is calculated using live conversion rates.
                                    </TooltipContent>
                                </Tooltip>
                            </p>
                        ) : null}

                        <div className="flex flex-col items-center gap-1 w-full rounded-2xl py-3 px-4 transition-all">
                            <div className="flex justify-between w-full text-[11px] text-muted-foreground px-1">
                                <span>Base Credits</span>
                                <span className="font-bold text-foreground">{baseCredits.toFixed(2)}</span>
                            </div>

                            {bonus.amount > 0 && (
                                <div className="flex justify-between w-full text-[11px] text-success px-1 font-bold animate-in slide-in-from-left-2 duration-300">
                                    <span className="flex items-center gap-1">
                                        <HugeiconsIcon icon={GiftIcon} size={10} />
                                        {bonus.tier} Bonus
                                    </span>
                                    <span>+{bonus.amount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="h-px w-full bg-border my-1.5" />

                            <div className="flex justify-between w-full text-sm font-bold px-1 items-baseline">
                                <span className="text-muted-foreground text-[12px]">Total Added</span>
                                <span className="text-primary text-[12px] tracking-tight">
                                    {finalCredits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        {bonus.tier && (
                            <div className="animate-in zoom-in-95 duration-300 pt-1">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold tracking-wider",
                                    bonus.tier === 'BUSINESS' ? "bg-primary text-primary-foreground" : "bg-success/10 text-success border border-success/20"
                                )}>
                                    {bonus.tier} TIER REACHED
                                </span>
                            </div>
                        )}
                    </div>
                    {isOverLimit && (
                        <div className="text-destructive text-sm font-medium animate-in slide-in-from-top-2 duration-300">
                            A single top-up cannot exceed {MAX_CREDITS_PER_TXN.toLocaleString()} credits.
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-2">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="rounded-full px-6"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => onAdd(mode === 'credits' ? { credits: amount } : { amount: amount })}
                        disabled={isLoading || amount <= 0 || isOverLimit}
                        className="rounded-full px-6"
                    >
                        {isLoading ? 'Processing...' : 'Next'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddCreditsDialog;
