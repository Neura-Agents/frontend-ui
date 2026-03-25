import React from 'react';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import * as AllIcons from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className
}) => {
    if (totalPages <= 1) return null;

    const handlePageClick = (page: number) => {
        onPageChange(page);
        // We smooth scroll back to a reasonable position when page changes
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    const renderPageButtons = () => {
        const pages: (number | string)[] = [];
        const delta = 1;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta) ||
                (currentPage <= 3 && i <= 3) ||
                (currentPage >= totalPages - 2 && i >= totalPages - 2)
            ) {
                if (pages.length > 0 && i - (pages[pages.length - 1] as number) > 1) {
                    pages.push('...');
                }
                pages.push(i);
            }
        }

        return pages.map((pageNum, idx) => (
            pageNum === '...' ? (
                <span key={`dots-${idx}`} className="px-1 text-muted-foreground select-none">...</span>
            ) : (
                <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handlePageClick(pageNum as number)}
                    className={cn(
                        "w-10 h-10 rounded-full font-mono text-xs transition-all duration-300",
                        currentPage === pageNum && "bg-primary text-primary-foreground"
                    )}
                >
                    {pageNum}
                </Button>
            )
        ));
    };

    return (
        <div className={cn("flex items-center justify-center gap-4 py-6", className)}>
            <Button
                variant="ghost"
                disabled={currentPage === 1}
                onClick={() => handlePageClick(currentPage - 1)}
                className="group font-season uppercase tracking-widest text-xs h-10 px-6 rounded-full hover:bg-primary/10"
            >
                <HugeiconsIcon
                    icon={AllIcons.ArrowLeft01Icon}
                    size={20}
                    strokeWidth={1.5}
                    className="text-foreground/80 group-hover:text-primary transition-colors"
                />
            </Button>

            <div className="flex items-center gap-2 font-season-mix">
                {renderPageButtons()}
            </div>

            <Button
                variant="ghost"
                disabled={currentPage === totalPages}
                onClick={() => handlePageClick(currentPage + 1)}
                className="group font-season uppercase tracking-widest text-xs h-10 px-6 rounded-full hover:bg-primary/10"
            >
                <HugeiconsIcon
                    icon={AllIcons.ArrowRight01Icon}
                    size={20}
                    strokeWidth={1.5}
                    className="text-foreground/80 group-hover:text-primary transition-colors"
                />
            </Button>
        </div>
    );
};

export default Pagination;
