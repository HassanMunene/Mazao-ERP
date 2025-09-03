import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Sprout, Search, Plus, Edit, Trash2, Eye,
    ChevronLeft, ChevronRight, Loader2, User
} from 'lucide-react';
import { api } from '@/lib/api';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Crop {
    id: string;
    name: string;
    type: string;
    quantity: number;
    plantingDate: string;
    harvestDate?: string;
    status: string;
    description?: string;
    farmer: {
        id: string;
        email: string;
        profile: {
            fullName: string;
            location?: string;
        } | null;
    };
}

interface CropsResponse {
    success: boolean;
    data: {
        crops: Crop[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalCrops: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
            limit: number;
        };
    };
}

const CropsPage: React.FC = () => {
    const navigate = useNavigate();
    const [crops, setCrops] = useState<Crop[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCrops, setTotalCrops] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [cropToDelete, setCropToDelete] = useState<Crop | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchCrops();
    }, [currentPage, searchTerm]);

    const fetchCrops = async () => {
        try {
            setLoading(true);
            const response = await api.get<CropsResponse>('/crops', {
                params: {
                    page: currentPage,
                    limit: 10,
                    search: searchTerm || undefined
                }
            });

            if (response.data.success) {
                setCrops(response.data.data.crops);
                setTotalPages(response.data.data.pagination.totalPages);
                setTotalCrops(response.data.data.pagination.totalCrops);
            }
        } catch (error: any) {
            console.error('Failed to fetch crops:', error);
            toast('Failed to fetch crops');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (crop: Crop) => {
        setCropToDelete(crop);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!cropToDelete) return;

        try {
            setDeleting(true);
            await api.delete(`/crops/${cropToDelete.id}`);

            toast('Crop deleted successfully');

            // Refresh the list
            fetchCrops();
        } catch (error: any) {
            console.error('Failed to delete crop:', error);
            toast('Failed to delete crop');
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
            setCropToDelete(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page when searching
        fetchCrops();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        const statusColors = {
            PLANTED: 'bg-blue-100 text-blue-800',
            HARVESTED: 'bg-green-100 text-green-800',
            SOLD: 'bg-purple-100 text-purple-800',
            DEFAULT: 'bg-gray-100 text-gray-800'
        };

        const colorClass = statusColors[status as keyof typeof statusColors] || statusColors.DEFAULT;

        return (
            <Badge variant="outline" className={colorClass}>
                {status.toLowerCase()}
            </Badge>
        );
    };

    if (loading && crops.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Crops Management</h1>
                        <p className="text-muted-foreground">Manage all crops in the system</p>
                    </div>
                    <Button disabled>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                                    <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Crops Management</h1>
                    <p className="text-muted-foreground">
                        Manage {totalCrops} crops across all farmers
                    </p>
                </div>
                <Button onClick={() => navigate('/admin/crops/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Crop
                </Button>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>All Crops</CardTitle>
                            <CardDescription>
                                Search and manage crops across all farmers
                            </CardDescription>
                        </div>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                placeholder="Search crops by name, type, or farmer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64"
                            />
                            <Button type="submit" variant="outline">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Crops Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Crop</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Farmer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Planted</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {crops.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            <Sprout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No crops found</p>
                                            {searchTerm && (
                                                <p className="text-sm">Try adjusting your search terms</p>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    crops.map((crop) => (
                                        <TableRow key={crop.id}>
                                            <TableCell>
                                                <div className="font-medium">{crop.name}</div>
                                                {crop.description && (
                                                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                                                        {crop.description}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{crop.type}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-semibold">{crop.quantity} kg</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                                        <User className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium">
                                                            {crop.farmer.profile?.fullName || 'Unknown Farmer'}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {crop.farmer.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(crop.status)}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(crop.plantingDate)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            Actions
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() => navigate(`/admin/crops/${crop.id}`)}
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => navigate(`/admin/crops/${crop.id}/edit`)}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit Crop
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => handleDeleteClick(crop)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {crops.length > 0 && (
                        <div className="flex items-center justify-between pt-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {(currentPage - 1) * 10 + 1} to{' '}
                                {Math.min(currentPage * 10, totalCrops)} of {totalCrops} crops
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the crop{' '}
                            <strong>{cropToDelete?.name}</strong> belonging to{' '}
                            <strong>{cropToDelete?.farmer.profile?.fullName || cropToDelete?.farmer.email}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={deleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Crop'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default CropsPage;