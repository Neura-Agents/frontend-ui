import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Home09Icon,
    AiScanIcon,
    Add01Icon,
    McpServerFreeIcons,
    ToolsIcon,
    BrainIcon,
    AiNetworkIcon,
    KeyIcon,
    PieChartIcon,
    Wallet03Icon,
    Invoice01Icon,
    BrandfetchIcon,
    UserIcon,
    Settings01Icon,
    File01Icon,
    Refresh01Icon as LoadingIcon,
    InformationCircleIcon,
    Search02Icon,
    Logout01Icon,
    ArrowDown01Icon,
    ArrowDownDoubleIcon,
    PaintBoardIcon
} from "@hugeicons/core-free-icons";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Typography } from "../ui/typography";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/theme/themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent,
    DropdownMenuGroup
} from "../ui/dropdown-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import Logo from "../reusable/Logo";
import { agentsService } from "@/services/agentsService";
import { toolsService } from "@/services/toolsService";
import { mcpService } from "@/services/mcpService";
import { knowledgeService } from "@/services/knowledgeService";
import { useNavigation } from "@/context/NavigationContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useCallback, useRef } from "react";
import { useUmami } from "@/hooks/useUmami";

const ICON_MAP: Record<string, any> = {
    'Home09Icon': Home09Icon,
    'InformationCircleIcon': InformationCircleIcon,
    'Wallet03Icon': Wallet03Icon,
    'AiScanIcon': AiScanIcon,
    'Add01Icon': Add01Icon,
    'Search02Icon': Search02Icon,
    'McpServerFreeIcons': McpServerFreeIcons,
    'ToolsIcon': ToolsIcon,
    'BrainIcon': BrainIcon,
    'AiNetworkIcon': AiNetworkIcon,
    'KeyIcon': KeyIcon,
    'PieChartIcon': PieChartIcon,
    'Invoice01Icon': Invoice01Icon,
    'BrandfetchIcon': BrandfetchIcon,
    'UserIcon': UserIcon,
    'Settings01Icon': Settings01Icon,
    'File01Icon': File01Icon
};

interface MaybeTooltipProps {
    children: React.ReactNode;
    title?: string;
    side?: "left" | "right" | "top" | "bottom";
    open?: boolean;
}

function MaybeTooltip({ children, title, side = "right" }: MaybeTooltipProps) {
    const { state } = useSidebar();
    if (state === "expanded" || !title) return <>{children}</>;
    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side={side}>{title}</TooltipContent>
        </Tooltip>
    );
}

