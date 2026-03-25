import React, { useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUp01Icon, Attachment01Icon, SquareIcon, Loading01Icon } from '@hugeicons/core-free-icons';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  isRunning?: boolean;
  isStopping?: boolean;
  className?: string;
  onStop?: () => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Message your agent...",
  isRunning = false,
  isStopping = false,
  className,
  onStop,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isRunning) {
        onStop?.();
      } else if (value.trim()) {
        onSubmit();
      }
    }
  };

  const handleAction = () => {
    if (isRunning) {
      onStop?.();
    } else if (value.trim()) {
      onSubmit();
    }
  };

  return (
    <div className={cn(
      "relative group max-w-[700px] mx-auto flex flex-col gap-2 rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-2 transition-all duration-300 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20",
      className
    )}>
      <div className="flex items-end gap-2 px-2 py-1">
        {/* Optional: Attachment button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 mb-1 text-muted-foreground hover:text-foreground transition-colors"
          type="button"
          disabled={isRunning || isStopping}
        >
          <HugeiconsIcon icon={Attachment01Icon} size={20} />
        </Button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 min-h-[40px] max-h-[200px] w-full resize-none bg-transparent py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10"
          disabled={isRunning || isStopping}
        />

        <Button
          onClick={handleAction}
          size="icon-sm"
          disabled={isStopping || (!isRunning && !value.trim())}
          className={cn(
            "shrink-0 mb-1 rounded-full transition-all duration-300 hover:cursor-pointer",
            isRunning || value.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          {
            isStopping ? (
                <div className="animate-spin">
                    <HugeiconsIcon icon={Loading01Icon} size={18} />
                </div>
            ) : isRunning ? (
              <HugeiconsIcon icon={SquareIcon} size={14} />
            ) : (
              <HugeiconsIcon icon={ArrowUp01Icon} size={18} />
            )
          }
        </Button>
      </div>
    </div>
  );
};
