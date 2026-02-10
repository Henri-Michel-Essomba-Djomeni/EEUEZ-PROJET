import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sidebar } from './Sidebar';
import {
    Menu,
    X,
    Sun,
    Moon,
    UserCircle,
    Search,
    Bell,
    Settings,
    LogOut,
    User,
    CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <main className={`flex-1 relative h-screen overflow-y-auto w-full transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-6 flex-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </Button>

                        {/* Search Bar */}
                        <div className="hidden md:flex relative max-w-md w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Rechercher un cours, un outil..."
                                className="pl-10 h-10 w-full bg-muted/50 border-transparent focus:bg-background focus:border-primary/30 transition-all rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="text-muted-foreground hover:text-primary rounded-xl"
                        >
                            {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
                        </Button>

                        {/* Notifications */}
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-primary rounded-xl"
                            >
                                <Bell size={19} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
                            </Button>
                        </div>

                        <div className="h-4 w-px bg-border mx-1" />

                        {/* Profile Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-fit pl-1.5 pr-3 rounded-xl hover:bg-accent flex items-center gap-2 group border border-transparent hover:border-border">
                                    <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                        <AvatarFallback className="premium-gradient text-white text-xs font-bold">
                                            {user?.name ? getInitials(user.name) : <User size={16} />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="hidden lg:flex flex-col items-start leading-none gap-1">
                                        <span className="text-xs font-bold truncate pr-1">{user?.name}</span>
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{user?.role}</span>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profil</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/certifications')}>
                                        <div className="mr-2 h-4 w-4 flex items-center justify-center">
                                            <CreditCard className="h-4 w-4" />
                                        </div>
                                        <span>Certifications</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Paramètres</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Se déconnecter</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
};
