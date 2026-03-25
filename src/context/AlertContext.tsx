import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Alert, AlertTitle, AlertDescription, AlertAction } from '@/components/ui/alert';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert01Icon, Tick01Icon, InformationCircleIcon, Cancel01Icon } from '@hugeicons/core-free-icons';

type AlertVariant = 'default' | 'destructive' | 'success';

interface AlertItem {
    id: string;
    title?: string;
    description: string;
    variant?: AlertVariant;
    duration?: number;
}

interface AlertContextType {
    showAlert: (params: Omit<AlertItem, 'id'>) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);

    const removeAlert = useCallback((id: string) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, []);

    const showAlert = useCallback((params: Omit<AlertItem, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        const { duration = 5000 } = params;

        setAlerts((prev) => [...prev, { ...params, id }]);

        if (duration !== Infinity) {
            setTimeout(() => {
                removeAlert(id);
            }, duration);
        }
    }, [removeAlert]);

    const getIcon = (variant?: AlertVariant) => {
        switch (variant) {
            case 'destructive':
                return Alert01Icon;
            case 'success':
                return Tick01Icon;
            default:
                return InformationCircleIcon;
        }
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <div className="fixed bottom-4 right-4 z-9999 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
                {alerts.map((alert) => (
                    <Alert
                        key={alert.id}
                        variant={alert.variant === 'success' ? 'default' : alert.variant}
                        className={`pointer-events-auto animate-in slide-in-from-right-full duration-300 border-border bg-background shadow-2xl ${alert.variant === 'success' ? 'border-success/50' : ''}`}
                    >
                        <HugeiconsIcon
                            icon={getIcon(alert.variant)}
                            className={alert.variant === 'destructive' ? 'text-destructive' : alert.variant === 'success' ? 'text-green-500' : 'text-secondary'}
                        />
                        {alert.title && <AlertTitle className="font-season-mix">{alert.title}</AlertTitle>}
                        <AlertDescription className="font-matter">{alert.description}</AlertDescription>
                        <AlertAction className="p-0.5 hover:bg-white/5 rounded-md transition-colors cursor-pointer" onClick={() => removeAlert(alert.id)}>
                            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5 text-muted-foreground" />
                        </AlertAction>
                    </Alert>
                ))}
            </div>
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};
