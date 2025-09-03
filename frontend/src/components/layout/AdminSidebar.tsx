import React, { useState, useMemo, memo, useCallback, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
    LayoutDashboard, Users, Sprout, BarChart3,
    Shield, Settings, LogOut, User, X, Plus,
    FileText, MapPin, Warehouse, Truck, ChevronDown, Leaf
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { useAuth } from '@/context/AuthContext';
import ConfirmationLogout from '../dashboard/ConfirmationLogout';

// Types
interface SidebarItem {
    id: string;
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    children?: SidebarItem[];
    isSectionHeader?: boolean;
}

interface SidebarProps {
    className?: string;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    isMobileOpen?: boolean;
    onMobileToggle?: () => void;
}

interface SidebarItemProps {
    item: SidebarItem;
    isActive: boolean;
    isExpanded: boolean;
    hasActiveChild: boolean;
    onItemClick: (item: SidebarItem) => void;
    onToggleExpand: (itemId: string) => void;
    isCollapsed?: boolean;
    onTemporaryExpand: (shouldExpand: boolean) => void;
    isTemporarilyExpanded?: boolean;
}

// Memoized sidebar item component
const SidebarItemComponent = memo(({
    item,
    isActive,
    isExpanded,
    hasActiveChild,
    onItemClick,
    onToggleExpand,
    isCollapsed = false,
    onTemporaryExpand,
    isTemporarilyExpanded = false
}: SidebarItemProps) => {
    const hasChildren = item.children && item.children.length > 0;
    const location = useLocation();

    // Handle section headers differently
    if (item.isSectionHeader) {
        if (isCollapsed && !isTemporarilyExpanded) return null;
        return (
            <div className={cn(
                "px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                "mt-4 first:mt-0"
            )}>
                {item.title}
            </div>
        );
    }

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (hasChildren) {
            if (isCollapsed && !isTemporarilyExpanded) {
                // if collapsed and has children, request temporary expansion
                onTemporaryExpand(true);
                // small delay to allow expansion animation before showing children
                setTimeout(() => onToggleExpand(item.id), 50);
            } else {
                onToggleExpand(item.id);
            }
        } else {
            onItemClick(item);
            // collapse temporary expansion after selection
            if (isTemporarilyExpanded) {
                onTemporaryExpand(false);
            }
        }
    };

    // Check if this item or any of its children is active
    const isItemOrChildActive = isActive || hasActiveChild;

    const linkElement = (
        <div className="relative">
            <Link
                to={item.href}
                onClick={handleClick}
                className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    'hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                    isItemOrChildActive && 'bg-primary/10 text-primary font-semibold',
                    isCollapsed && 'justify-center px-2'
                )}
                aria-current={isActive ? 'page' : undefined}
            >
                <div className={cn("flex items-center space-x-3 overflow-hidden", isCollapsed && "space-x-0")}>
                    <item.icon className={cn("h-4 w-4 flex-shrink-0", isItemOrChildActive && "text-primary")} />
                    {!isCollapsed && <span className="truncate">{item.title}</span>}
                </div>

                {!isCollapsed && (
                    <div className="flex items-center space-x-1">
                        {item.badge !== undefined && item.badge !== '' && (
                            <Badge
                                variant={isItemOrChildActive ? "default" : "secondary"}
                                className="h-5 min-w-[20px] text-xs flex items-center justify-center"
                            >
                                {item.badge}
                            </Badge>
                        )}
                        {hasChildren && (
                            <ChevronDown
                                className={cn(
                                    "h-3 w-3 transition-transform duration-200",
                                    isExpanded ? "rotate-180" : "",
                                    isItemOrChildActive ? "text-primary" : "text-muted-foreground"
                                )}
                            />
                        )}
                    </div>
                )}
            </Link>

            {/* Active indicator bar */}
            {isItemOrChildActive && (
                <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-md bg-primary"></div>
            )}
        </div>
    );

    // Wrap with tooltip only when collapsed
    if (isCollapsed && !isTemporarilyExpanded) {
        return (
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    {linkElement}
                </TooltipTrigger>
                <TooltipContent side="right" align="center" className="flex items-center gap-1">
                    {item.title}
                    {item.badge && (
                        <Badge variant="secondary" className="h-4 px-1 text-xs">
                            {item.badge}
                        </Badge>
                    )}
                </TooltipContent>
            </Tooltip>
        );
    }

    return (
        <div>
            {linkElement}

            {hasChildren && isExpanded && (!isCollapsed || isTemporarilyExpanded) && (
                <div className="mt-1 ml-6 space-y-1 border-l-2 border-primary/20 pl-4">
                    {item.children!.map((child) => (
                        <SidebarItemComponent
                            key={child.id}
                            item={child}
                            isActive={location.pathname === child.href}
                            hasActiveChild={false}
                            isExpanded={false}
                            onItemClick={onItemClick}
                            onToggleExpand={onToggleExpand}
                            isCollapsed={isCollapsed}
                            onTemporaryExpand={onTemporaryExpand}
                            isTemporarilyExpanded={isTemporarilyExpanded}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

SidebarItemComponent.displayName = 'SidebarItemComponent';

// Main sidebar component
export function AdminSidebar({
    className,
    isCollapsed,
    isMobileOpen = false,
    onMobileToggle,
}: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    const [isTemporarilyExpanded, setIsTemporarilyExpanded] = useState(false);

    // Generate Mazao-specific sidebar items
    const sidebarItems: SidebarItem[] = useMemo(() => [
        {
            id: 'dashboard',
            title: 'Dashboard',
            href: '/admin',
            icon: LayoutDashboard,
        },
        {
            id: 'section-farmers',
            title: 'Farmer Management',
            isSectionHeader: true,
            href: '#',
            icon: Users,
        },
        {
            id: 'farmers',
            title: 'Farmers',
            href: '/admin/farmers',
            icon: Users,
            children: [
                { id: 'all-farmers', title: 'All Farmers', href: '/admin/farmers', icon: Users },
                { id: 'new-farmers', title: 'New Farmers', href: '/admin/farmers/new', icon: User },
            ],
        },
        {
            id: 'section-crops',
            title: 'Crop Management',
            isSectionHeader: true,
            href: '#',
            icon: Sprout,
        },
        {
            id: 'crops',
            title: 'Crops',
            href: '/admin/crops',
            icon: Sprout,
            children: [
                { id: 'all-crops', title: 'All Crops', href: '/admin/crops', icon: Sprout },
                { id: 'add-crop', title: 'Add Crop', href: '/admin/crops/new', icon: Plus },
            ],
        },
        {
            id: 'section-analytics',
            title: 'Analytics & Reports',
            isSectionHeader: true,
            href: '#',
            icon: BarChart3,
        },
        {
            id: 'analytics',
            title: 'Analytics',
            href: '/admin/analytics',
            icon: BarChart3,
            children: [
                { id: 'yield-reports', title: 'Yield Reports', href: '/admin/analytics/yield', icon: BarChart3 },
                { id: 'financial-reports', title: 'Financial Reports', href: '/admin/analytics/financial', icon: FileText },
                { id: 'regional-data', title: 'Regional Data', href: '/admin/analytics/regional', icon: MapPin },
            ],
        },
        {
            id: 'section-operations',
            title: 'Operations',
            isSectionHeader: true,
            href: '#',
            icon: Warehouse,
        },
        {
            id: 'operations',
            title: 'Operations',
            href: '/admin/operations',
            icon: Warehouse,
            children: [
                { id: 'inventory', title: 'Inventory', href: '/admin/operations/inventory', icon: Warehouse },
                { id: 'logistics', title: 'Logistics', href: '/admin/operations/logistics', icon: Truck },
                { id: 'procurement', title: 'Procurement', href: '/admin/operations/procurement', icon: FileText },
            ],
        },
        {
            id: 'section-admin',
            title: 'Administration',
            isSectionHeader: true,
            href: '#',
            icon: Shield,
        },
        {
            id: 'system',
            title: 'System Settings',
            href: '/admin/settings',
            icon: Settings,
            children: [
                { id: 'users', title: 'User Management', href: '/admin/settings/users', icon: Users },
                { id: 'system-settings', title: 'System Config', href: '/admin/settings/system', icon: Settings },
                { id: 'audit-logs', title: 'Audit Logs', href: '/admin/settings/audit', icon: FileText },
            ],
        },
    ], []);

    // Check if an item has an active child
    const hasActiveChild = useCallback((item: SidebarItem): boolean => {
        if (item.children) {
            return item.children.some(child =>
                location.pathname === child.href || hasActiveChild(child)
            );
        }
        return false;
    }, [location.pathname]);

    // Handle item click
    const handleItemClick = useCallback((item: SidebarItem) => {
        navigate(item.href);
        // Auto-collapse sidebar on mobile after selection
        if (window.innerWidth < 768 && onMobileToggle) {
            onMobileToggle();
        }
        // Collapse temporary expansion after selection
        if (isTemporarilyExpanded) {
            setIsTemporarilyExpanded(false);
        }
    }, [navigate, onMobileToggle, isTemporarilyExpanded]);

    // Toggle expanded state for items with children
    const handleToggleExpand = useCallback((itemId: string) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    }, []);

    // Handle temporary expansion
    const handleTemporaryExpand = useCallback((shouldExpand: boolean) => {
        setIsTemporarilyExpanded(shouldExpand);
    }, []);

    // Handle logout with confirmation
    const handleLogout = useCallback(() => {
        setIsLogoutDialogOpen(true);
    }, []);

    const confirmLogout = useCallback(() => {
        logout();
        setIsLogoutDialogOpen(false);
    }, [logout]);

    // Auto-expand parent items when a child is active
    useEffect(() => {
        const findAndExpandParent = (items: SidebarItem[], targetPath: string): string | null => {
            for (const item of items) {
                if (item.children) {
                    for (const child of item.children) {
                        if (child.href === targetPath) {
                            return item.id;
                        }
                    }
                    const foundInChild = findAndExpandParent(item.children, targetPath);
                    if (foundInChild) {
                        return item.id;
                    }
                }
            }
            return null;
        };

        const parentId = findAndExpandParent(sidebarItems, location.pathname);
        if (parentId) {
            setExpandedItems(prev => new Set(prev).add(parentId));
        }
    }, [location.pathname, sidebarItems]);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const sidebar = document.querySelector('[data-sidebar]');
            if (isMobileOpen && sidebar && !sidebar.contains(event.target as Node)) {
                onMobileToggle?.();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileOpen, onMobileToggle]);

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileOpen]);

    return (
        <>
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={onMobileToggle}
                />
            )}

            <aside
                data-sidebar
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out',
                    'md:relative',
                    isCollapsed ? 'w-16' : 'w-64',
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
                    className
                )}
            >
                {/* Header with logo and collapse button */}
                <div className={cn(
                    "flex h-16 items-center border-b px-4",
                    isCollapsed ? "justify-center" : "justify-between"
                )}>
                    {!isCollapsed ? (
                        <Link to="/admin">
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                                    <Leaf className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-semibold">Mazao ERP</h1>
                                    <p className="text-xs text-muted-foreground">Admin Portal</p>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <Link to="/admin">
                            <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                                <Leaf className="h-5 w-5 text-white" />
                            </div>
                        </Link>
                    )}

                    <button
                        onClick={onMobileToggle}
                        className="rounded-md p-1.5 hover:bg-accent md:hidden"
                        aria-label="Close sidebar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation items */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4">
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <SidebarItemComponent
                                key={item.id}
                                item={item}
                                isActive={location.pathname === item.href}
                                hasActiveChild={hasActiveChild(item)}
                                isExpanded={expandedItems.has(item.id)}
                                onItemClick={handleItemClick}
                                onToggleExpand={handleToggleExpand}
                                isCollapsed={isCollapsed}
                                onTemporaryExpand={handleTemporaryExpand}
                            />
                        ))}
                    </div>
                </nav>

                {/* User footer */}
                <div className="border-t p-4">
                    <div className={cn(
                        "flex items-center",
                        isCollapsed ? "justify-center" : "justify-between"
                    )}>
                        <div className={cn(
                            "flex items-center",
                            isCollapsed ? "space-x-0" : "space-x-3"
                        )}>
                            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                                <User className="h-4 w-4" />
                            </div>
                            {!isCollapsed && (
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium truncate">
                                        {user?.profile?.fullName || 'Admin User'}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {user?.email || 'admin@mazao.com'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {!isCollapsed && (
                            <button
                                onClick={handleLogout}
                                className="rounded-md p-1.5 hover:bg-accent"
                                aria-label="Logout"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Logout Confirmation Dialog */}
            <ConfirmationLogout
                isLogoutDialogOpen={isLogoutDialogOpen}
                setIsLogoutDialogOpen={setIsLogoutDialogOpen}
                confirmLogout={confirmLogout}
            />
        </>
    );
}