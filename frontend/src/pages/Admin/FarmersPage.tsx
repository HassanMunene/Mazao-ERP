import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Loader2, User, Ellipsis } from 'lucide-react';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Farmer {
    id: string;
    email: string;
    role: 'FARMER';
    createdAt: string;
    profile: {
        fullName: string;
        location?: string;
        contactInfo?: string;
    } | null;
    _count: {
        crops: number;
    };
}

interface FarmersResponse {
    success: boolean;
    data: {
        users: Farmer[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalUsers: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
            limit: number;
        };
    };
}

const FarmersPage: React.FC = () => {
    const navigate = useNavigate();
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalFarmers, setTotalFarmers] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [farmerToDelete, setFarmerToDelete] = useState<Farmer | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchFarmers();
    }, [currentPage]);

    const fetchFarmers = async () => {
        try {
            setLoading(true);
            const response = await api.get<FarmersResponse>('/users', {
                params: {
                    page: currentPage,
                    limit: 10,
                    role: 'FARMER',
                    search: searchTerm || undefined
                }
            });

            if (response.data.success) {
                setFarmers(response.data.data.users);
                setTotalPages(response.data.data.pagination.totalPages);
                setTotalFarmers(response.data.data.pagination.totalUsers);
            }
        } catch (error: any) {
            console.error('Failed to fetch farmers:', error);
            toast('Failed to fetch farmers');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (farmer: Farmer) => {
        setFarmerToDelete(farmer);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!farmerToDelete) return;

        try {
            setDeleting(true);
            await api.delete(`/users/${farmerToDelete.id}`);

            toast('Successfully deleted');
            // Refresh the list
            fetchFarmers();
        } catch (error: any) {
            console.error('Failed to delete farmer:', error);
            toast('Failed to delete farmer');
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
            setFarmerToDelete(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page when searching
        fetchFarmers();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading && farmers.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Farmers Management</h1>
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
                    <h1 className="text-3xl font-bold">Farmers Management</h1>
                    <p className="text-muted-foreground">
                        Manage {totalFarmers} registered farmers
                    </p>
                </div>
                <Button onClick={() => navigate('/admin/farmers/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Farmer
                </Button>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>All Farmers</CardTitle>
                        </div>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                placeholder="Search farmers by name or email..."
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
                    {/* Farmers Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Farmer</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Crops</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {farmers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No farmers found</p>
                                            {searchTerm && (
                                                <p className="text-sm">Try adjusting your search terms</p>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    farmers.map((farmer) => (
                                        <TableRow key={farmer.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                                        <User className="h-5 w-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {farmer.profile?.fullName || 'Unknown Farmer'}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {farmer.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {farmer.profile?.contactInfo ? (
                                                    <a
                                                        href={`tel:${farmer.profile.contactInfo}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {farmer.profile.contactInfo}
                                                    </a>
                                                ) : (
                                                    <span className="text-muted-foreground">Not provided</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {farmer.profile?.location || (
                                                    <span className="text-muted-foreground">Not specified</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {farmer._count.crops} crops
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(farmer.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <Ellipsis className='h-5 w-5'/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() => navigate(`/admin/farmers/${farmer.id}`)}
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => navigate(`/admin/farmers/${farmer.id}/edit`)}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit Farmer
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => handleDeleteClick(farmer)}
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
                    {farmers.length > 0 && (
                        <div className="flex items-center justify-between pt-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {(currentPage - 1) * 10 + 1} to{' '}
                                {Math.min(currentPage * 10, totalFarmers)} of {totalFarmers} farmers
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
                            This action cannot be undone. This will permanently delete{' '}
                            <strong>{farmerToDelete?.profile?.fullName || farmerToDelete?.email}</strong>{' '}
                            and all their associated data including crops.
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
                                'Delete Farmer'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default FarmersPage;