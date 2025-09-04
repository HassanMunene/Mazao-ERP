import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProtectedRouteProps {
    children: React.ReactNode;
    admin?: boolean;
    requiredRoles?: string[];
    fallbackPath?: string;
    className?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    admin = false,
    fallbackPath = '/login',
    className
}) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className={cn("flex items-center justify-center min-h-screen", className)}>
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground"></p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Check if the current path is an admin route
        const isAdminRoute = location.pathname.startsWith('/admin');

        // For admin routes, don't set returnUrl as they can't access admin pages without proper role
        if (isAdminRoute) {
            return <Navigate to="/login"/>;
        }

        // For non-admin routes, redirect to login with return url
        return <Navigate to={`${fallbackPath}?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
    }

    // Check admin role if required
    if (admin && user?.role !== 'ADMIN') {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

// Specific route protection components
export const AdminRoute = ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute admin={true} fallbackPath="/unauthorized">
        {children}
    </ProtectedRoute>
);