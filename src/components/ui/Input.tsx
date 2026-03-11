import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    className = '',
    required,
    ...props
}) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="text-xs font-bold capitalize text-gray-400 ml-0.5">
                    {label} {required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}
            <input
                className={`w-full px-3 py-2 bg-white/5 border border-white/10 rounded-[6px] text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-accent transition-all duration-200 outline-none ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && (
                <span className="text-[10px] font-bold text-red-500 capitalize ml-0.5 mt-0.5">
                    {error}
                </span>
            )}
        </div>
    );
};
