import React, { useState, useEffect, useCallback } from 'react';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Refresh01Icon,
    Search02Icon,
    Add01Icon
} from '@hugeicons/core-free-icons';
import { agentsService } from '@/services/agentsService';
import { Link, useSearchParams } from 'react-router-dom';
import AgentCard, { type Agent } from '@/components/agents/AgentCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/ui/pagination';


const AgentsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(9);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('q') || '');

    const fetchAgents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await agentsService.getAgents({
                query: debouncedSearch,
                page,
                limit
            });
            setAgents(data.agents);
            setTotalItems(data.total);
        } catch (error) {
            console.error("Failed to fetch agents:", error);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, page, limit]);

    const handleDeleteAgent = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm('Are you sure you want to delete this agent?')) return;

        try {
            await agentsService.deleteAgent(id);
            fetchAgents();
        } catch (error) {
            console.error("Failed to delete agent:", error);
            alert("Failed to delete agent");
        }
    };

    useEffect(() => {
        fetchAgents();
    }, [fetchAgents]);

    // Handle search debounce and URL sync
    useEffect(() => {
        const queryFromUrl = searchParams.get('q') || '';
        if (queryFromUrl !== searchQuery) {
            setSearchQuery(queryFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to first page on search

            // Update URL search params
            if (searchQuery) {
                setSearchParams({ q: searchQuery }, { replace: true });
            } else {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('q');
                setSearchParams(newParams, { replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, setSearchParams]);

    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-8 pt-32 md:pt-0 pb-20">
            {/* Header Section */}
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <Typography variant="page-header">
                    Agents
                </Typography>
                <Typography variant="page-description">
                    Manage and explore your deployed AI agents.
                </Typography>
            </section>

            {/* Actions Bar */}
            <header className="mb-4 space-y-4 px-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                            <HugeiconsIcon icon={Search02Icon} size={18} />
                        </div>
                        <Input
                            placeholder="Search agents..."
                            className="pl-10 rounded-full h-10 focus-visible:ring-primary/20 bg-card/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Link to="/agent-create">
                            <Button className="rounded-full gap-2 h-10 px-5">
                                <HugeiconsIcon icon={Add01Icon} size={18} />
                                Create Agent
                            </Button>
                        </Link>
                        <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={() => fetchAgents()}>
                            <HugeiconsIcon icon={Refresh01Icon} size={18} />
                        </Button>
                    </div>
                </div>

                {totalItems > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mt-6">
                        <Badge variant="soft">
                            {totalItems}
                        </Badge>
                        <span>agents found</span>
                        {Math.ceil(totalItems / limit) > 1 && (
                            <span className="ml-auto text-primary/60">
                                Page {page} of {Math.ceil(totalItems / limit)}
                            </span>
                        )}
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 animate-pulse">
                        <div className="size-12 rounded-full bg-muted mb-4 opacity-50" />
                        <div className="h-4 w-48 bg-muted rounded mb-2 opacity-50" />
                        <div className="h-3 w-32 bg-muted rounded opacity-30" />
                    </div>
                ) : agents.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-32 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="text-center space-y-2">
                            <Typography as="h3" scale="xl" className="text-foreground tracking-tight font-season-mix">
                                {searchQuery ? 'No match found' : 'Ready to deploy your agents?'}
                            </Typography>
                            <Typography className="max-w-[400px] mx-auto text-sm text-muted-foreground">
                                {searchQuery
                                    ? `We couldn't find any results for "${searchQuery}". Try a different search term or clear the filter.`
                                    : 'Create and manage your AI agents here to automate tasks and provide intelligent interactions.'}
                            </Typography>
                        </div>
                    </div>
                ) : (
                    agents.map((agent) => (
                        <AgentCard key={agent.id} agent={agent} onDelete={handleDeleteAgent} />
                    ))
                )}
            </div>

            {!loading && agents.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(totalItems / limit)}
                    onPageChange={setPage}
                    className="mt-12"
                />
            )}
        </div>
    );
};


export default AgentsPage;
