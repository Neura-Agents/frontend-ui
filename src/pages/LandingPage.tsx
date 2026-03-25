import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Typography } from '@/components/ui/typography';

const LandingPage: React.FC = () => {
    const { login, user } = useAuth();
    const location = useLocation();
    
    const from = location.state?.from || new URLSearchParams(location.search).get('from') || "/agents";

    // If the user is already logged in, they shouldn't be here
    // Redirect them to where they came from or /agents
    if (user) {
        return <Navigate to={from} replace />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="max-w-md w-full text-center space-y-8">
                <Typography font="season-mix" as="h1" scale="5xl" weight="bold">
                    Welcome
                </Typography>
                <p className="text-gray-400">
                    Please sign in to continue to your dashboard.
                </p>
                <Button
                    onClick={() => login('', from)}
                    variant="default"
                    size="lg"
                    className="w-full font-bold py-6 rounded-xl transition-all"
                >
                    Login to System
                </Button>
            </div>
        </div>
    );
};

export default LandingPage;
