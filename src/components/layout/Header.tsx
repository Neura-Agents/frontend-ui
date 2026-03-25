import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Login01Icon } from '@hugeicons/core-free-icons';

import Logo from '../reusable/Logo';

const Header: React.FC = () => {
    const { login } = useAuth();
    const location = useLocation();
    const from = location.state?.from || "/agents";

    return (
        <header className="app-header">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Logo />
                <nav className="flex items-center gap-4">
                    <Button
                        onClick={() => login('', from)}
                        variant="ghost"
                        size="default"
                        className="gap-2 hover:cursor-pointer"
                    >
                        <HugeiconsIcon icon={Login01Icon} />
                        Login
                    </Button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
