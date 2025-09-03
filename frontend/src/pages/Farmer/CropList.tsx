import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Plus, Search, Eye, Edit, Trash2, Loader2,
    Sprout, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import { api } from '@/lib/api';
import CropDetailModal from '@/components/dashboard/crops/CropDetailsModal';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DeleteConfirmationDialog } from '@/components/dashboard/DeleteConfirmationDialog';
import { toast } from 'sonner';

const ActionIcons = ({ crop, onView, onEdit, onDelete, isDeleting }: any) => {
    return (
        <div className="flex justify-end gap-2">
            {/* View Icon */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        onClick={() => onView(crop.id)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>View Details</p>
                </TooltipContent>
            </Tooltip>

            {/* Edit Icon */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-100"
                        onClick={() => onEdit(crop.id)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Edit Crop</p>
                </TooltipContent>
            </Tooltip>

            {/* Delete Icon */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100"
                        onClick={() => onDelete(crop)}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Delete Crop</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
};

const CropList = () => {
    const navigate = useNavigate();
    type Crop = {
        id: string;
        name: string;
        type: string;
        description?: string;
        quantity: number;
        status: string;
        plantingDate: string;
    };

    const [crops, setCrops] = useState<Crop[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCrops, setTotalCrops] = useState(0);
    const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editCropId, setEditCropId] = useState<string | null>(null);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [cropToDelete, setCropToDelete] = useState<Crop | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchCrops();
    }, []);

    console.log(totalPages, editCropId)

    const fetchCrops = async () => {
        try {
            setLoading(true);
            const response = await api.get('/crops?limit=1000');

            if (response.data.success) {
                setCrops(response.data.data.crops);
                setTotalPages(response.data.data.pagination.totalPages);
                setTotalCrops(response.data.data.pagination.totalCrops);
            }
        } catch (error) {
            console.error('Error fetching crops:', error);
            toast.error('Failed to fetch crops');
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
            setIsDeleting(true);
            await api.delete(`/crops/${cropToDelete.id}`);

            toast.success(`Crop "${cropToDelete.name}" deleted successfully`);
            fetchCrops(); // Refresh the list
        } catch (error: any) {
            console.error('Error deleting crop:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete crop';
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setCropToDelete(null);
        }
    };

    const handleView = (id: string) => {
        setSelectedCropId(id);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (id: string) => {
        navigate(`/dashboard/crops/${id}/edit`);
    };

    // Client-side filtering
    const filteredCrops = crops.filter(crop => {
        const matchesSearch = searchTerm === '' ||
            crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crop.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (crop.description && crop.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = filterType === '' || crop.type.toLowerCase() === filterType.toLowerCase();
        const matchesStatus = filterStatus === '' || crop.status.toLowerCase() === filterStatus.toLowerCase();

        return matchesSearch && matchesType && matchesStatus;
    });

    // Pagination for filtered results
    const itemsPerPage = 10;
    const totalFilteredPages = Math.ceil(filteredCrops.length / itemsPerPage);
    const paginatedCrops = filteredCrops.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
            PLANTED: { variant: 'default', label: 'Planted' },
            SOLD: { variant: 'secondary', label: 'Sold' },
            FAILED: { variant: 'destructive', label: 'Failed' }
        };

        if (status === "HARVESTED") {
            return <Badge variant="default">Harvested</Badge>;
        }

        const config = statusConfig[status] || { variant: 'secondary', label: status };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    // Get unique types and statuses for filters
    const uniqueTypes = [...new Set(crops.map(crop => crop.type))].sort();
    const uniqueStatuses = [...new Set(crops.map(crop => crop.status))].sort();

    const clearFilters = () => {
        setSearchTerm('');
        setFilterType('');
        setFilterStatus('');
        setCurrentPage(1);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">My Crops</h1>
                    <p className="text-muted-foreground">
                        Manage your crops and track their progress
                    </p>
                </div>
                <Button asChild>
                    <Link to="/dashboard/crops/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Crop
                    </Link>
                </Button>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name, type, or description..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        {/* Type Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full sm:w-auto">
                                    <Filter className="h-4 w-4 mr-2" />
                                    {filterType ? `Type: ${filterType}` : 'Filter by Type'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setFilterType('')}>
                                    All Types
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {uniqueTypes.map((type) => (
                                    <DropdownMenuItem
                                        key={type}
                                        onClick={() => {
                                            setFilterType(type);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {type}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Status Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full sm:w-auto">
                                    <Filter className="h-4 w-4 mr-2" />
                                    {filterStatus ? `Status: ${filterStatus}` : 'Filter by Status'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setFilterStatus('')}>
                                    All Statuses
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {uniqueStatuses.map((status) => (
                                    <DropdownMenuItem
                                        key={status}
                                        onClick={() => {
                                            setFilterStatus(status);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {status}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {(searchTerm || filterType || filterStatus) && (
                            <Button variant="outline" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        )}
                    </div>

                    {/* Active filters indicator */}
                    {(searchTerm || filterType || filterStatus) && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {searchTerm && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Search: "{searchTerm}"
                                </Badge>
                            )}
                            {filterType && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Type: {filterType}
                                </Badge>
                            )}
                            {filterStatus && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Status: {filterStatus}
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Crops Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>
                        {filteredCrops.length} of {totalCrops} Crop{totalCrops !== 1 ? 's' : ''}
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={fetchCrops}>
                        Refresh
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Quantity (kg)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Planted On</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell className="text-right">
                                            <Skeleton className="h-8 w-8 ml-auto" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : filteredCrops.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        <Sprout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No crops found</p>
                                        {(searchTerm || filterType || filterStatus) ? (
                                            <div className="space-y-2">
                                                <p className="text-sm">
                                                    Try adjusting your search or filter criteria
                                                </p>
                                                <Button variant="outline" onClick={clearFilters}>
                                                    Clear All Filters
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button asChild variant="outline" className="mt-4">
                                                <Link to="/farmer/crops/new">Add Your First Crop</Link>
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedCrops.map((crop) => (
                                    <TableRow key={crop.id}>
                                        <TableCell className="font-medium">
                                            <div>
                                                {crop.name}
                                                {crop.description && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {crop.description}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="capitalize">{crop.type.toLowerCase()}</TableCell>
                                        <TableCell>{crop.quantity} kg</TableCell>
                                        <TableCell>{getStatusBadge(crop.status)}</TableCell>
                                        <TableCell>
                                            {new Date(crop.plantingDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <ActionIcons
                                                crop={crop}
                                                onView={handleView}
                                                onEdit={handleEdit}
                                                onDelete={handleDeleteClick}
                                                isDeleting={isDeleting && cropToDelete?.id === crop.id}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {totalFilteredPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-muted-foreground">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                {Math.min(currentPage * itemsPerPage, filteredCrops.length)} of{' '}
                                {filteredCrops.length} crops
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.min(totalFilteredPages, currentPage + 1))}
                                    disabled={currentPage === totalFilteredPages}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modals */}
            <CropDetailModal
                cropId={selectedCropId}
                open={isDetailModalOpen}
                onOpenChange={setIsDetailModalOpen}
                onEdit={setEditCropId}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
                title="Delete Crop"
                description={`Are you sure you want to delete "${cropToDelete?.name}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default CropList;