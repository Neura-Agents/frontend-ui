import React, { useState, useMemo, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import * as AllIcons from '@hugeicons/core-free-icons';
import { Typography } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Copy, Check } from 'lucide-react';
import { useAlert } from '@/context/AlertContext';
import { cn } from '@/lib/utils';
import Pagination from '@/components/ui/pagination';
import FilterChips from '@/components/ui/filter-chips';

// Category mapping based on icon name prefixes
const CATEGORY_MAP: Record<string, string[]> = {
    'AI & Brain': ['Ai', 'ArtificialIntelligence', 'Brain', 'Bot', 'Robot', 'BrainCog'],
    'Communication': ['Chat', 'Mail', 'Message', 'Call', 'Notification', 'BubbleChat', 'Communication', 'Signal', 'Wifi', 'Contact'],
    'Arrows': ['Arrow', 'LinearArrow', 'Direction', 'Move', 'Expand', 'Shrink'],
    'Users & Teams': ['User', 'Team', 'Account', 'Person', 'Profile', 'Member', 'Group', 'Individual'],
    'Media & Audio': ['Audio', 'Music', 'Video', 'Image', 'Camera', 'Volume', 'Play', 'Record', 'Microphone', 'Speaker', 'Tv', 'Cinema'],
    'Business & Fin': ['Business', 'Money', 'Bank', 'Card', 'Chart', 'Analytics', 'Bitcoin', 'Invoice', 'Profit', 'Tax', 'Wallet', 'Dollar', 'Euro', 'Coin', 'Trophy', 'Award'],
    'Devices': ['Phone', 'Computer', 'Laptop', 'Watch', 'Tablet', 'Device', 'Smart', 'Mouse', 'Keyboard', 'Webcam', 'Chip', 'Cpu'],
    'Files & Folders': ['File', 'Folder', 'Archive', 'Zip', 'Document', 'Copy', 'Paste', 'Note', 'Paper'],
    'Interface & UI': ['Settings', 'Menu', 'Search', 'Home', 'Add', 'Remove', 'Alert', 'Cancel', 'Check', 'Close', 'Delete', 'Edit', 'Lock', 'Unlock', 'Select', 'Filter', 'Sort', 'Tab', 'Layout'],
    'Commerce': ['Cart', 'Store', 'Shopping', 'Delivery', 'Shipping', 'Package', 'Price', 'Tag', 'Discount', 'Sale', 'Ticket'],
    'Content': ['Text', 'Paragraph', 'Font', 'Format', 'Align', 'Border', 'Pen', 'Brush', 'Color', 'Paint'],
    'Health & Nature': ['Blood', 'Medical', 'Health', 'Bone', 'Medicine', 'Pill', 'Doctor', 'Hospital', 'Stethoscope', 'Leaf', 'Tree', 'Plant', 'Flower', 'Animal', 'Dog', 'Cat', 'Fish', 'Bird'],
    'Food & Drink': ['Bread', 'Cake', 'Candy', 'Drink', 'Fruit', 'Vegetable', 'Coffee', 'Restaurant', 'Beer', 'Wine', 'Pizza', 'Burger', 'Chef'],
    'Maps & Travel': ['Location', 'Map', 'Navigation', 'Pin', 'Compass', 'Airport', 'Airplane', 'Train', 'Bus', 'Car', 'Truck', 'Bike', 'Bicycle', 'Ship', 'Boat', 'Hotel', 'Ticket'],
    'Weather': ['Cloud', 'Sun', 'Moon', 'Rain', 'Snow', 'Wind', 'Weather', 'Temperature', 'Thunder', 'Storm', 'Sunrise', 'Sunset'],
    'Logos': ['Google', 'Apple', 'Facebook', 'Twitter', 'Github', 'Discord', 'Slack', 'Linkedin', 'Instagram', 'Youtube', 'Netflix', 'Spotify', 'Amazon', 'Airbnb', 'Figma', 'Adobe', 'Tailwind', 'React', 'Vue', 'Angular', 'Svelte'],
};

const getCategoryForIcon = (name: string): string => {
    for (const [category, prefixes] of Object.entries(CATEGORY_MAP)) {
        if (prefixes.some(prefix => name.startsWith(prefix))) {
            return category;
        }
    }
    return 'Other';
};

// Array of icon names to exclude from the gallery
const HIDDEN_ICONS = [
    'ListAllHiddenIconNames'
];

// Filter for icon exports and pre-categorize
const iconEntries = Object.entries(AllIcons).filter(([key, value]) =>
    key.endsWith('Icon') &&
    Array.isArray(value) &&
    !HIDDEN_ICONS.includes(key)
).map(([name, data]) => ({
    name,
    data,
    category: getCategoryForIcon(name)
}));

