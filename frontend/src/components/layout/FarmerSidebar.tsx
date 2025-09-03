import React, { useState, useMemo, memo, useCallback, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
    LayoutDashboard, User, LogOut, X,
    ChevronDown, Leaf, Sprout, Plus
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

// Memoized sidebar item component (same as AdminSidebar)
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

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (hasChildren) {
            if (isCollapsed && !isTemporarilyExpanded) {
                // First expand the sidebar temporarily
                onTemporaryExpand(true);
                // Then expand the menu item
                onToggleExpand(item.id);
            } else {
                // Normal toggle for expanded sidebar
                onToggleExpand(item.id);
            }
        } else {
            // For items without children, navigate and collapse temporary expansion
            onItemClick(item);
            if (isTemporarilyExpanded) {
                onTemporaryExpand(false);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e as unknown as React.MouseEvent);
        }
    };

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

    // Check if this item or any of its children is active
    const isItemOrChildActive = isActive || hasActiveChild;

    const linkElement = (
        <div className="relative">
            <Link
                to={item.href}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-expanded={hasChildren ? isExpanded : undefined}
                className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    'hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                    isItemOrChildActive && 'bg-primary/10 text-primary font-semibold',
                    (isCollapsed && !isTemporarilyExpanded) && 'justify-center px-2'
                )}
                aria-current={isActive ? 'page' : undefined}
            >
                <div className={cn("flex items-center space-x-3 overflow-hidden", isCollapsed && "space-x-0")}>
                    <item.icon className={cn("h-4 w-4 flex-shrink-0", isItemOrChildActive && "text-primary")} />
                    {(!isCollapsed || isTemporarilyExpanded) && <span className="truncate">{item.title}</span>}
                </div>

                {(!isCollapsed || isTemporarilyExpanded) && (
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

// Main sidebar component for Farmer
export function FarmerSidebar({
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

    // Generate Farmer-specific sidebar items
    const sidebarItems: SidebarItem[] = useMemo(() => [
        {
            id: 'dashboard',
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
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
            title: 'My Crops',
            href: '/dashboard/crops',
            icon: Sprout,
            children: [
                { id: 'all-crops', title: 'View All Crops', href: '/dashboard/crops', icon: Sprout },
                { id: 'add-crop', title: 'Add New Crop', href: '/dashboard/crops/new', icon: Plus },
            ],
        },
        {
            id: 'section-profile',
            title: 'Profile Management',
            isSectionHeader: true,
            href: '#',
            icon: User,
        },
        {
            id: 'profile',
            title: 'My Profile',
            href: '/dashboard/profile',
            icon: User,
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

    // Auto-collapse temporary expansion after delay or interaction
    useEffect(() => {
        if (isTemporarilyExpanded) {
            const timer = setTimeout(() => {
                setIsTemporarilyExpanded(false);
                // Also collapse any expanded items when temporary expansion ends
                setExpandedItems(new Set());
            }, 8000); // Reduced to 8 seconds for better UX

            const handleInteraction = () => {
                clearTimeout(timer);
                setIsTemporarilyExpanded(false);
            };

            // Close on any click outside or escape key
            document.addEventListener('click', handleInteraction);
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') handleInteraction();
            });

            return () => {
                clearTimeout(timer);
                document.removeEventListener('click', handleInteraction);
            };
        }
    }, [isTemporarilyExpanded]);

    // Better mouse leave handling
    const handleMouseLeave = useCallback(() => {
        if (isTemporarilyExpanded) {
            // Only collapse if not interacting with a child menu
            const isHoveringChild = document.querySelector(':hover')?.closest('[data-sidebar]');
            if (!isHoveringChild) {
                setIsTemporarilyExpanded(false);
            }
        }
    }, [isTemporarilyExpanded]);

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
                    isTemporarilyExpanded
                        ? 'w-64 shadow-lg ring-1 ring-primary/10'
                        : isCollapsed
                            ? 'w-16'
                            : 'w-64',
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
                    className
                )}
                onMouseLeave={handleMouseLeave}
            >
                {/* Header with logo and collapse button */}
                <div className={cn(
                    "flex h-16 items-center border-b px-4",
                    (isCollapsed && !isTemporarilyExpanded) ? "justify-center" : "justify-between"
                )}>
                    {(!isCollapsed || isTemporarilyExpanded) ? (
                        <Link to="/">
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                                    <Leaf className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-semibold">Mazao ERP</h1>
                                    <p className="text-xs text-muted-foreground">Farmer Portal</p>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <Link to="/">
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
                                isTemporarilyExpanded={isTemporarilyExpanded}
                            />
                        ))}
                    </div>
                </nav>

                {/* User footer */}
                <div className="border-t p-4">
                    <div className={cn(
                        "flex items-center",
                        (isCollapsed && !isTemporarilyExpanded) ? "justify-center" : "justify-between"
                    )}>
                        <div className={cn(
                            "flex items-center",
                            (isCollapsed && !isTemporarilyExpanded) ? "space-x-0" : "space-x-3"
                        )}>
                            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                                <User className="h-4 w-4" />
                            </div>
                            {(!isCollapsed || isTemporarilyExpanded) && (
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium truncate">
                                        {user?.profile?.fullName || 'Farmer User'}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {user?.email || 'farmer@mazao.com'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {(!isCollapsed || isTemporarilyExpanded) && (
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