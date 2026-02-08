import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sidebar } from './Sidebar';
import { Menu, X, Sun, Moon, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <main className={`flex-1 relative overflow-y-auto w-full transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
                <header className="sticky top-0 z-40 w-full border-b border-border bg-background/50 backdrop-blur-md px-8 py-4 flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <div className="h-6 w-px bg-border mx-2" />
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 group cursor-pointer px-4 py-2 rounded-xl bg-secondary border border-border hover:border-brand-500/30 transition-all"
                        >
                            <UserCircle size={18} className="text-muted-foreground group-hover:text-brand-500" />
                            <span className="text-xs font-bold text-foreground">Profil</span>
                        </button>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
};