export function AppSidebar() {
    const navigate = useNavigate();
    const { logout, user, hasRole } = useAuth();
    const { theme, setTheme } = useTheme();
    const { state } = useSidebar();
    const { track } = useUmami();
    const location = useLocation();
    const { sidebar: navGroups, loading: isLoadingNav } = useNavigation();
    const [open, setOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState("All");
    const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const checkScroll = useCallback(() => {
        if (!contentRef.current) return;
        const { scrollHeight, scrollTop, clientHeight } = contentRef.current;
        const buffer = 10;
        // If scrollHeight is close to clientHeight, it's not scrollable
        const scrollable = scrollHeight > clientHeight + buffer;
        const atBottom = scrollHeight - scrollTop <= clientHeight + buffer;
        setIsAtBottom(!scrollable || atBottom);
    }, []);

    useEffect(() => {
        // Initial check after a short delay to account for list rendering
        const timer = setTimeout(checkScroll, 100);
        window.addEventListener('resize', checkScroll);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', checkScroll);
        };
    }, [checkScroll, navGroups, collapsedGroups, state, isLoadingNav]);
    const [searchValue, setSearchValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<{
        agents: any[],
        tools: any[],
        mcp: any[],
        kb: any[],
        kg: any[]
    }>({
        agents: [],
        tools: [],
        mcp: [],
        kb: [],
        kg: []
    });

    const toggleGroup = (label: string) => {
        setCollapsedGroups(prev =>
            prev.includes(label)
                ? prev.filter(l => l !== label)
                : [...prev, label]
        );
    };

    const performSearch = useCallback(async (query: string) => {
        if (!query || query.length < 2) {
            setResults({ agents: [], tools: [], mcp: [], kb: [], kg: [] });
            return;
        }

        setIsSearching(true);
        try {
            const [agentsData, toolsData, mcpData, kbData, kgData] = await Promise.all([
                agentsService.getAgents({ query, limit: 5 }),
                toolsService.getTools(1, 5, query),
                mcpService.getServers({ query, limit: 5 }),
                knowledgeService.getKnowledgeBases({ name: query, limit: 5 }),
                knowledgeService.getKnowledgeGraphs({ name: query, limit: 5 })
            ]);

            setResults({
                agents: agentsData.agents || [],
                tools: toolsData.tools || [],
                mcp: mcpData.mcp_servers || [],
                kb: kbData.items || [],
                kg: kgData.items || []
            });
            track('global-search-query-success', { query });
        } catch (error) {
            console.error("Global search failed:", error);
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(searchValue);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchValue, performSearch]);

    const handleSelect = (url: string, q?: string) => {
        setOpen(false);
        setSearchValue("");
        track('global-search-select', { url, query: q });
        navigate(q ? `${url}?q=${encodeURIComponent(q)}` : url);
    };

    // Map the API data into the format expected by the UI, injecting the Search button if needed
    const groupedNavItems = navGroups.map(group => {
        // Map icon strings to Hugeicons components and handle Search injection
        const mappedItems = group.items.map((item: any) => ({
            title: item.title,
            url: item.url,
            icon: ICON_MAP[item.icon] || Home09Icon
        }));

        // Special case: Add the Search button to the Playground category
        if (group.label === "Playground") {
            mappedItems.push({
                title: "Search",
                onClick: () => {
                    setOpen(true);
                    track('global-search-open');
                },
                icon: Search02Icon
            } as any);
        }

        return {
            ...group,
            items: mappedItems
        };
    }).filter(Boolean);

    return (
        <>
            <Sidebar collapsible="icon" className="border-r-0 border-transparent bg-background">
                <SidebarHeader className="flex justify-between items-center py-4 border-0">
                    <div className={cn("flex items-center flex-nowrap", state === "collapsed" ? "justify-center w-full focus:outline-none gap-2" : "justify-between w-full px-2")}>
                        {state === "expanded" && (
                            <Logo fontSize="text-lg" className="gap-2" />
                        )}
                        <SidebarTrigger className="hidden md:flex hover:cursor-pointer" />
                    </div>
                </SidebarHeader>

                <SidebarContent
                    ref={contentRef}
                    onScroll={checkScroll}
                    className="py-2"
                >
                    {isLoadingNav ? (
                        <div className="flex flex-col gap-8 px-2 py-4 animate-pulse">
                            {[1, 2, 3].map((group) => (
                                <div key={group} className="space-y-4">
                                    {state === "expanded" && (
                                        <div className="h-3 w-16 bg-muted/40 rounded px-2 mx-1" />
                                    )}
                                    <div className="space-y-2">
                                        {[1, 2, 3, 4].map((item) => (
                                            <div
                                                key={item}
                                                className={cn(
                                                    "flex items-center w-full h-10 px-3 rounded-full bg-muted/20",
                                                    state === "collapsed" ? "justify-center" : "justify-start gap-3"
                                                )}
                                            >
                                                <div className="size-5 shrink-0 rounded bg-muted/40" />
                                                {state === "expanded" && (
                                                    <div className="h-4 w-24 bg-muted/40 rounded" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        groupedNavItems.map((group: any, index: number) => {
                            const isCollapsed = collapsedGroups.includes(group.label);
                            const isCollapsible = group.collapsible !== false;

                            return (
                                <SidebarGroup key={`${group.label}-${index}`} className="py-2">
                                    {group.label && (
                                        <SidebarGroupLabel
                                            className={cn(
                                                "px-3 tracking-wider flex items-center justify-between group whitespace-nowrap flex-nowrap",
                                                isCollapsible && state === "expanded" && "cursor-pointer hover:text-muted-foreground/80 transition-colors"
                                            )}
                                            onClick={() => isCollapsible && state === "expanded" && toggleGroup(group.label)}
                                        >
                                            <span className="text-sm">{group.label}</span>
                                            {isCollapsible && (
                                                <motion.div
                                                    animate={{ rotate: isCollapsed ? -90 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <HugeiconsIcon icon={ArrowDown01Icon} size={12} />
                                                </motion.div>
                                            )}
                                        </SidebarGroupLabel>
                                    )}
                                    <AnimatePresence initial={false}>
                                        {!isCollapsed && (
                                            <motion.div
                                                initial={state === "expanded" ? { height: 0, opacity: 0 } : false}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <SidebarGroupContent>
                                                    <SidebarMenu>
                                                        {group.items.map((item: any) => {
                                                            const Content = (
                                                                <div className={cn(
                                                                    "flex items-center w-full",
                                                                    state === "collapsed" ? "justify-center" : "justify-start gap-2"
                                                                )}>
                                                                    <HugeiconsIcon icon={item.icon} />
                                                                    {state === "expanded" && <span>{item.title}</span>}
                                                                </div>
                                                            );

                                                            const isActive = "url" in item && location.pathname === item.url;

                                                            return (
                                                                <MaybeTooltip key={item.title} title={item.title}>
                                                                    {"url" in item ? (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="lg"
                                                                            asChild
                                                                            onClick={() => track('sidebar-item-click', { title: item.title, url: item.url })}
                                                                            className={cn(
                                                                                state === "collapsed" ? "justify-center px-0 gap-0 w-full rounded-full" : "justify-start gap-3 rounded-full",
                                                                                isActive && "bg-muted text-foreground"
                                                                            )}
                                                                        >
                                                                            <Link to={item.url as string}>
                                                                                {Content}
                                                                            </Link>
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="lg"
                                                                            onClick={item.onClick}
                                                                            className={state === "collapsed" ? "justify-center px-0 gap-0 w-full rounded-full hover:cursor-pointer" : "justify-start gap-3 rounded-full hover:cursor-pointer"}
                                                                        >
                                                                            {Content}
                                                                        </Button>
                                                                    )}
                                                                </MaybeTooltip>
                                                            );
                                                        })}
                                                    </SidebarMenu>
                                                </SidebarGroupContent>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </SidebarGroup>
                            );
                        })
                    )}
                </SidebarContent>
                <AnimatePresence>
                    {!isAtBottom && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute bottom-10 left-0 right-0 h-32 bg-linear-to-t from-background via-background/90 to-transparent z-20 pointer-events-none flex flex-col items-center justify-end pb-8"
                        >
                            <div className="animate-bounce text-muted-foreground">
                                <HugeiconsIcon icon={ArrowDownDoubleIcon} size={16} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <SidebarFooter className="border-0">
                    {user && (
                        <MaybeTooltip title={`${user.name || 'User'} Profile`}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className="p-0">
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        className={cn(
                                            "w-full py-5 transition-all hover:cursor-pointer",
                                            state === "collapsed" ? "justify-center px-0" : "justify-start gap-3 px-4"
                                        )}
                                    >
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarImage src="" />
                                            <AvatarFallback>{user.name?.split(' ').map(name => name.charAt(0).toUpperCase()).join('') || 'User'}</AvatarFallback>
                                        </Avatar>
                                        {
                                            state === "expanded" &&
                                            <Typography font="season-mix" className="truncate text-foreground">{user.name || 'User'}</Typography>
                                        }
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <Link to="/profile">
                                            <HugeiconsIcon icon={UserIcon} />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <div className="flex items-center gap-2">
                                                <HugeiconsIcon icon={PaintBoardIcon} className="size-4" />
                                                <span>Themes</span>
                                            </div>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuGroup>
                                                    {themes.filter(t => t.isPublic).map((t) => (
                                                        <DropdownMenuItem key={t.id} onClick={() => setTheme(t.id)} className="flex items-center gap-2">
                                                            <span>{t.name}</span>
                                                            {theme === t.id && <div className="ml-auto size-1.5 rounded-full bg-primary" />}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuGroup>
                                                {hasRole("platform-admin") && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild>
                                                            <Link to="/theme-settings" className="flex items-center gap-2 cursor-pointer">
                                                                <HugeiconsIcon icon={Settings01Icon} className="size-4" />
                                                                <span>Theme Settings</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem variant="destructive" onClick={() => logout()}>
                                        <HugeiconsIcon icon={Logout01Icon} />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </MaybeTooltip>
                    )}
                </SidebarFooter>
            </Sidebar>
            <CommandDialog
                open={open}
                onOpenChange={(isOpen) => {
                    setOpen(isOpen);
                    if (!isOpen) {
                        setSearchValue("");
                        setActiveFilter("All");
                    }
                }}
                shouldFilter={false}
            >
                <CommandInput
                    placeholder="Search agents, tools, knowledge..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                    className="mb-0 border-none"
                />

                <div className="flex items-center gap-2 px-4 pb-4 overflow-x-auto no-scrollbar border-b">
                    {["All", "Agents", "Tools", "MCP", "Knowledge"].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap",
                                activeFilter === filter
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <CommandList className="pt-2">
                    {isSearching && (
                        <div className="flex items-center justify-center py-6 text-muted-foreground gap-2">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <HugeiconsIcon icon={LoadingIcon} size={16} />
                            </motion.div>
                            <span className="text-sm">Searching...</span>
                        </div>
                    )}

                    {/* We no longer need the standard CommandEmpty because we have a custom styled one below */}

                    {!isSearching && searchValue.length < 2 && (
                        <CommandGroup heading="Quick Actions">
                            <CommandItem onSelect={() => handleSelect("/agent-create")}>
                                <HugeiconsIcon icon={Add01Icon} className="mr-2 h-4 w-4" />
                                Create New Agent
                            </CommandItem>
                            <CommandItem onSelect={() => handleSelect("/agents")}>
                                <HugeiconsIcon icon={AiScanIcon} className="mr-2 h-4 w-4" />
                                View All Agents
                            </CommandItem>
                        </CommandGroup>
                    )}

                    {!isSearching && searchValue.length >= 2 && (
                        <>
                            {(() => {
                                const hasAgents = (activeFilter === "All" || activeFilter === "Agents") && results.agents.length > 0;
                                const hasTools = (activeFilter === "All" || activeFilter === "Tools") && results.tools.length > 0;
                                const hasMCP = (activeFilter === "All" || activeFilter === "MCP") && results.mcp.length > 0;
                                const hasKB = (activeFilter === "All" || activeFilter === "Knowledge") && results.kb.length > 0;
                                const hasKG = (activeFilter === "All" || activeFilter === "Knowledge") && results.kg.length > 0;

                                const hasAnyResults = hasAgents || hasTools || hasMCP || hasKB || hasKG;

                                if (!hasAnyResults) {
                                    return (
                                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                            <Typography as="h3" scale="xl" className="text-foreground tracking-tight font-season-mix">
                                                No matches found</Typography>
                                            <Typography className="max-w-[400px] mx-auto text-sm text-muted-foreground">
                                                We couldn't find any {activeFilter !== "All" ? activeFilter.toLowerCase() : "items"} matching "{searchValue}".
                                            </Typography>
                                        </div>
                                    );
                                }

                                return (
                                    <>
                                        {hasAgents && (
                                            <CommandGroup heading="Agents">
                                                {results.agents.map((agent) => (
                                                    <CommandItem
                                                        key={agent.id}
                                                        onSelect={() => handleSelect("/agents", agent.name)}
                                                    >
                                                        <HugeiconsIcon icon={AiScanIcon} className="mr-2 h-4 w-4" />
                                                        <span>{agent.name}</span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        )}

                                        {hasTools && (
                                            <CommandGroup heading="Tools">
                                                {results.tools.map((tool) => (
                                                    <CommandItem
                                                        key={tool.id}
                                                        onSelect={() => handleSelect("/tools", tool.name)}
                                                    >
                                                        <HugeiconsIcon icon={ToolsIcon} className="mr-2 h-4 w-4" />
                                                        <span>{tool.name}</span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        )}

                                        {hasMCP && (
                                            <CommandGroup heading="MCP Servers">
                                                {results.mcp.map((server) => (
                                                    <CommandItem
                                                        key={server.server_id}
                                                        onSelect={() => handleSelect("/mcp", server.server_name)}
                                                    >
                                                        <HugeiconsIcon icon={McpServerFreeIcons} className="mr-2 h-4 w-4" />
                                                        <span>{server.server_name}</span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        )}

                                        {(hasKB || hasKG) && (
                                            <>
                                                {hasKB && (
                                                    <CommandGroup heading="Knowledge Bases">
                                                        {results.kb.map((kb) => (
                                                            <CommandItem
                                                                key={kb.id}
                                                                onSelect={() => handleSelect("/knowledge-base", kb.name)}
                                                            >
                                                                <HugeiconsIcon icon={BrainIcon} className="mr-2 h-4 w-4" />
                                                                <span>{kb.name}</span>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                )}

                                                {hasKG && (
                                                    <CommandGroup heading="Knowledge Graphs">
                                                        {results.kg.map((kg) => (
                                                            <CommandItem
                                                                key={kg.id}
                                                                onSelect={() => handleSelect("/knowledge-graph", kg.name)}
                                                            >
                                                                <HugeiconsIcon icon={AiNetworkIcon} className="mr-2 h-4 w-4" />
                                                                <span>{kg.name}</span>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                )}
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}