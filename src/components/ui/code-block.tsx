import React, { useState } from 'react';
import { Button } from './button';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
    children: string;
    className?: string;
    maxHeight?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
    children,
    className,
    maxHeight = '300px'
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn("relative group", className)}>
            <pre
                className="text-xs bg-background px-3 py-2 rounded-2xl overflow-x-auto text-muted-foreground border border-border overflow-y-auto font-mono"
                style={{ maxHeight }}
            >
                {children}
            </pre>
            <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleCopy}
                    className="h-7 w-7 bg-background/50 backdrop-blur-md border border-transparent hover:bg-background/80 hover:border-white/10 transition-all"
                    iconOnly
                >
                    {copied ? (
                        <Check className="h-3.5 w-3.5 text-primary" />
                    ) : (
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                </Button>
            </div>
        </div>
    );
};
