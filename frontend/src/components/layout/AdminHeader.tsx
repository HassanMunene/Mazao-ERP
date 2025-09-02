import { useState, useMemo, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell, Search, Settings, User, LogOut,
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme-provider';
import { useAuth } from '@/context/AuthContext';

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

// Notification item component
const NotificationItem = memo(({ notification }: {
    notification: {
        id: string;
        title: string;
        description: string;
        time: string;
        type: 'info' | 'warning' | 'success';
    };
}) => {
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'warning':
                return <Bell className="h-4 w-4 text-yellow-500" />;
            case 'success':
                return <Bell className="h-4 w-4 text-green-500" />;
            default:
                return <Bell className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <div className="flex items-start space-x-3 p-3 rounded-lg transition-colors hover:bg-accent cursor-pointer">
            <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 space-y-1 min-w-0">
                <p className="text-sm font-medium leading-none truncate">
                    {notification.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                    {notification.description}
                </p>
                <p className="text-xs text-muted-foreground">
                    {notification.time}
                </p>
            </div>
        </div>
    );
});

NotificationItem.displayName = 'NotificationItem';

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

    // Sample notifications for Mazao ERP
    const notifications = useMemo(() => [
        {
            id: '1',
            title: 'New Farmer Registration',
            description: '5 new farmers registered today',
            time: '2 hours ago',
            type: 'success' as const
        },
        {
            id: '2',
            title: 'Harvest Alert',
            description: 'Maize ready for harvest in Nakuru',
            time: '5 hours ago',
            type: 'info' as const
        },
        {
            id: '3',
            title: 'Low Inventory',
            description: 'Fertilizer stock running low',
            time: '1 day ago',
            type: 'warning' as const
        }
    ], []);

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

    const handleLogout = useCallback(() => {
        logout();
        navigate('/login');
    }, [logout, navigate]);

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

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <Badge
                                    variant="destructive"
                                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                                >
                                    {notifications.length}
                                </Badge>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80 p-0" align="end">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="font-semibold">Notifications</h3>
                                <Badge variant="secondary">{notifications.length} New</Badge>
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map(notification => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                    />
                                ))}
                            </div>

                            <div className="p-2 border-t">
                                <Button variant="ghost" className="w-full">
                                    View all notifications
                                </Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

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
        </>
    );
}