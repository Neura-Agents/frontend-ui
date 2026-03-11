import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Alert, Notification } from '../components/ui/Alert';
import { Typography } from '../components/ui/Typography';

const UIComponents: React.FC = () => {
    const [inputValue, setInputValue] = useState('');

    const colors = {
        'Background': { class: 'bg-background', hex: '#141414' },
        'Card': { class: 'bg-card', hex: '#181818' },
        'Accent': { class: 'bg-accent', hex: '#60A5FA' },
        'Accent Soft': { class: 'bg-accent-soft', hex: '#93C5FD' },
        'Success': { class: 'bg-success', hex: '#10B981' },
        'Success Soft': { class: 'bg-success-soft', hex: '#34D399' },
        'Warning': { class: 'bg-warning', hex: '#F59E0B' },
        'Warning Soft': { class: 'bg-warning-soft', hex: '#FBBF24' },
        'White': { class: 'bg-white', hex: '#FFFFFF' },
        'White/10': { class: 'bg-white/10', hex: 'rgba(255,255,255,0.1)' },
        'White/5': { class: 'bg-white/5', hex: 'rgba(255,255,255,0.05)' },
        'Gray 400': { class: 'bg-gray-400', hex: '#9CA3AF' },
        'Gray 500': { class: 'bg-gray-500', hex: '#6B7280' },
        'Red 500': { class: 'bg-red-500', hex: '#EF4444' },
    };

    const radii = [
        { name: 'rounded-sm', value: '4px' },
        { name: 'rounded', value: '6px' },
        { name: 'rounded-md', value: '8px' },
        { name: 'rounded-lg', value: '12px' },
        { name: 'rounded-xl', value: '16px' },
        { name: 'rounded-2xl', value: '20px' },
        { name: 'rounded-full', value: '9999px' },
    ];

    return (
        <div className="min-h-screen bg-background text-white p-8 md:p-12 space-y-16">

            {/* Page Header */}
            <header>
                <h1 className="text-4xl font-bold tracking-tight font-season-mix mb-2">UI Component Reference</h1>
                <p className="text-gray-400 text-lg">Design system tokens, components, and patterns.</p>
            </header>

            {/* ─── COLORS ─── */}
            <section>
                <h2 className="text-2xl font-bold mb-2 font-season-mix">Color Palette</h2>
                <p className="text-gray-500 text-sm mb-6">All theme colors defined in <code className="text-accent bg-white/5 px-1.5 py-0.5 rounded text-xs">tailwind.config.js</code></p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {Object.entries(colors).map(([name, { class: cls, hex }]) => (
                        <div key={name} className="space-y-2">
                            <div className={`${cls} w-full h-20 rounded-lg border border-white/10`} />
                            <p className="text-sm font-semibold">{name}</p>
                            <p className="text-xs text-gray-500 font-mono">{hex}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── BORDER RADIUS ─── */}
            <section>
                <h2 className="text-2xl font-bold mb-2 font-season-mix">Border Radius</h2>
                <p className="text-gray-500 text-sm mb-6">Custom radius tokens from the theme config.</p>
                <div className="flex flex-wrap gap-6 items-end">
                    {radii.map(({ name, value }) => (
                        <div key={name} className="flex flex-col items-center gap-2">
                            <div className={`w-16 h-16 bg-accent/20 border-2 border-accent ${name}`} />
                            <span className="text-xs font-mono text-gray-400">{name}</span>
                            <span className="text-[10px] text-gray-600">{value}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── TYPOGRAPHY ─── */}
            <section>
                <h2 className="text-2xl font-bold mb-2 font-season-mix">Typography</h2>
                <p className="text-gray-500 text-sm mb-6">Font families and text scale via the <code className="text-accent bg-white/5 px-1.5 py-0.5 rounded text-xs">Typography</code> component.</p>
                <div className="space-y-6 border border-white/10 rounded-lg p-6 bg-card">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">font-matter (Default / Sans)</p>
                        <Typography font="matter" scale="2xl">The quick brown fox jumps over the lazy dog.</Typography>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">font-season</p>
                        <Typography font="season" scale="2xl">The quick brown fox jumps over the lazy dog.</Typography>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">font-season-mix</p>
                        <Typography font="season-mix" scale="2xl">The quick brown fox jumps over the lazy dog.</Typography>
                    </div>
                    <hr className="border-white/5" />
                    <div className="space-y-3">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Scale (font-matter)</p>
                        <Typography as="h1" scale="5xl" weight="bold" className="tracking-tight">Heading 1 — scale="5xl"</Typography>
                        <Typography as="h2" scale="4xl" weight="bold" className="tracking-tight">Heading 2 — scale="4xl"</Typography>
                        <Typography as="h3" scale="3xl" weight="semibold">Heading 3 — scale="3xl"</Typography>
                        <Typography as="h4" scale="2xl" weight="semibold">Heading 4 — scale="2xl"</Typography>
                        <Typography scale="xl">Heading 5 — scale="xl"</Typography>
                        <Typography scale="lg">Body Large — scale="lg"</Typography>
                        <Typography scale="base">Body — scale="base"</Typography>
                        <Typography scale="sm" className="text-gray-400">Small — scale="sm"</Typography>
                        <Typography scale="xs" className="text-gray-500">Caption — scale="xs"</Typography>
                    </div>
                </div>
            </section>

            {/* ─── BUTTONS ─── */}
            <section>
                <h2 className="text-2xl font-bold mb-2 font-season-mix">Buttons</h2>
                <p className="text-gray-500 text-sm mb-6">All variants, sizes, and border radii for the <code className="text-accent bg-white/5 px-1.5 py-0.5 rounded text-xs">Button</code> component.</p>

                <div className="space-y-8 border border-white/10 rounded-lg p-6 bg-card">
                    {/* Variants */}
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Variants</p>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="danger">Danger</Button>
                            <Button variant="accent">Accent</Button>
                        </div>
                    </div>

                    {/* Radius Options */}
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Border Radius (rounded prop)</p>
                        <div className="flex flex-wrap gap-3">
                            <Button rounded="none">rounded="none"</Button>
                            <Button rounded="sm">rounded="sm"</Button>
                            <Button rounded="DEFAULT">rounded="DEFAULT"</Button>
                            <Button rounded="md">rounded="md"</Button>
                            <Button rounded="lg">rounded="lg"</Button>
                            <Button rounded="xl">rounded="xl"</Button>
                            <Button rounded="2xl">rounded="2xl"</Button>
                            <Button rounded="full">rounded="full"</Button>
                        </div>
                    </div>

                    {/* Sizes */}
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Sizes</p>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="lg">Large</Button>
                        </div>
                    </div>

                    {/* States */}
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">States</p>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="primary">Default</Button>
                            <Button variant="primary" disabled>Disabled</Button>
                            <Button variant="primary" fullWidth>Full Width</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── INPUTS ─── */}
            <section>
                <h2 className="text-2xl font-bold mb-2 font-season-mix">Inputs</h2>
                <p className="text-gray-500 text-sm mb-6">Text input fields with labels, errors, and states.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-white/10 rounded-lg p-6 bg-card">
                    <Input
                        label="Default Input"
                        placeholder="Type something…"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Input
                        label="With Value"
                        value="john@example.com"
                        readOnly
                    />
                    <Input
                        label="Required Field"
                        placeholder="Must fill this..."
                        required
                    />
                    <Input
                        label="Error State"
                        value="bad-email"
                        error="Invalid email address"
                    />
                    <Input
                        label="Disabled Input"
                        value="Readonly content"
                        disabled
                        className="opacity-50 cursor-not-allowed"
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                    />
                    <Input
                        label="With Placeholder"
                        placeholder="Search for something…"
                    />
                </div>
            </section>

            {/* ─── BADGES ─── */}
            <section>
                <h2 className="text-2xl font-bold mb-2 font-season-mix">Badges</h2>
                <p className="text-gray-500 text-sm mb-6">Status and category indicators.</p>

                <div className="space-y-6 border border-white/10 rounded-lg p-6 bg-card">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Variants</p>
                        <div className="flex flex-wrap gap-3">
                            <Badge variant="default">Default</Badge>
                            <Badge variant="outline">Outline</Badge>
                            <Badge variant="accent">Accent</Badge>
                            <Badge variant="alt">Alt</Badge>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">With Pulse</p>
                        <div className="flex flex-wrap gap-3">
                            <Badge variant="accent" pulse>Live</Badge>
                            <Badge variant="alt" pulse>Streaming</Badge>
                            <Badge variant="default" pulse>Online</Badge>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── ALERTS ─── */}
            <section>
                <h2 className="text-2xl font-bold mb-2 font-season-mix">Alerts & Notifications</h2>
                <p className="text-gray-500 text-sm mb-6">Feedback and status indicators for user actions.</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border border-white/10 rounded-lg p-6 bg-card">
                    {/* Alerts */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Standard (Bordered)</p>
                            <Alert
                                variant="success"
                                title="Deployment Successful"
                                onClose={() => { }}
                            >
                                Your agent has been successfully deployed.
                            </Alert>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Soft (Borderless)</p>
                            <div className="space-y-4">
                                <Alert
                                    variant="warning"
                                    isBorderless
                                    title="Storage almost full"
                                >
                                    You have used 90% of your available storage.
                                </Alert>
                                <Alert
                                    variant="error"
                                    isBorderless
                                    title="Connection Failed"
                                    onClose={() => { }}
                                >
                                    Could not establish a connection.
                                </Alert>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Standard Notifications</p>
                            <Notification
                                variant="success"
                                title="Message Sent"
                                onClose={() => { }}
                            >
                                Your message has been sent.
                            </Notification>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Soft Notifications (Borderless)</p>
                            <Notification
                                variant="info"
                                isBorderless
                                title="New Comment"
                                onClose={() => { }}
                            >
                                Sarah left a comment on your recent task.
                            </Notification>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CARDS ─── */}
            <section>
                <h2 className="text-2xl font-bold mb-2 font-season-mix">Cards</h2>
                <p className="text-gray-500 text-sm mb-6">Container component with border, shadow, and custom radius options.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card rounded="sm">
                        <h3 className="text-sm font-bold mb-1">rounded="sm"</h3>
                        <p className="text-gray-500 text-xs text-balance">Tight corners for a technical look.</p>
                    </Card>
                    <Card rounded="md">
                        <h3 className="text-sm font-bold mb-1">rounded="md"</h3>
                        <p className="text-gray-500 text-xs text-balance">Balanced medium corners.</p>
                    </Card>
                    <Card rounded="xl">
                        <h3 className="text-sm font-bold mb-1">rounded="xl" (Default)</h3>
                        <p className="text-gray-500 text-xs text-balance">Soft, modern feel.</p>
                    </Card>
                    <Card rounded="2xl" variant="shadow">
                        <h3 className="text-sm font-bold mb-1">rounded="2xl"</h3>
                        <p className="text-gray-500 text-xs text-balance">Very rounded, friendly appearance.</p>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <h3 className="text-lg font-bold mb-2">Default Card</h3>
                        <p className="text-gray-400 text-sm">Standard border and background.</p>
                    </Card>
                    <Card variant="shadow">
                        <h3 className="text-lg font-bold mb-2">Shadow Card</h3>
                        <p className="text-gray-400 text-sm">No border, heavy backdrop shadow.</p>
                    </Card>
                    <Card variant="borderless">
                        <h3 className="text-lg font-bold mb-2">Borderless</h3>
                        <p className="text-gray-400 text-sm">No border, subtle elevation shadow.</p>
                    </Card>
                    <Card glow>
                        <h3 className="text-lg font-bold mb-2">Glow Card</h3>
                        <p className="text-gray-400 text-sm">Hover for active accent pulse.</p>
                    </Card>
                </div>
            </section>

            {/* ─── SPACING & UTILITIES ─── */}
            <section>
                <h2 className="text-2xl font-bold mb-2 font-season-mix">Spacing Scale</h2>
                <p className="text-gray-500 text-sm mb-6">Visual reference for padding and margin increments.</p>
                <div className="flex flex-wrap items-end gap-2">
                    {[1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24].map((size) => (
                        <div key={size} className="flex flex-col items-center gap-1">
                            <div
                                className="bg-accent/30 border border-accent/50"
                                style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
                            />
                            <span className="text-[10px] text-gray-500 font-mono">{size}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── OPACITY & OVERLAYS ─── */}
            <section>
                <h2 className="text-2xl font-bold mb-2 font-season-mix">White Opacity Scale</h2>
                <p className="text-gray-500 text-sm mb-6">Used for borders, backgrounds, and overlays.</p>
                <div className="flex gap-3">
                    {[5, 10, 20, 30, 40, 50, 60, 80, 100].map((opacity) => (
                        <div key={opacity} className="flex flex-col items-center gap-2">
                            <div
                                className="w-12 h-12 rounded-lg border border-white/10"
                                style={{ backgroundColor: `rgba(255,255,255,${opacity / 100})` }}
                            />
                            <span className="text-[10px] text-gray-500 font-mono">white/{opacity}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── COMPOSED EXAMPLES ─── */}
            <section>
                <h2 className="text-2xl font-bold mb-2 font-season-mix">Composed Examples</h2>
                <p className="text-gray-500 text-sm mb-6">Layout patterns using combined components.</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Example 1: Standard */}
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold">Create Agent</h3>
                            <Badge variant="accent" pulse>Draft</Badge>
                        </div>
                        <div className="space-y-4">
                            <Input label="Agent Name" placeholder="My Agent" />
                            <Input label="Description" placeholder="What does this agent do?" />
                            <div className="flex gap-3 pt-2">
                                <Button variant="primary" className="flex-1">Create</Button>
                                <Button variant="secondary">Cancel</Button>
                            </div>
                        </div>
                    </Card>

                    {/* Example 2: Shadow/Borderless variant */}
                    <Card variant="shadow">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-xl font-bold">
                                A
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Account Overview</h3>
                                <p className="text-sm text-gray-400">Manage your subscription and usage.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Current Plan</p>
                                    <p className="font-semibold italic">Pro Evolution</p>
                                </div>
                                <Badge variant="alt">Active</Badge>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="accent" size="sm" className="flex-1">Upgrade Plan</Button>
                                <Button variant="ghost" size="sm">Manage</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

        </div>
    );
};

export default UIComponents;
