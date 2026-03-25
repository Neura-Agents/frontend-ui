import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription, AlertAction } from '@/components/ui/alert';
import { Typography } from '@/components/ui/typography';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Cancel01Icon,
    Notification03Icon,
    Settings01Icon,
    PlusSignIcon,
    UserCircle02Icon,
    FilterIcon,
    Search01Icon,
    Mail01Icon,
    InformationCircleIcon,
    Alert01Icon
} from '@hugeicons/core-free-icons';
import { InputField } from '@/components/ui/input-field';
import Pagination from '@/components/ui/pagination';
import IconGallery from '../components/reusable/IconGallery';
import FilterChips from '@/components/ui/filter-chips';
import * as AllIcons from '@hugeicons/core-free-icons';
import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from '@/components/ui/avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { PromptInput } from '@/components/reusable/prompt-input';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from '@/components/ui/command';
import { CodeBlock } from '@/components/ui/code-block';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { themeVariables } from './ThemeSettingsPage';
import { useTheme } from '@/context/ThemeContext';

const UIComponents: React.FC = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedIconName, setSelectedIconName] = useState<string | undefined>(undefined);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [commandOpen, setCommandOpen] = useState(false);
    const [promptValue, setPromptValue] = useState('');

    const categoryChips = ['All', 'Category 1', 'Category 2', 'Category 3'];

    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-24 pt-32 md:pt-0">
            {/* ─── HERO / PREVIEW ─── */}
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <Typography variant="page-header">
                    Design System
                </Typography>
                <Typography variant="page-description">
                    A premium React component library built on top of shadcn/ui,
                    refined for the <span className="text-primary font-medium">Soft Dark</span> aesthetic.
                </Typography>
            </section>

            {/* ─── COLOR PALETTE ─── */}
            <section tabIndex={0} className="px-2">
                <Typography as="h2" scale="2xl" font="season-mix" weight="bold" className="mb-6 border-b border-border pb-4">Color Palette</Typography>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {themeVariables.map((tv) => (
                        <div key={tv.variable} className="space-y-3 group">
                            <div 
                                className="w-full h-24 rounded-xl border border-border group-hover:scale-[1.02] transition-transform duration-300 shadow-sm"
                                style={{ backgroundColor: `var(${tv.variable})` }}
                            />
                            <div>
                                <p className="text-sm font-semibold text-foreground">{tv.label}</p>
                                <p className="text-[10px] text-muted-foreground font-mono uppercase">
                                    {isDark ? tv.darkDefault : tv.lightDefault}
                                </p>
                                <p className="text-[9px] text-primary/60 font-mono mt-1">
                                    {tv.variable}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── TYPOGRAPHY ─── */}
            <section tabIndex={0} className="px-2">
                <Typography as="h2" scale="2xl" font="season-mix" weight="bold" className="mb-6 border-b border-border pb-4">Typography</Typography>
                <Card className="space-y-12 border border-border/50 rounded-2xl p-10 bg-card/30 backdrop-blur-sm">
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-4 font-bold">font-matter (Default)</p>
                                <Typography font="matter" scale="2xl" className="leading-relaxed">
                                    The quick brown fox jumps over the lazy dog.
                                </Typography>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-4 font-bold">font-season</p>
                                <Typography font="season" scale="2xl" className="leading-relaxed">
                                    The quick brown fox jumps over the lazy dog.
                                </Typography>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-4 font-bold">font-season-mix</p>
                                <Typography font="season-mix" scale="2xl" className="leading-relaxed">
                                    The quick brown fox jumps over the lazy dog.
                                </Typography>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <Typography as="h1" scale="5xl" font="season" weight="bold" className="tracking-tighter">Heading One</Typography>
                                <Typography as="h2" scale="4xl" font="season-mix" weight="bold" className="tracking-tight">Heading Two</Typography>
                                <Typography as="h3" scale="3xl" weight="semibold">Heading Three</Typography>
                                <Typography as="h4" scale="2xl" weight="semibold">Heading Four</Typography>
                                <Typography scale="xl" font="season-mix" weight="semibold">Heading Five</Typography>
                            </div>
                            <div className="space-y-6 text-muted-foreground">
                                <Typography scale="lg" className="leading-relaxed">
                                    Body Large — Modern communication requires clarity and style. Our design system provides both.
                                </Typography>
                                <Typography scale="base" className="leading-relaxed">
                                    Body Base — Built with attention to detail and a focus on user experience.
                                </Typography>
                                <Typography scale="sm" className="leading-relaxed">
                                    Body Small — Built with attention to detail and a focus on user experience.
                                </Typography>
                                <Typography scale="xs" className="leading-relaxed">
                                    Body XSmall — Built with attention to detail and a focus on user experience.
                                </Typography>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* ─── BUTTONS ─── */}
            <section tabIndex={0} className="px-2">
                <Typography as="h2" scale="2xl" font="season-mix" weight="bold" className="mb-6 border-b border-border pb-4">Buttons</Typography>
                <Card className="space-y-12 border border-border/50 rounded-2xl p-10 bg-card/30 backdrop-blur-sm">
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Variants</p>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="default">Primary</Button>
                                    <Button variant="secondary">Secondary</Button>
                                    <Button variant="outline">Outline</Button>
                                    <Button variant="ghost">Ghost</Button>
                                    <Button variant="destructive">Destructive</Button>
                                    <Button variant="success">Success</Button>
                                    <Button variant="warning">Warning</Button>
                                    <Button variant="flat">Flat</Button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Sizes</p>
                                <div className="flex flex-wrap items-center gap-4">
                                    <Button size="xs">Extra Small</Button>
                                    <Button size="sm">Small</Button>
                                    <Button size="default">Default</Button>
                                    <Button size="lg">Large</Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">States</p>
                                <div className="flex flex-wrap gap-4">
                                    <Button disabled>Disabled</Button>
                                    <Button className="animate-pulse">Active State</Button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Icon Only (Boolean Prop)</p>
                                <div className="flex flex-wrap items-center gap-4">
                                    <Button iconOnly variant="outline" size="xs">
                                        <HugeiconsIcon icon={Settings01Icon} />
                                    </Button>
                                    <Button iconOnly variant="ghost" size="sm">
                                        <HugeiconsIcon icon={Settings01Icon} />
                                    </Button>
                                    <Button iconOnly variant="flat">
                                        <HugeiconsIcon icon={Settings01Icon} />
                                    </Button>
                                    <Button iconOnly variant="destructive" size="lg">
                                        <HugeiconsIcon icon={Settings01Icon} />
                                    </Button>
                                    <Button iconOnly variant="default" className="rounded-full">
                                        <HugeiconsIcon icon={PlusSignIcon} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* ─── DATA & STATUS ─── */}
            <section tabIndex={0} className="px-2">
                <Typography as="h2" scale="2xl" font="season-mix" weight="bold" className="mb-6 border-b border-border pb-4">Status & Identity</Typography>
                <Card className="space-y-12 border border-border/50 rounded-2xl p-10 bg-card/30 backdrop-blur-sm">
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Avatars</p>
                                <div className="flex flex-wrap items-end gap-6">
                                    <Avatar size="lg">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                        <AvatarBadge />
                                    </Avatar>
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <Avatar size="sm">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="flex -space-x-3">
                                        <Avatar className="ring-2 ring-background">
                                            <AvatarFallback className="bg-primary/20 text-primary">JD</AvatarFallback>
                                        </Avatar>
                                        <Avatar className="ring-2 ring-background">
                                            <AvatarFallback className="bg-primary/20 text-primary">AS</AvatarFallback>
                                        </Avatar>
                                        <Avatar className="ring-2 ring-background">
                                            <AvatarFallback>+3</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Skeleton Loading</p>
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Badges</p>
                                <div className="flex flex-wrap gap-3">
                                    <Badge variant="default">Default</Badge>
                                    <Badge variant="secondary">Secondary</Badge>
                                    <Badge variant="outline">Outline</Badge>
                                    <Badge variant="destructive">Destructive</Badge>
                                    <Badge variant="warning">Warning</Badge>
                                    <Badge variant="success">Success</Badge>
                                    <Badge variant="soft">Soft Primary</Badge>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Alerts</p>
                                <Alert>
                                    <HugeiconsIcon icon={Notification03Icon} size={24} color="currentColor" strokeWidth={1.5} />
                                    <AlertTitle className="font-season uppercase tracking-wider text-xs">System Update</AlertTitle>
                                    <AlertDescription>All components are synced.</AlertDescription>
                                    <AlertAction>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-white/10">
                                            <HugeiconsIcon icon={Cancel01Icon} size={14} />
                                        </Button>
                                    </AlertAction>
                                </Alert>
                                <Alert variant="destructive">
                                    <HugeiconsIcon icon={Alert01Icon} size={24} color="currentColor" strokeWidth={1.5} />
                                    <AlertTitle className="font-season uppercase tracking-wider text-xs">System Update</AlertTitle>
                                    <AlertDescription>All components are synced.</AlertDescription>
                                    <AlertAction>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-white/10">
                                            <HugeiconsIcon icon={Cancel01Icon} size={14} />
                                        </Button>
                                    </AlertAction>
                                </Alert>
                                <Alert variant="warning">
                                    <HugeiconsIcon icon={Alert01Icon} size={24} color="currentColor" strokeWidth={1.5} />
                                    <AlertTitle className="font-season uppercase tracking-wider text-xs">System Update</AlertTitle>
                                    <AlertDescription>All components are synced.</AlertDescription>
                                    <AlertAction>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-white/10">
                                            <HugeiconsIcon icon={Cancel01Icon} size={14} />
                                        </Button>
                                    </AlertAction>
                                </Alert>
                                <Alert variant="success">
                                    <HugeiconsIcon icon={Alert01Icon} size={24} color="currentColor" strokeWidth={1.5} />
                                    <AlertTitle className="font-season uppercase tracking-wider text-xs">System Update</AlertTitle>
                                    <AlertDescription>All components are synced.</AlertDescription>
                                    <AlertAction>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-white/10">
                                            <HugeiconsIcon icon={Cancel01Icon} size={14} />
                                        </Button>
                                    </AlertAction>
                                </Alert>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* ─── OVERLAYS ─── */}
            <section tabIndex={0} className="px-2">
                <Typography as="h2" scale="2xl" font="season-mix" weight="bold" className="mb-6 border-b border-border pb-4">Overlays & Menus</Typography>
                <Card className="space-y-12 border border-border/50 rounded-2xl p-10 bg-card/30 backdrop-blur-sm">
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Tooltips</p>
                                <TooltipProvider>
                                    <div className="flex gap-4">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" size="sm">Hover Me</Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Premium component tooltip</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" iconOnly size="sm">
                                                    <HugeiconsIcon icon={InformationCircleIcon} />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                <p>Information tip</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </TooltipProvider>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Dropdown Menu</p>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="secondary">
                                            <HugeiconsIcon icon={FilterIcon} className="mr-2 h-4 w-4" />
                                            Main Menu
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <HugeiconsIcon icon={UserCircle02Icon} className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <HugeiconsIcon icon={Mail01Icon} className="mr-2 h-4 w-4" />
                                            <span>Messages</span>
                                            <DropdownMenuShortcut>⌘M</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <HugeiconsIcon icon={Settings01Icon} className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem variant="destructive">
                                            <HugeiconsIcon icon={Cancel01Icon} className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Dialogs</p>
                                <div className="flex flex-wrap gap-4">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="default">Open Dialog</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit Profile</DialogTitle>
                                                <DialogDescription>
                                                    Make changes to your profile here.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="dialog-name">Name</Label>
                                                    <Input id="dialog-name" placeholder="Enter your name" />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <Button>Save Changes</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" iconOnly={!!selectedIconName}>
                                                {selectedIconName ? (
                                                    <HugeiconsIcon
                                                        icon={(AllIcons as any)[selectedIconName]}
                                                        size={20}
                                                    />
                                                ) : (
                                                    "Icon Selector"
                                                )}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[70vw] max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Select an Icon</DialogTitle>
                                                <DialogDescription>
                                                    Select an icon from the gallery.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="py-4">
                                                <IconGallery
                                                    pageSize={30}
                                                    lg={10}
                                                    md={6}
                                                    sm={4}
                                                    selectMode
                                                    selectedIcon={selectedIconName}
                                                    onSelect={(name) => {
                                                        setSelectedIconName(name);
                                                        setDialogOpen(false);
                                                    }}
                                                />
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive">Delete Account</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="text-destructive">Are you absolutely sure?</DialogTitle>
                                                <DialogDescription>
                                                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <Button variant="destructive">Delete Account</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* ─── COMMAND PALETTE ─── */}
            <section tabIndex={0} className="px-2">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                    <Typography as="h2" scale="2xl" font="season-mix" weight="bold">Command Palette</Typography>
                    <Button variant="outline" size="sm" onClick={() => setCommandOpen(true)}>
                        <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
                        Launch Command
                    </Button>
                </div>

                <div className="max-w-2xl mx-auto group">
                    <Command>
                        <CommandInput placeholder="Type a command or search..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Suggestions">
                                <CommandItem>
                                    <HugeiconsIcon icon={Search01Icon} className="mr-2 h-4 w-4" />
                                    <span>Search Agents</span>
                                </CommandItem>
                                <CommandItem>
                                    <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
                                    <span>Create New Project</span>
                                    <CommandShortcut>⌘N</CommandShortcut>
                                </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Settings">
                                <CommandItem>
                                    <HugeiconsIcon icon={UserCircle02Icon} className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                    <CommandShortcut>⌘P</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <HugeiconsIcon icon={Settings01Icon} className="mr-2 h-4 w-4" />
                                    <span>Account Settings</span>
                                    <CommandShortcut>⌘S</CommandShortcut>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>

                {/* Dialog Version */}
                <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            <CommandItem>
                                <HugeiconsIcon icon={Search01Icon} className="mr-2 h-4 w-4" />
                                <span>Search Agents</span>
                            </CommandItem>
                            <CommandItem>
                                <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
                                <span>Create New Project</span>
                                <CommandShortcut>⌘N</CommandShortcut>
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Settings">
                            <CommandItem>
                                <HugeiconsIcon icon={UserCircle02Icon} className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                                <CommandShortcut>⌘P</CommandShortcut>
                            </CommandItem>
                            <CommandItem>
                                <HugeiconsIcon icon={Settings01Icon} className="mr-2 h-4 w-4" />
                                <span>Account Settings</span>
                                <CommandShortcut>⌘S</CommandShortcut>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </section>

            {/* ─── FORM ELEMENTS ─── */}
            <section tabIndex={0} className="px-2">
                <Typography as="h2" scale="2xl" font="season-mix" weight="bold" className="mb-6 border-b border-border pb-4">Advanced Inputs</Typography>
                <Card className="space-y-12 border border-border/50 rounded-2xl p-10 bg-card/30 backdrop-blur-sm">
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <InputField
                                label="Standard Input"
                                placeholder="Type something..."
                                description="This is a basic input field"
                            />

                            <InputField
                                label="Required Field"
                                placeholder="This field is required"
                                required
                            />

                            <InputField
                                label="Input with Error"
                                placeholder="Invalid value"
                                defaultValue="invalid@email"
                                error="Please enter a valid email address."
                            />

                            <InputField
                                label="Password with Visibility"
                                type="password"
                                placeholder="Enter password"
                                defaultValue="password123"
                            />

                            <div className="grid gap-2">
                                <Label htmlFor="advanced-textarea">Text Area</Label>
                                <Textarea id="advanced-textarea" placeholder="Tell us more about your project..." className="min-h-[120px]" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label>Prompt Input (Conversational)</Label>
                                <div className="pt-2">
                                    <PromptInput
                                        value={promptValue}
                                        onChange={setPromptValue}
                                        onSubmit={() => setPromptValue('')}
                                        placeholder="Ask anything..."
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Perfect for AI-driven interfaces</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* ─── DATA DISPLAY ─── */}
            <section tabIndex={0} className="px-2">
                <Typography as="h2" scale="2xl" font="season-mix" weight="bold" className="mb-6 border-b border-border pb-4">Data Display</Typography>
                <Card className="space-y-12 border border-border/50 rounded-2xl p-10 bg-card/30 backdrop-blur-sm">
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Code Block / Data Viewer</p>
                            <CodeBlock children={`{
  "status": "success",
  "data": {
    "id": "usr_01J2H",
    "name": "Alex Rivier",
    "role": "platform-admin",
    "lastActive": "2024-03-12T14:20:00Z"
  }
}`} />
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Token Display</p>
                            <CodeBlock children="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" />
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* ─── NAVIGATION ─── */}
            <section tabIndex={0} className="px-2">
                <Typography as="h2" scale="2xl" font="season-mix" weight="bold" className="mb-6 border-b border-border pb-4">Navigation & Filtering</Typography>
                <Card className="space-y-12 border border-border/50 rounded-2xl p-10 bg-card/30 backdrop-blur-sm">
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Filter Chips</p>
                            <FilterChips
                                options={categoryChips}
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                            />
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Pagination</p>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={10}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Tabs</p>
                            <Tabs defaultValue="overview">
                                <TabsList>
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="api">API</TabsTrigger>
                                    <TabsTrigger value="playground">Playground</TabsTrigger>
                                </TabsList>
                                <TabsContent value="overview"></TabsContent>
                                <TabsContent value="api"></TabsContent>
                                <TabsContent value="playground"></TabsContent>
                            </Tabs>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* ─── Icons ─── */}
            <section tabIndex={0} className="px-2">
                <Typography as="h2" scale="2xl" font="season-mix" weight="bold" className="mb-6 border-b border-border pb-4">Icon Library</Typography>
                <IconGallery lg={10} md={6} sm={4} pageSize={30} />
            </section>
        </div>
    );
};

export default UIComponents;
