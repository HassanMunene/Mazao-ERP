import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Settings, User, LogOut,
    Sun, Moon, X, Menu, PanelRightOpen, PanelRightClose
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme-provider';
import { useAuth } from '@/context/AuthContext';

import ConfirmationLogout from '../dashboard/ConfirmationLogout';

interface HeaderProps {
    title?: string;
    onMenuToggle?: () => void;
    showMobileMenu?: boolean;
    onSearch?: (query: string) => void;
    className?: string;
    isSidebarCollapsed?: boolean;
    onSidebarToggle?: () => void;
    showSidebarToggle?: boolean;
}

// Main header component
export function AdminHeader({
    onMenuToggle,
    showMobileMenu = false,
    onSearch,
    className,
    isSidebarCollapsed = false,
    onSidebarToggle,
}: HeaderProps) {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);


    // Handle logout with confirmation
    const handleLogout = useCallback(() => {
        setIsLogoutDialogOpen(true);
    }, []);

    const confirmLogout = useCallback(() => {
        logout();
        setIsLogoutDialogOpen(false);
    }, [logout]);


    // Debounced search
    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query);
        onSearch?.(query);
    }, [onSearch]);

    const toggleTheme = useCallback(() => {
        console.log("Ypoooo")
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }, [theme, setTheme]);

    const toggleMobileSearch = useCallback(() => {
        setShowMobileSearch(prev => !prev);
    }, []);

    return (
        <>
            {/* Mobile search overlay */}
            {showMobileSearch && (
                <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden flex items-center p-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search farmers, crops, reports..."
                            className="pl-9 pr-12"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            autoFocus
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
                            onClick={toggleMobileSearch}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            )}

            <header className={cn(
                "flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6 sticky top-0 z-30",
                className
            )}>
                {/* Left section */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Mobile menu button */}
                    {onMenuToggle && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={onMenuToggle}
                            aria-label={showMobileMenu ? "Close menu" : "Open menu"}
                        >
                            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    )}
                    <button
                        onClick={onSidebarToggle}
                        className="hidden md:flex rounded-md p-1.5 hover:bg-accent"
                        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isSidebarCollapsed ? (
                            <PanelRightClose className="h-5 w-5" />
                        ) : (
                            <PanelRightOpen className="h-5 w-5" />
                        )}
                    </button>

                    <h1 className="text-xl font-semibold text-green-800">
                        {user?.profile?.fullName}
                    </h1>
                </div>

                {/* Center section - Search */}
                <div className="hidden lg:flex flex-1 max-w-2xl mx-6">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search farmers, crops, reports..."
                            className="pl-9 pr-4"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
                                onClick={() => handleSearchChange('')}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                    {/* Mobile search button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={toggleMobileSearch}
                        aria-label="Search"
                    >
                        <Search className="h-5 w-5" />
                    </Button>

                    {/* Theme toggle */}
                    <Button
                        className='cursor-pointer'
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9">
                                <div className="h-8 w-8 flex items-center justify-center">
                                    <User className="h-4 w-4 text-green-800" />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel className="font-normal p-4">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {user?.profile?.fullName || 'Admin User'}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground capitalize">
                                        {user?.role}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            {/* confirm logout modal */}
            <ConfirmationLogout
                isLogoutDialogOpen={isLogoutDialogOpen}
                setIsLogoutDialogOpen={setIsLogoutDialogOpen}
                confirmLogout={confirmLogout}
            />
        </>
    );
}