import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
    title?: string;
    children: React.ReactNode;
    variant?: 'info' | 'success' | 'warning' | 'error';
    isBorderless?: boolean;
    onClose?: () => void;
    className?: string;
}

export const Alert: React.FC<AlertProps> = ({
    title,
    children,
    variant = 'info',
    isBorderless = false,
    onClose,
    className = ''
}) => {
    const variants = {
        info: {
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            text: "text-blue-400",
            icon: <Info className="w-5 h-5 text-blue-400" />
        },
        success: {
            bg: "bg-success/10",
            border: "border-success/20",
            text: "text-success-soft",
            icon: <CheckCircle2 className="w-5 h-5 text-success-soft" />
        },
        warning: {
            bg: "bg-warning/10",
            border: "border-warning/20",
            text: "text-warning-soft",
            icon: <AlertTriangle className="w-5 h-5 text-warning-soft" />
        },
        error: {
            bg: "bg-red-500/10",
            border: "border-red-500/20",
            text: "text-red-400",
            icon: <AlertCircle className="w-5 h-5 text-red-400" />
        }
    };

    const v = variants[variant];

    return (
        <div className={`
            flex gap-3 p-4 rounded-lg transition-all duration-300
            ${v.bg} ${v.text}
            ${isBorderless ? 'border-none' : `border ${v.border}`}
            ${className}
        `}>
            <div className="flex-shrink-0 mt-0.5">
                {v.icon}
            </div>
            <div className="flex-grow">
                {title && <h4 className="font-bold text-sm mb-1">{title}</h4>}
                <div className="text-sm opacity-90">{children}</div>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity h-fit"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export const Notification: React.FC<AlertProps> = (props) => {
    return (
        <Alert
            {...props}
            className={`shadow-2xl shadow-black/50 backdrop-blur-md ${props.className || ''}`}
        />
    );
};
