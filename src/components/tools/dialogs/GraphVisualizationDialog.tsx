import React, { useEffect, useState, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Search02Icon,
    Refresh01Icon,
    AiNetworkIcon
} from '@hugeicons/core-free-icons';
import ForceGraph2D from 'react-force-graph-2d';
import { knowledgeService } from '@/services/knowledgeService';
import { useAlert } from '@/context/AlertContext';
import { Typography } from '@/components/ui/typography';

interface GraphVisualizationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    kgId?: string;
    kgName?: string;
}

export const GraphVisualizationDialog: React.FC<GraphVisualizationDialogProps> = ({
    isOpen,
    onOpenChange,
    kgId,
    kgName
}) => {
    const { showAlert } = useAlert();
    const [graphData, setGraphData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });
    const [query, setQuery] = useState('');
    const [depth, setDepth] = useState(2);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth * 0.85 : 800,
        height: typeof window !== 'undefined' ? window.innerHeight * 0.7 : 600
    });

    const fetchGraphData = async () => {
        if (!kgId) return;
        try {
            setIsLoading(true);
            const data = await knowledgeService.queryKnowledgeGraph(kgId, query, depth);

            // Format for react-force-graph
            const formattedData = {
                nodes: data.nodes.map((n: any) => ({
                    id: n.id,
                    name: n.name,
                    type: n.type,
                    description: n.description,
                    val: 10 // size
                })),
                links: data.relations.map((r: any) => ({
                    source: r.from,
                    target: r.to,
                    label: r.type,
                    description: r.description
                }))
            };

            setGraphData(formattedData);
        } catch (error: any) {
            if (error.status === 402) {
                showAlert({ 
                    title: 'Payment Required', 
                    description: `Insufficient balance: ${error.message}. Please top up your credits to visualize the graph.`, 
                    variant: 'destructive' 
                });
            } else {
                showAlert({ title: 'Error', description: 'Failed to fetch graph data', variant: 'destructive' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && kgId) {
            fetchGraphData();
        }
    }, [isOpen, kgId]);

    useEffect(() => {
        if (!isOpen) return;

        const update = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        const timer = setTimeout(update, 100); // Give dialog time to animate in
        return () => clearTimeout(timer);
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[90vw] h-[90vh] flex flex-col p-0 overflow-hidden bg-card/95 backdrop-blur-xl border-border/50">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .force-graph-container .graph-tooltip {
                        background: transparent !important;
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                    }
                ` }} />
                <DialogHeader className="p-6 border-b gap-5 border-border/50 shrink-0">
                    <div className="flex flex-col">
                        <DialogTitle className="text-2xl font-season-mix flex items-center gap-3">
                            <HugeiconsIcon icon={AiNetworkIcon} size={24} className="text-primary" />
                            Knowledge Graph: {kgName}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">Explore relationships and semantic connections across your documents.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full">
                        {/* Filter Input */}
                        <div className="relative flex-1">
                            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <HugeiconsIcon icon={Search02Icon} size={14} />
                            </div>
                            <Input
                                placeholder="Filter nodes..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchGraphData()}
                                className="pl-8 h-8 rounded-full w-full"
                            />
                        </div>

                        {/* Depth */}
                        <div className="relative w-28">
                            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Label className="text-xs font-semibold uppercase tracking-wider">
                                    Depth
                                </Label>
                            </div>
                            <Input
                                id="graph-depth"
                                type="number"
                                value={depth}
                                onChange={(e) => setDepth(parseInt(e.target.value))}
                                className="pl-16 rounded-full"
                            />
                        </div>

                        {/* Button */}
                        <Button
                            variant="default"
                            size="sm"
                            className="rounded-full px-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={fetchGraphData}
                            disabled={isLoading}
                        >
                            <HugeiconsIcon
                                icon={Refresh01Icon}
                                size={14}
                                className={isLoading ? 'animate-spin' : ''}
                            />
                            Update
                        </Button>
                    </div>
                </DialogHeader>

                <div ref={containerRef} className="flex-1 bg-black/5 relative overflow-hidden">
                    {isLoading && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-card/40 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="flex flex-col items-center gap-4">
                                <div className="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                <span className="text-sm font-medium text-muted-foreground">Analyzing Graph...</span>
                            </div>
                        </div>
                    )}

                    {graphData.nodes.length > 0 ? (
                        <ForceGraph2D
                            graphData={graphData}
                            width={dimensions.width}
                            height={dimensions.height}
                            nodeLabel={(node: any) => `
                                <div class="p-4 bg-card border border-border rounded-xl min-w-[200px]">
                                    <div class="text-primary mb-1 text-lg font-season-mix">${node.name}</div>
                                    <div class="text-xs text-muted-foreground mb-2 tracking-widest">${node.type}</div>
                                    <div class="text-xs leading-relaxed text-muted-foreground border-t border-border pt-2">${node.description || 'No description available.'}</div>
                                </div>
                            `}
                            nodeAutoColorBy="type"
                            linkLabel={(link: any) => `
                                <div class="px-3 py-1.5 bg-card border border-border rounded-full text-xs font-season-mix text-primary tracking-wide">
                                    ${link.label}
                                </div>
                            `}
                            linkColor={() => 'rgba(255, 255, 255, 0.2)'}
                            linkWidth={1.5}
                            linkDirectionalArrowLength={5}
                            linkDirectionalArrowRelPos={1}
                            linkCurvature={0}
                            nodeCanvasObject={(node: any, ctx, globalScale) => {
                                // Prevent crash if coordinates aren't finite (happens early in simulation)
                                if (node.x === undefined || node.y === undefined || isNaN(node.x) || isNaN(node.y)) return;

                                const label = node.name || 'Entity';
                                const fontSize = 12 / globalScale;
                                ctx.font = `${fontSize}px "Season Mix", Inter, sans-serif`;
                                const textWidth = ctx.measureText(label).width;
                                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

                                // Node glow - using node.color or a premium fallback
                                const nodeColor = node.color || '#3b82f6';
                                const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 10);
                                try {
                                    gradient.addColorStop(0, nodeColor.startsWith('#') ? `${nodeColor}40` : 'rgba(59, 130, 246, 0.25)');
                                    gradient.addColorStop(1, nodeColor.startsWith('#') ? `${nodeColor}00` : 'rgba(59, 130, 246, 0)');
                                } catch (e) {
                                    // Fallback if color string is invalid for any reason
                                    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
                                    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
                                }

                                ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                                ctx.shadowColor = 'rgba(0,0,0,0.3)';
                                ctx.shadowBlur = 10 / globalScale;
                                ctx.beginPath();
                                ctx.roundRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2 - (15 / globalScale), bckgDimensions[0], bckgDimensions[1], 4 / globalScale);
                                ctx.fill();
                                ctx.shadowBlur = 0;

                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = '#111';
                                ctx.fillText(label, node.x, node.y - (15 / globalScale));

                                ctx.beginPath();
                                ctx.arc(node.x, node.y, 6 / globalScale, 0, 2 * Math.PI, false);
                                ctx.fillStyle = node.color;
                                ctx.fill();
                                ctx.strokeStyle = '#fff';
                                ctx.lineWidth = 2 / globalScale;
                                ctx.stroke();
                            }}
                        />
                    ) : !isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                            <Typography className="text-lg text-muted-foreground">No nodes found matching your criteria.</Typography>
                            <Button variant="outline" onClick={() => { setQuery(''); setDepth(2); fetchGraphData(); }}>Clear Filters</Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
