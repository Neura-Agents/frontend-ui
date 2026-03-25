import React, { useEffect, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Refresh01Icon,
    DashboardSquare01Icon,
    Download01Icon,
    CheckmarkCircle01Icon
} from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/context/ThemeContext';
import { CodeBlock } from '@/components/ui/code-block';
import { themes } from '@/theme/themes';
import { cn } from '@/lib/utils';

export interface ThemeVariable {
    label: string;
    variable: string;
    darkDefault: string;
    lightDefault: string;
    category: 'Core' | 'Interface' | 'Feedback' | 'Navigation' | 'Brand';
    type?: 'color' | 'url';
}

export const themeVariables: ThemeVariable[] = [
    // Core
    { label: 'Background', variable: '--background', darkDefault: '#141414', lightDefault: '#f5f5f5', category: 'Core' },
    { label: 'Foreground', variable: '--foreground', darkDefault: '#fafafa', lightDefault: '#161616', category: 'Core' },
    { label: 'Card', variable: '--card', darkDefault: '#1c1c1c', lightDefault: '#ffffff', category: 'Interface' },
    { label: 'Primary', variable: '--primary', darkDefault: '#5f9fff', lightDefault: '#347ce9', category: 'Core' },
    { label: 'Primary Foreground', variable: '--primary-foreground', darkDefault: '#5f9fff', lightDefault: '#fcfcfc', category: 'Core' },
    { label: 'Secondary', variable: '--secondary', darkDefault: '#262626', lightDefault: '#efefef', category: 'Core' },

    // Interface
    { label: 'Muted Foreground', darkDefault: '#a1a1a1', lightDefault: '#636363', variable: '--muted-foreground', category: 'Interface' },

    // Feedback
    { label: 'Success', variable: '--success', darkDefault: '#05b686', lightDefault: '#26984d', category: 'Feedback' },
    { label: 'Warning', variable: '--warning', darkDefault: '#f49500', lightDefault: '#d98b08', category: 'Feedback' },
    { label: 'Destructive', variable: '--destructive', darkDefault: '#ff6367', lightDefault: '#d74746', category: 'Feedback' },

    // Navigation/Borders
    { label: 'Border', variable: '--border', darkDefault: '#262626', lightDefault: '#e5e5e5', category: 'Navigation' },
    { label: 'Input', variable: '--input', darkDefault: '#262626', lightDefault: '#e5e5e5', category: 'Navigation' },

    // Brand
    {
        label: 'Logo URL',
        variable: '--logo-url',
        darkDefault: '/src/assets/images/LogoAI-dark.svg',
        lightDefault: '/src/assets/images/LogoAI-light.svg',
        category: 'Brand',
        type: 'url'
    },
];

