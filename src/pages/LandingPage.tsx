import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

const LandingPage: React.FC = () => {
    const { login } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white p-6">
            <div className="max-w-md w-full text-center space-y-8">
                <h1 className="text-5xl font-bold tracking-tighter">
                    Welcome
                </h1>
                <p className="text-gray-400">
                    Please sign in to continue to your dashboard.
                </p>
                <Button
                    onClick={() => login()}
                    variant="primary"
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-background font-bold py-4 rounded-xl transition-all"
                >
                    Login to System
                </Button>
            </div>
        </div>
    );
};

export default LandingPage;
