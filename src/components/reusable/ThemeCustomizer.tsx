import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { HugeiconsIcon } from '@hugeicons/react';
import { PaintBoardIcon, Refresh01Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";

interface ThemeVariable {
    label: string;
    variable: string;
    defaultValue: string;
}

const themeVariables: ThemeVariable[] = [
    { label: 'Primary Color', variable: '--primary', defaultValue: 'oklch(0.708 0.165 259.025)' },
    { label: 'Background', variable: '--background', defaultValue: 'oklch(0.19 0 0)' },
    { label: 'Foreground', variable: '--foreground', defaultValue: 'oklch(0.985 0 0)' },
    { label: 'Card Background', variable: '--card', defaultValue: 'oklch(0.21 0 0)' },
    { label: 'Accent', variable: '--accent', defaultValue: 'oklch(0.269 0 0)' },
    { label: 'Border', variable: '--border', defaultValue: 'oklch(1 0 0 / 10%)' },
];

interface ThemeCustomizerProps {
    children?: React.ReactNode;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ children }) => {
    const [colors, setColors] = useState<Record<string, string>>({});
    const [isOpen, setIsOpen] = useState(false);

    // Load current colors from CSS variables on Mount
    useEffect(() => {
        const root = document.documentElement;
        const initialColors: Record<string, string> = {};

        themeVariables.forEach(tv => {
            const val = getComputedStyle(root).getPropertyValue(tv.variable).trim();
            initialColors[tv.variable] = val || tv.defaultValue;
        });

        setColors(initialColors);
    }, []);

    const updateColor = (variable: string, value: string) => {
        setColors(prev => ({ ...prev, [variable]: value }));
        document.documentElement.style.setProperty(variable, value);
    };

    const resetTheme = () => {
        const root = document.documentElement;
        themeVariables.forEach(tv => {
            root.style.removeProperty(tv.variable);
        });

        // Refresh local state
        const refreshedColors: Record<string, string> = {};
        themeVariables.forEach(tv => {
            const val = getComputedStyle(root).getPropertyValue(tv.variable).trim();
            refreshedColors[tv.variable] = val || tv.defaultValue;
        });
        setColors(refreshedColors);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button variant="outline" size="sm" className="gap-2 rounded-full border-primary/20 hover:border-primary/50 transition-all duration-300">
                        <HugeiconsIcon icon={PaintBoardIcon} className="size-4 text-primary" />
                        <span>Customize Theme</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-primary/10">
                            <HugeiconsIcon icon={PaintBoardIcon} className="size-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Theme Customizer</DialogTitle>
                            <DialogDescription>
                                Adjust your workspace colors in real-time.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid gap-6 py-6">
                    {themeVariables.map((tv) => (
                        <div key={tv.variable} className="flex items-center justify-between group">
                            <Label htmlFor={tv.variable} className="text-sm font-medium flex-1 group-hover:text-primary transition-colors">
                                {tv.label}
                            </Label>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                    {tv.variable}
                                </span>
                                <div className="relative size-10 rounded-lg overflow-hidden border border-border shadow-inner group-hover:scale-110 transition-transform">
                                    <input
                                        id={tv.variable}
                                        type="color"
                                        className="absolute inset-x-[-50%] inset-y-[-50%] size-[200%] cursor-pointer bg-transparent"
                                        onChange={(e) => updateColor(tv.variable, e.target.value)}
                                        value={colors[tv.variable]?.startsWith('#') ? colors[tv.variable] : '#4f46e5'}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetTheme}
                            className="text-muted-foreground hover:text-destructive gap-2"
                        >
                            <HugeiconsIcon icon={Refresh01Icon} className="size-4" />
                            Reset to Default
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="gap-2 px-6"
                        >
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                            Done
                        </Button>
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground">
                        Changes are applied instantly to the entire application.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};
