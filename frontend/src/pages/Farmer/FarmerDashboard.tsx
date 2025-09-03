import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {
    Sprout, Plus, ArrowUpRight, Package,
    TrendingUp, AlertTriangle, CheckCircle, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

// Color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

type CropStatus = {
    status: string;
    count: number;
};

type CropTypeChart = {
    type: string;
    count: number;
    totalQuantity: number;
};

type RecentCrop = {
    id: string | number;
    name: string;
    type: string;
    quantity: number;
    status: string;
    farmer?: {
        profile?: {
            fullName: string;
        };
    };
};

type FarmerDashboardStats = {
    summary: {
        totalCrops: number;
        totalQuantity: number;
    };
    charts: {
        byStatus: CropStatus[];
        byType: CropTypeChart[];
        byFarmer: any[];
    };
    recentCrops: RecentCrop[];
};

const FarmerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<FarmerDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/crops/stats/summary');

            if (response.data.success) {
                setStats(response.data.data);
            } else {
                setError('Failed to load dashboard data');
            }
        } catch (err) {
            setError('Error fetching dashboard data');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get status count
    const getStatusCount = (status: string) => {
        return stats?.charts?.byStatus?.find(s => s.status === status)?.count || 0;
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <Skeleton className="h-10 w-32" />
                    <Button variant="outline" disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Loading
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <Skeleton className="h-8 w-8 mb-2" />
                                <Skeleton className="h-6 w-20 mb-1" />
                                <Skeleton className="h-4 w-16" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-64 w-full" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-64 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <Button asChild>
                        <Link to="/crops/new">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Crop
                        </Link>
                    </Button>
                </div>
                <div className="text-center py-12 text-muted-foreground">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                    <p>{error}</p>
                    <Button onClick={fetchDashboardData} className="mt-4">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.profile?.fullName || 'Farmer'}
                    </p>
                </div>
                <div className='flex justify-between items-center'>
                    <Button asChild>
                        <Link to="/dashboard/crops/new">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Crop
                        </Link>
                    </Button>
                </div>

            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Crops</p>
                                <p className="text-2xl font-bold">{stats?.summary?.totalCrops || 0}</p>
                            </div>
                            <div className="p-2 rounded-full bg-primary/10">
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Quantity (kg)</p>
                                <p className="text-2xl font-bold">{stats?.summary?.totalQuantity || 0}</p>
                            </div>
                            <div className="p-2 rounded-full bg-green-100">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Planted Crops</p>
                                <p className="text-2xl font-bold">
                                    {getStatusCount('PLANTED')}
                                </p>
                            </div>
                            <div className="p-2 rounded-full bg-blue-100">
                                <Sprout className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Harvest Ready</p>
                                <p className="text-2xl font-bold">
                                    {getStatusCount('HARVESTED')}
                                </p>
                            </div>
                            <div className="p-2 rounded-full bg-amber-100">
                                <CheckCircle className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Crops by Type Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Crops by Type (Count)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats?.charts?.byType || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="type"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => [`${value} crops`, 'Count']}
                                        labelFormatter={(value) => `Type: ${value}`}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="count"
                                        name="Number of Crops"
                                        fill="#16a34a"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Quantity by Type Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quantity by Type (kg)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats?.charts?.byType || []}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ type, totalQuantity }) => `${type}: ${totalQuantity}kg`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="totalQuantity"
                                        nameKey="type"
                                    >
                                        {stats?.charts?.byType?.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => [`${value} kg`, 'Quantity']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Crops */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Crops</CardTitle>
                    <Button variant="outline" asChild>
                        <Link to="/dashboard/crops">
                            View All
                            <ArrowUpRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {stats?.recentCrops && stats.recentCrops.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentCrops.map((crop) => (
                                <div key={crop.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 rounded-full bg-primary/10">
                                            <Sprout className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{crop.name}</p>
                                            <p className="text-sm text-muted-foreground capitalize">
                                                {crop.type.toLowerCase()} • {crop.quantity}kg
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={cn(
                                            "px-2 py-1 rounded-full text-xs font-medium capitalize",
                                            crop.status === 'PLANTED' && "bg-blue-100 text-blue-800",
                                            crop.status === 'HARVESTED' && "bg-green-100 text-green-800",
                                            crop.status === 'SOLD' && "bg-purple-100 text-purple-800",
                                            !['PLANTED', 'HARVESTED', 'SOLD'].includes(crop.status) && "bg-gray-100 text-gray-800"
                                        )}>
                                            {crop.status.toLowerCase()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Sprout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No crops added yet</p>
                            <Button asChild className="mt-4">
                                <Link to="/farmer/crops/new">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Crop
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FarmerDashboard;