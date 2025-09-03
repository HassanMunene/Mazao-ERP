import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Unauthorized from './pages/Unauthorized';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from './lib/theme-provider';
import { TooltipProvider } from './components/ui/tooltip';

import { AdminLayout } from './components/layout/AdminLayout';
import FarmersPage from './pages/Admin/FarmersPage';
import CropsPage from './pages/Admin/CropsPage';
import AnalyticsPage from './pages/Admin/AnalyticsPage';
import SettingsPage from './pages/Admin/SettingsPage';
import AddFarmerPage from './pages/Admin/AddFarmerPage';
import EditFarmerPage from './pages/Admin/EditFarmerPage';

import AddCropPage from './pages/Admin/AddCropPage';
import CropDetailPage from './pages/Admin/CropDetailPage';
import EditCropPage from './pages/Admin/EditCropPage';
import ProfilePage from './pages/ProfilePage';

// Handle Role based redirects after login
const RoleBasedRedirect = () => {
	const { user } = useAuth();

	if (user?.role === 'ADMIN') {
		return <Navigate to="/admin" replace />
	} else if (user?.role === 'FARMER') {
		return <Navigate to="/dashboard" replace />
	}
	// Else just take them to unauthorized section.
	return <Navigate to="/unauthorized" replace />
}

function AppRoutes() {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading application...</p>
				</div>
			</div>
		);
	}

	return (
		<Routes>
			{/* Public routes */}
			<Route path="/" element={<Landing />} />

			<Route path="/login" element={isAuthenticated ? <RoleBasedRedirect /> : <Login />} />

			<Route path="/register" element={isAuthenticated ? <RoleBasedRedirect /> : <Register />} />

			<Route path="/unauthorized" element={<Unauthorized />} />

			{/* Protected user routes */}
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute requiredRoles={['FARMER', 'ADMIN']}>
						<Dashboard />
					</ProtectedRoute>
				}
			/>

			{/* Admin routes */}
			<Route
				path="/admin/*"
				element={<AdminRoute><AdminLayout /></AdminRoute>}
			>
				<Route index element={<AdminDashboard />} />
				<Route path="farmers" element={<FarmersPage />} />
				<Route path="farmers/new" element={<AddFarmerPage />} />
				<Route path="farmers/:id/edit" element={<EditFarmerPage />} />
				<Route path="analytics" element={<AnalyticsPage />} />
				<Route path="settings" element={<SettingsPage />} />

				<Route path="crops" element={<CropsPage />} />
				<Route path="crops/new" element={<AddCropPage />} />
				<Route path="crops/:id" element={<CropDetailPage />} />
				<Route path="crops/:id/edit" element={<EditCropPage />} />

				<Route path="profile" element={<ProfilePage />} />

			</Route>

			{/* Catch all route */}
			<Route path="*" element={isAuthenticated ? <RoleBasedRedirect /> : <Navigate to="/" replace />} />
		</Routes>
	);
}

function App() {
	return (
		<Router>
			<TooltipProvider>
				<ThemeProvider>
					<Toaster />
					<AuthProvider>
						<div className="min-h-screen bg-background">
							<AppRoutes />
						</div>
					</AuthProvider>
				</ThemeProvider>
			</TooltipProvider>
		</Router>
	);
}

export default App;