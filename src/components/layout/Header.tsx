import { useAuth } from '../../context/AuthContext';
import { LogIn, UserPlus, LogOut, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

const Header: React.FC = () => {
    const { user, login, logout } = useAuth();

    return (
        <header className="glass-header">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 border border-accent/20 rounded-lg text-accent">
                        <Layout className="w-5 h-5" />
                    </div>
                    <Link to="/" className="text-xl font-bold tracking-tight text-white hover:text-accent transition-colors duration-300 font-season-mix">
                        Neura Agents
                    </Link>
                </div>
                <nav className="flex items-center gap-4">
                    {user ? (
                        <>
                            <div className="hidden md:flex items-center gap-6 mr-4 border-r border-white/10 pr-6">
                                <Link to="/ui-components" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2 group font-matter">
                                    <Layout className="w-4 h-4 group-hover:text-accent" />
                                    UI Kit
                                </Link>
                                <Link to="/profile" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2 group font-matter">
                                    <UserPlus className="w-4 h-4 group-hover:text-accent" />
                                    Profile
                                </Link>
                            </div>
                            <span className="text-xs font-medium text-gray-400 hidden sm:inline-block">
                                {user.username}
                            </span>
                            <Button
                                onClick={logout}
                                variant="ghost"
                                size="md"
                                className="gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={() => login()}
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                            >
                                <LogIn className="w-4 h-4" />
                                Login
                            </Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
