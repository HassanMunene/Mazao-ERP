import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export function AdminLayout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    const handleSearch = (query: string) => {
        console.log('Searching for:', query);
        // Implement search functionality
    };

    return (
        <div className="flex h-screen bg-background">
            <AdminSidebar
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={handleSidebarToggle}
                isMobileOpen={isMobileMenuOpen}
                onMobileToggle={handleMobileMenuToggle}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader
                    onMenuToggle={handleMobileMenuToggle}
                    showMobileMenu={isMobileMenuOpen}
                    onSearch={handleSearch}
                    isSidebarCollapsed={isSidebarCollapsed}
                    onSidebarToggle={handleSidebarToggle}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}