const categories = ['All', ...Object.keys(CATEGORY_MAP), 'Other'];

interface IconGalleryProps {
    /** Total number of icons to show per page */
    pageSize?: number;
    /** Columns on small screens (< 768px) */
    sm?: number;
    /** Columns on medium screens (>= 768px) */
    md?: number;
    /** Columns on large screens (>= 1024px) */
    lg?: number;
    /** Alias for lg columns for backward compatibility */
    columns?: number;
    /** Alias for when this component is used for selecting icons */
    selectMode?: boolean;
    /** Callback when an icon is selected (only used in selectMode) */
    onSelect?: (name: string) => void;
    /** The currently selected icon name */
    selectedIcon?: string;
    /** Optional className for the container */
    className?: string;
}

const IconGallery: React.FC<IconGalleryProps> = ({
    pageSize = 120,
    sm = 2,
    md = 4,
    lg = 8,
    columns,
    selectMode = false,
    onSelect,
    selectedIcon,
    className
}) => {
    const finalLg = columns || lg;
    const [currentCols, setCurrentCols] = useState(sm);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setCurrentCols(finalLg);
            else if (window.innerWidth >= 768) setCurrentCols(md);
            else setCurrentCols(sm);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sm, md, finalLg]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { showAlert } = useAlert();

    const filteredIcons = useMemo(() => {
        return iconEntries.filter((icon) => {
            const matchesSearch = icon.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || icon.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [search, selectedCategory]);

    const totalPages = Math.ceil(filteredIcons.length / pageSize);

    const displayedIcons = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredIcons.slice(start, start + pageSize);
    }, [filteredIcons, currentPage, pageSize]);

    const handleClick = (name: string) => {
        if (selectMode) {
            onSelect?.(name);
            return;
        }

        navigator.clipboard.writeText(name);
        setCopiedIcon(name);
        showAlert({
            title: "Copied!",
            description: `${name} copied to clipboard`,
            variant: "default"
        });
        setTimeout(() => setCopiedIcon(null), 2000);
    };

    // Reset to page 1 searching or changing category
    const handleSearch = (val: string) => {
        setSearch(val);
        setCurrentPage(1);
    };

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    };

    return (
        <div className={cn("container mx-auto px-2 py-2 max-w-7xl animate-in fade-in duration-700 space-y-24", className)}>

            <div className="z-20 space-y-6 pb-6 pt-4 m-0">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search icons..."
                        className="pl-10 bg-card/50 border-border focus:ring-primary/50"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                <FilterChips
                    options={categories}
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                />

                {filteredIcons.length >= 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Badge variant="soft">
                            {filteredIcons.length}
                        </Badge>
                        <span>icons found in this category</span>
                        {totalPages > 1 && (
                            <span className="ml-auto text-primary/60">
                                Page {currentPage} of {totalPages}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div
                className="grid gap-4 m-0"
                style={{
                    gridTemplateColumns: `repeat(${currentCols}, minmax(0, 1fr))`
                }}
            >
                {displayedIcons.map(({ name, data }) => (
                    <Card
                        key={name}
                        className={cn(
                            "group relative py-6 flex flex-col items-center justify-center gap-4 bg-card/30 border-border hover:border-primary/30 hover:bg-card/50 transition-all duration-300 cursor-pointer",
                            selectMode && selectedIcon === name && "ring-0 bg-primary/10 border-primary border",
                            selectMode && "py-2"
                        )}
                        onClick={() => handleClick(name)}
                    >
                        <HugeiconsIcon
                            icon={data as any}
                            size={selectMode ? 24 : 32}
                            strokeWidth={1.5}
                            className={cn("text-foreground/80 group-hover:text-primary transition-colors", selectMode && selectedIcon === name && "text-primary")}
                        />
                        {
                            !selectMode && (
                                <>
                                    <Typography className="text-[10px] text-center text-muted-foreground group-hover:text-foreground font-mono truncate w-full px-2">
                                        {name}
                                    </Typography>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {copiedIcon === name ? (
                                            <Check className="w-3 h-3 text-primary" />
                                        ) : (
                                            <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                                        )}
                                    </div>
                                </>
                            )
                        }

                    </Card>
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {filteredIcons.length === 0 && (
                <div className="text-center py-24 space-y-4">
                    <Typography scale="xl" className="text-muted-foreground">
                        No icons found matching your filters
                    </Typography>
                    <Button variant="ghost" onClick={() => { setSearch(''); setSelectedCategory('All'); }}>Clear all filters</Button>
                </div>
            )}
        </div>
    );
};

export default IconGallery;
