import { Typography } from '@/components/ui/typography';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { agentsService } from '@/services/agentsService';
import { executionService, type ExecutionEvent, type ExecutionMessage } from '@/services/executionService';
import { HugeiconsIcon } from '@hugeicons/react';
import * as AllIcons from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { PromptInput } from '@/components/reusable/prompt-input';
import { ToolActivity } from '@/components/agents/ExecutionEvents';
import { cn } from '@/lib/utils';
import {
    Delete02Icon,
    Message01Icon,
    Copy01Icon
} from '@hugeicons/core-free-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '@/components/ui/code-block';

interface Block {
    type: 'text' | 'tool_activity';
    content?: string;
    data?: any;
    result?: any;
    isLoading?: boolean;
    callId?: string;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string; // Overall text for history
    blocks: Block[];
    events: ExecutionEvent[];
    workflowId?: string;
    status?: 'running' | 'completed' | 'failed' | 'cancelled';
}

const TypingEffect: React.FC<{ text: string; delay?: number; onUpdate?: () => void; onComplete?: () => void }> = ({ text, delay = 10, onUpdate, onComplete }) => {
    const [displayedText, setDisplayedText] = useState("");

    const hasTriggeredComplete = useRef(false);
    
    // Reset the completion guard if text changes
    useEffect(() => {
        hasTriggeredComplete.current = false;
    }, [text]);

    useEffect(() => {
        if (displayedText.length < text.length) {
            // Speed up if we're in background or catch up when coming back
            if (document.hidden) {
                setDisplayedText(text);
                onUpdate?.();
                return;
            }

            const timeout = setTimeout(() => {
                const nextText = text.slice(0, displayedText.length + 1);
                setDisplayedText(nextText);
                onUpdate?.();
            }, delay);
            return () => clearTimeout(timeout);
        } else if (displayedText.length === text.length && text.length > 0 && !hasTriggeredComplete.current) {
            hasTriggeredComplete.current = true;
            onComplete?.();
        }
    }, [text, displayedText, delay, onUpdate, onComplete]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && displayedText.length < text.length) {
                setDisplayedText(text);
                onUpdate?.();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [text, displayedText, onUpdate]);

    return (
        <div className="flex flex-col gap-0">
             <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ({ children }) => (
                        <Typography scale="sm" className="font-matter leading-relaxed whitespace-pre-wrap mb-4 last:mb-0">
                            {children}
                        </Typography>
                    ),
                    h1: ({ children }) => <Typography as="h1" scale="2xl" weight="bold" className="mb-4 mt-6 first:mt-0">{children}</Typography>,
                    h2: ({ children }) => <Typography as="h2" scale="xl" weight="bold" className="mb-3 mt-5 first:mt-0">{children}</Typography>,
                    h3: ({ children }) => <Typography as="h3" scale="lg" weight="bold" className="mb-2 mt-4 first:mt-0">{children}</Typography>,
                    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                    li: ({ children }) => (
                        <li>
                            <Typography scale="sm" className="font-matter leading-relaxed">
                                {children}
                            </Typography>
                        </li>
                    ),
                    code: ({ inline, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        if (!inline && match) {
                            return (
                                <CodeBlock 
                                    className="my-4"
                                >
                                    {String(children).replace(/\n$/, '')}
                                </CodeBlock>
                            );
                        }
                        return (
                            <code className={cn("bg-muted px-1.5 py-0.5 rounded-md text-xs font-mono", className)} {...props}>
                                {children}
                            </code>
                        );
                    },
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary/20 pl-4 italic my-4 text-muted-foreground">
                            {children}
                        </blockquote>
                    ),
                    a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">
                            {children}
                        </a>
                    ),
                    hr: () => <hr className="my-8 border-border" />,
                }}
            >
                {displayedText}
            </ReactMarkdown>
        </div>
    );
};


const AgentChatPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [agent, setAgent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isStopping, setIsStopping] = useState(false);
    const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const lastMessageCount = useRef(0);
    const [typingFinished, setTypingFinished] = useState<Record<string, boolean>>({});

    const scrollToBottom = (behavior: ScrollBehavior = "smooth", force = false) => {
        if (messagesEndRef.current && messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            // Only scroll if we are near the bottom (within 100px) or if force is true
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
            
            if (force || isNearBottom) {
                messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
            }
        }
    };

    useEffect(() => {
        const isNewMessage = messages.length > lastMessageCount.current;
        scrollToBottom("smooth", isNewMessage);
        lastMessageCount.current = messages.length;
    }, [messages]);

    useEffect(() => {
        if (slug) {
            const fetchAgent = async () => {
                try {
                    const data = await agentsService.getAgentById(slug);
                    setAgent(data);
                } catch (error) {
                    console.error('Failed to fetch agent:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAgent();
        }
    }, [slug]);

    useEffect(() => {
        if (!slug) return;

        const checkActiveWorkflows = async () => {
            try {
                const response = await executionService.getActiveWorkflows(slug);
                if (response.status === 'success' && response.workflows && response.workflows.length > 0) {
                    const activeWorkflow = response.workflows[0]; // Take the first one for now
                    const assistantMsgId = Date.now().toString();

                    setMessages([{
                        id: assistantMsgId,
                        role: 'assistant',
                        content: "",
                        blocks: [],
                        events: [],
                        status: 'running',
                        workflowId: activeWorkflow.workflowId
                    }]);
                    setIsExecuting(true);

                    try {
                        await executionService.subscribeToWorkflow(activeWorkflow.workflowId, (event) => {
                            handleExecutionEvent(assistantMsgId, event);
                        });
                    } catch (error: any) {
                        console.error('Subscription failed:', error);
                        if (error.status === 402) {
                            const displayMessage = `Insufficient Credits: ${error.message}. Please [top up your balance](/billing) to continue.`;
                            setMessages(prev => prev.map(m =>
                                m.id === assistantMsgId ? { 
                                    ...m, 
                                    status: 'failed', 
                                    content: displayMessage,
                                    blocks: [{ type: 'text', content: displayMessage }] 
                                } : m
                            ));
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to check active workflows:', error);
            }
        };

        checkActiveWorkflows();
    }, [slug]);

    const handleSend = async () => {
        if (!userPrompt.trim() || isExecuting || !slug) return;

        const prompt = userPrompt;
        setUserPrompt("");

        const userMsgId = Date.now().toString();
        const userMessage: Message = {
            id: userMsgId,
            role: 'user',
            content: prompt,
            blocks: [],
            events: []
        };

        const assistantMsgId = (Date.now() + 1).toString();
        const assistantMessage: Message = {
            id: assistantMsgId,
            role: 'assistant',
            content: "",
            blocks: [],
            events: [],
            status: 'running'
        };

        setMessages(prev => [...prev, userMessage, assistantMessage]);
        setIsExecuting(true);

        const apiMessages: ExecutionMessage[] = [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: prompt }
        ];

        try {
            await executionService.triggerAgent(slug, apiMessages, (event) => {
                handleExecutionEvent(assistantMsgId, event);
            });
        } catch (error: any) {
            console.error('Execution failed:', error);
            
            let displayMessage = 'Workflow execution failed.';
            if (error.status === 402) {
                displayMessage = `Insufficient Credits: ${error.message}. Please [top up your balance](/billing) to continue.`;
            }

            setMessages(prev => prev.map(m =>
                m.id === assistantMsgId ? { 
                    ...m, 
                    status: 'failed', 
                    content: displayMessage,
                    blocks: [{ type: 'text', content: displayMessage }] 
                } : m
            ));
            setCurrentWorkflowId(null);
            setIsStopping(false);
        } finally {
            setIsExecuting(false);
        }
    };

    const handleExecutionEvent = (assistantMsgId: string, event: ExecutionEvent) => {
        setMessages(prev => {
            return prev.map(m => {
                if (m.id === assistantMsgId) {
                    const newEvents = [...m.events, event];
                    let newContent = m.content;
                    let newBlocks = [...m.blocks];
                    let newStatus = m.status;
                    let newWorkflowId = m.workflowId;

                    // Support A2A protocol structure where data is inside result.metadata
                    const metadata = event.data?.metadata || {};
                    const internalData = event.data || {};

                    if (event.type === 'start') {
                        newWorkflowId = metadata.workflow_id || internalData.workflow_id;
                        setCurrentWorkflowId(newWorkflowId || null);
                    } else if (event.type === 'WorkflowStarted') {
                        // Reconnection event
                        newWorkflowId = internalData.workflowId || metadata.workflow_id;
                        setCurrentWorkflowId(newWorkflowId || null);
                    } else if (event.type === 'token') {
                        const delta = metadata.delta || internalData.delta || "";
                        if (delta) {
                            newContent += delta;
                            // Add to last block if it's text, or create new text block
                            const lastIdx = newBlocks.length - 1;
                            if (lastIdx >= 0 && newBlocks[lastIdx].type === 'text') {
                                newBlocks[lastIdx] = {
                                    ...newBlocks[lastIdx],
                                    content: (newBlocks[lastIdx].content || "") + delta
                                };
                            } else {
                                newBlocks.push({ type: 'text', content: delta });
                            }
                        }
                    } else if (event.type === 'tool_call') {
                        const toolName = metadata.name || internalData.name;
                        const toolArgs = metadata.arguments || internalData.arguments;
                        const callId = metadata.call_id || internalData.call_id || metadata.callId || internalData.callId;

                        newBlocks.push({
                            type: 'tool_activity',
                            data: { name: toolName, arguments: toolArgs },
                            callId: callId,
                            isLoading: true
                        });
                    } else if (event.type === 'tool_result') {
                        const toolName = metadata.name || internalData.name;
                        const callId = metadata.call_id || internalData.call_id || metadata.callId || internalData.callId;
                        let toolResult = metadata.result || internalData.result;

                        // Try parsing JSON if result is a string
                        if (typeof toolResult === 'string') {
                            try {
                                toolResult = JSON.parse(toolResult);
                            } catch (e) {
                                // Keep as string
                            }
                        }

                        // Find matching tool call block (prefer callId, fallback to name)
                        const toolIdx = [...newBlocks].reverse().findIndex(b =>
                            b.type === 'tool_activity' &&
                            (callId && b.callId === callId || (!callId && b.data.name === toolName)) &&
                            !b.result
                        );

                        if (toolIdx !== -1) {
                            const actualIdx = newBlocks.length - 1 - toolIdx;
                            newBlocks[actualIdx] = {
                                ...newBlocks[actualIdx],
                                result: toolResult,
                                isLoading: false
                            };
                        }
                    } else if (event.type === 'end') {
                        const status = metadata.status || internalData.status || 'success';
                        newStatus = status === 'success' ? 'completed' : 'failed';
                        if (status === 'cancelled') newStatus = 'cancelled';
                        setCurrentWorkflowId(null);
                        setIsStopping(false);
                        setIsExecuting(false);
                        // Proactively clear any pending tool loading states
                        newBlocks = newBlocks.map(b => 
                            b.type === 'tool_activity' ? { ...b, isLoading: false } : b
                        );
                        // @ts-ignore
                        if (window.eventSource) window.eventSource.close();
                    } else if (event.type === 'Error' || event.type === 'error') {
                        newStatus = 'failed';
                        const errorMessage = internalData.message || metadata.message || 'Unknown error occurred';
                        
                        if (errorMessage.toLowerCase().includes('insufficient balance') || errorMessage.toLowerCase().includes('insufficient credits')) {
                            const helpMessage = `**Insufficient Credits**: Your balance is too low to continue this execution. Please [top up your balance](/billing) to resume.`;
                            newContent = helpMessage;
                            newBlocks = [{ type: 'text', content: helpMessage }];
                        } else {
                            newContent += `\n\n**Error**: ${errorMessage}`;
                            newBlocks.push({ type: 'text', content: `\n\n**Error**: ${errorMessage}` });
                        }

                        setCurrentWorkflowId(null);
                        setIsStopping(false);
                        setIsExecuting(false);
                        newBlocks = newBlocks.map(b => 
                            b.type === 'tool_activity' ? { ...b, isLoading: false } : b
                        );
                        // @ts-ignore
                        if (window.eventSource) window.eventSource.close();
                    }

                    return {
                        ...m,
                        content: newContent,
                        blocks: newBlocks,
                        events: newEvents,
                        status: newStatus,
                        workflowId: newWorkflowId
                    };
                }
                return m;
            });
        });
    };

    const handleCancel = async () => {
        if (currentWorkflowId) {
            setIsStopping(true);
            try {
                await executionService.cancelWorkflow(currentWorkflowId);
            } catch (error) {
                console.error('Failed to cancel workflow:', error);
                setIsStopping(false);
            }
        }
    };

    const clearChat = () => {
        setMessages([]);
        setCurrentWorkflowId(null);
        setIsExecuting(false);
        setIsStopping(false);
    };

    return (
        <div className="flex container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-8 flex-col h-full">
            {/* ─── HERO / PREVIEW ─── */}
            <div className='border-b border-border mb-0'>
                <section className="flex lg:pl-2 md:pl-2 pl-16 pr-2 flex-row items-center justify-between mb-2 shrink-0">
                    <div className='flex flex-row items-center gap-4'>
                        <div className="flex items-center gap-3">
                            <div className="border border-border p-2 rounded-lg">
                                <HugeiconsIcon
                                    icon={(AllIcons as any)[agent?.icon] || AllIcons.UserCircle02Icon}
                                    size={22}
                                />
                            </div>
                            <div>
                                <Typography scale="2xl" font="season-mix" weight="normal" className="tracking-tight shrink-0 whitespace-nowrap">
                                    {loading ? 'Loading...' : (agent?.name || 'Agent')}
                                </Typography>
                                <Typography scale="sm" className="tracking-tight shrink-0 whitespace-nowrap text-muted-foreground">
                                    {loading ? 'Loading...' : (agent?.description || 'Agent')}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            className="rounded-full gap-2 px-5"
                            onClick={clearChat}
                        >
                            <HugeiconsIcon icon={Delete02Icon} size={14} />
                            Clear
                        </Button>
                    </div>
                </section>
            </div>

            {/* Chat Interface */}
            <section className="flex-1 flex flex-col min-h-0 relative">
                <div 
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto px-4 space-y-6 pb-32 pt-8"
                >
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-40 select-none">
                            <div className="p-6 rounded-full bg-muted mb-4">
                                <HugeiconsIcon icon={Message01Icon} size={32} />
                            </div>
                            <Typography scale="sm" className="font-matter text-center max-w-[280px]">
                                Start a conversation with {agent?.name || 'the agent'} to see their reasoning and responses.
                            </Typography>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div key={message.id} className={cn(
                            "flex flex-col w-full group",
                            message.role === 'user' ? "items-end" : "items-start"
                        )}>
                            {message.role === 'user' ? (
                                <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-3 text-primary-foreground shadow-sm">
                                    <Typography scale="sm" className="font-matter leading-relaxed">
                                        {message.content}
                                    </Typography>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 w-full max-w-[90%]">
                                    {/* Sequential Blocks logic */}
                                    <div className="space-y-4">
                                        {message.blocks.map((block, idx) => {
                                            if (block.type === 'text') {
                                                return (
                                                    <div key={idx} className="text-foreground animate-in fade-in duration-500">
                                                        <TypingEffect
                                                            text={block.content || ""}
                                                            delay={10}
                                                            onUpdate={() => scrollToBottom("auto")}
                                                            onComplete={() => {
                                                                if (message.status !== 'running' && idx === message.blocks.length - 1) {
                                                                    setTypingFinished(prev => ({ ...prev, [message.id]: true }));
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            }
                                            if (block.type === 'tool_activity') {
                                                return <ToolActivity key={idx} data={{
                                                    name: block.data.name,
                                                    arguments: block.data.arguments,
                                                    result: block.result,
                                                    isLoading: block.isLoading
                                                }} />;
                                            }
                                            return null;
                                        })}

                                        {message.status === 'running' && message.blocks.length === 0 && (
                                            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                                <Typography scale="xs">Thinking...</Typography>
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Actions */}
                                    {message.status !== 'running' && 
                                     message.role === 'assistant' && 
                                     (message.blocks.length === 0 || 
                                      message.blocks[message.blocks.length - 1].type !== 'text' || 
                                      typingFinished[message.id]) && (
                                        <div className="flex items-center gap-1 mt-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(message.content);
                                                }}
                                            >
                                                <HugeiconsIcon icon={Copy01Icon} size={16} />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>


                {/* Fixed Prompt Input */}
                <div className="absolute bottom-0 left-0 right-0 z-20 pb-2 px-4">
                    <PromptInput
                        value={userPrompt}
                        onChange={setUserPrompt}
                        onSubmit={handleSend}
                        onStop={handleCancel}
                        isRunning={isExecuting}
                        isStopping={isStopping}
                        placeholder="Ask me anything..."
                        className="max-w-[700px] mx-auto shadow-2xl"
                    />
                </div>
            </section>
        </div>
    );
};

export default AgentChatPage;