const ThemeSettingsPage: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [colors, setColors] = useState<Record<string, string>>({});

    // Determine effective mode for defaults
    const isDark = theme === 'dark';

    const [themeName, setThemeName] = useState(isDark ? 'dark' : 'light');

    useEffect(() => {
        const root = document.documentElement;
        const initialColors: Record<string, string> = {};

        themeVariables.forEach(tv => {
            let val = getComputedStyle(root).getPropertyValue(tv.variable).trim();

            if (tv.type === 'url' && val.startsWith('url(')) {
                // Extract URL from url("...") or url(...)
                val = val.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
            }

            // Fallback to defaults if computed value is complex or empty
            const defaultValue = isDark ? tv.darkDefault : tv.lightDefault;
            if (tv.type === 'url') {
                initialColors[tv.variable] = val || defaultValue;
            } else {
                initialColors[tv.variable] = val.startsWith('#') || val.startsWith('oklch') ? val : defaultValue;
            }
        });

        setColors(initialColors);
        setThemeName(isDark ? 'dark' : 'light');
    }, [isDark]);

    const updateColor = (variable: string, value: string) => {
        setColors(prev => ({ ...prev, [variable]: value }));
        const cssValue = variable === '--logo-url' ? `url('${value}')` : value;
        document.documentElement.style.setProperty(variable, cssValue);
    };

    const resetTheme = () => {
        const reset: Record<string, string> = {};
        themeVariables.forEach(tv => {
            const val = isDark ? tv.darkDefault : tv.lightDefault;
            reset[tv.variable] = val;
            const cssValue = tv.variable === '--logo-url' ? `url('${val}')` : val;
            document.documentElement.style.setProperty(tv.variable, cssValue);
        });
        setColors(reset);
    };

    const generateCSS = () => {
        const selector = themeName ? `.${themeName.trim().replace(/\s+/g, '-')}` : (isDark ? '.dark' : '.light');
        const v = (variable: string) => colors[variable] || 'inherit';

        const lines = [
            `  --background: ${v('--background')};`,
            `  --foreground: ${v('--foreground')};`,
            `  --card: ${v('--card')};`,
            `  --popover: var(--card);`,
            `  --primary: ${v('--primary')};`,
            `  --primary-foreground: ${v('--primary-foreground')};`,
            `  --secondary: ${v('--secondary')};`,
            `  --secondary-foreground: var(--foreground);`,
            `  --muted: var(--secondary);`,
            `  --muted-foreground: ${v('--muted-foreground')};`,
            `  --accent: var(--secondary);`,
            `  --destructive: ${v('--destructive')};`,
            `  --destructive-foreground: ${isDark ? v('--foreground') : 'oklch(0.99 0 0)'};`,
            `  --border: ${v('--border')};`,
            `  --input: ${v('--input')};`,
            `  --ring: var(--primary);`,
            `  --success: ${v('--success')};`,
            `  --warning: ${v('--warning')};`,
            `  --logo-url: url('${v('--logo-url')}');`,
            `  --header-bg: var(--background);`,
            `  --header-glass-border: var(--border);`
        ];

        return `${selector} {\n${lines.join('\n')}\n}`;
    };

    const handleExport = () => {
        const cssContent = generateCSS();
        const blob = new Blob([cssContent], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `theme-${themeName || (isDark ? 'dark' : 'light')}.css`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const categories = ['Core', 'Interface', 'Feedback', 'Navigation', 'Brand'] as const;

    return (
        <div className="container mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12 pb-20 pt-10 px-4 md:px-6">
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Typography variant="page-header" className="flex items-center gap-3">
                        Theme Settings
                    </Typography>
                    <Typography variant="page-description">
                        Customize your workspace aesthetics. Select a preset or create your own custom look.
                    </Typography>
                </div>
                <div className="flex flex-col gap-2 min-w-[200px]">
                    <Label htmlFor="theme-name" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Custom Class Name</Label>
                    <Input
                        id="theme-name"
                        value={themeName}
                        onChange={(e) => setThemeName(e.target.value)}
                        placeholder="e.g. custom-dark"
                        className="bg-secondary/20 border-border/40 rounded-xl"
                    />
                </div>
                <div className="flex items-center gap-3 self-end">
                    <Button variant="outline" onClick={resetTheme} className="gap-2 rounded-full border-border hover:bg-secondary transition-all">
                        <HugeiconsIcon icon={Refresh01Icon} className="size-4" />
                        Reset All
                    </Button>
                    <Button variant="default" onClick={handleExport} className="gap-2 rounded-full px-6 transition-all">
                        <HugeiconsIcon icon={Download01Icon} className="size-4" />
                        Export CSS
                    </Button>
                </div>
            </section>

            {/* ─── THEME PRESETS ─── */}
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <Badge variant="soft" className="px-2 py-0.5">Presets</Badge>
                    <Typography scale="xl" weight="bold" className="font-matter">Available Themes</Typography>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {themes.map((t) => (
                        <Card
                            key={t.id}
                            className={cn(
                                "cursor-pointer border-border/40 hover:border-primary/40 transition-all group relative overflow-hidden",
                                theme === t.id && "border-primary bg-primary/5 shadow-md"
                            )}
                            onClick={() => setTheme(t.id)}
                        >
                            <CardContent className="p-4 flex flex-col justify-center gap-1">
                                <div className="flex items-center justify-between">
                                    <Typography weight="bold" className={cn(
                                        "text-sm transition-colors",
                                        theme === t.id ? "text-primary" : "text-foreground"
                                    )}>
                                        {t.name}
                                    </Typography>
                                    {theme === t.id && (
                                        <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4 text-primary" />
                                    )}
                                </div>
                                {t.description && (
                                    <Typography scale='xs' className='text-muted-foreground leading-tight opacity-70'>
                                        {t.description}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ─── COLOR GROUPS ─── */}
                <div className="lg:col-span-2 space-y-8">
                    {categories.map(category => (
                        <Card key={category} className="border-border/40 bg-card/20 backdrop-blur-sm overflow-hidden rounded-2xl">
                            <CardHeader className="border-b border-border/10 pb-4">
                                <div className="flex items-center gap-2">
                                    <Badge variant="soft" className="px-2 py-0.5">{category}</Badge>
                                    <CardTitle className="text-lg font-matter">{category} Palette</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {themeVariables
                                    .filter(tv => tv.category === category)
                                    .map(tv => (
                                        <div key={tv.variable} className="flex flex-col gap-3 p-4 rounded-xl hover:bg-white/2 transition-colors border border-transparent hover:border-border/20 group">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor={tv.variable} className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors cursor-pointer">
                                                    {tv.label}
                                                </Label>
                                                <span className="text-[10px] font-mono text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
                                                    {tv.variable.replace('--', '')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {tv.type === 'url' ? (
                                                    <div className="flex flex-col gap-3 w-full">
                                                        <Input
                                                            value={colors[tv.variable] || (isDark ? tv.darkDefault : tv.lightDefault)}
                                                            onChange={(e) => updateColor(tv.variable, e.target.value)}
                                                            className="bg-secondary/20 border-border/40 rounded-xl h-10 text-xs font-mono"
                                                            placeholder="Enter image URL..."
                                                        />
                                                        <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-xl border border-border/20">
                                                            <div
                                                                className="size-10 bg-contain bg-no-repeat bg-center rounded-lg border border-border/40 bg-white/5"
                                                                style={{ backgroundImage: `url('${colors[tv.variable] || (isDark ? tv.darkDefault : tv.lightDefault)}')` }}
                                                            />
                                                            <div className="flex flex-col gap-0.5">
                                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Logo Preview</p>
                                                                <p className="text-[9px] text-muted-foreground/60 italic leading-tight">Displayed in header & sidebar</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="relative size-12 rounded-xl overflow-hidden border border-border shadow-lg ring-offset-2 ring-primary/20 group-hover:ring-2 transition-all">
                                                            <input
                                                                id={tv.variable}
                                                                type="color"
                                                                className="absolute inset-x-[-50%] inset-y-[-50%] size-[200%] cursor-pointer bg-transparent border-0"
                                                                onChange={(e) => updateColor(tv.variable, e.target.value)}
                                                                value={colors[tv.variable]?.startsWith('#') ? colors[tv.variable] : (isDark ? tv.darkDefault : tv.lightDefault)}
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-mono text-muted-foreground truncate" title={colors[tv.variable]}>
                                                                {colors[tv.variable]}
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground/60 italic">
                                                                {colors[tv.variable]?.startsWith('#') ? 'Click icon to change' : 'Variable-based color'}
                                                            </p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* ─── LIVE PREVIEW ─── */}
                <div className="space-y-8">
                    <Card className="border-border bg-card/40 backdrop-blur-xl sticky top-8 rounded-2xl overflow-hidden shadow-2xl">
                        <CardHeader className="p-6 border-b border-border/10">
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <HugeiconsIcon icon={DashboardSquare01Icon} className="size-5" />
                                Live Theme CSS
                            </CardTitle>
                            <CardDescription className="text-xs leading-relaxed flex flex-col gap-1.5">
                                <span>Real-time CSS mirroring your selections. Scope these variables using the <span className="text-primary font-mono font-bold">.{themeName}</span> class.</span>
                                <span className="text-muted-foreground/60 italic opacity-80 border-l-2 border-primary/30 pl-2">
                                    Note: You can use any of the preset classes (light, dark, cyberpunk, ocean, nature, mycustomtheme) directly.
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CodeBlock
                                maxHeight="600px"
                                className="border-0 rounded-none bg-transparent"
                            >
                                {generateCSS()}
                            </CodeBlock>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ThemeSettingsPage;
