import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Edit,
    Calendar,
    Package,
    User,
    MapPin,
    Phone,
    Mail,
    X,
    AlertCircle,
    Sprout
} from 'lucide-react';
import { api } from '@/lib/api';

interface CropDetailModalProps {
    cropId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: (cropId: string) => void;
}

const CropDetailModal: React.FC<CropDetailModalProps> = ({
    cropId,
    open,
    onOpenChange,
    onEdit,
}) => {
    const [crop, setCrop] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && cropId) {
            fetchCrop();
        } else {
            // Reset state when modal closes
            setCrop(null);
            setError('');
        }
    }, [open, cropId]);

    const fetchCrop = async () => {
        if (!cropId) return;

        try {
            setLoading(true);
            setError('');
            const response = await api.get(`/api/crops/${cropId}`);

            if (response.data.success) {
                setCrop(response.data);
            } else {
                setError('Failed to load crop details');
            }
        } catch (error) {
            console.error('Error fetching crop:', error);
            setError('Crop not found or you don\'t have access to it');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            ACTIVE: { variant: 'default', label: 'Active' },
            HARVESTED: { variant: 'success', label: 'Harvested' },
            DORMANT: { variant: 'secondary', label: 'Dormant' },
            FAILED: { variant: 'destructive', label: 'Failed' }
        };

        const config = statusConfig[status] || { variant: 'secondary', label: status };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleEdit = () => {
        if (cropId) {
            onOpenChange(false);
            onEdit(cropId);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <DialogTitle className="text-2xl">Crop Details</DialogTitle>
                        <DialogDescription>
                            Detailed information about this crop
                        </DialogDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenChange(false)}
                        className="h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                {loading ? (
                    <div className="space-y-6 py-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-6 w-20" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-6 w-32" />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-6 w-40" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : error ? (
                    <div className="py-8 text-center">
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Error Loading Crop</h3>
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <Button onClick={fetchCrop}>Try Again</Button>
                    </div>
                ) : crop ? (
                    <div className="space-y-6">
                        {/* Header with title and status */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold">{crop.name}</h2>
                                <p className="text-muted-foreground capitalize">{crop.type}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusBadge(crop.status)}
                                <Button size="sm" onClick={handleEdit}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Crop Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Crop Information</h3>

                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Package className="h-4 w-4 mr-2" />
                                        Quantity
                                    </div>
                                    <p className="text-lg font-medium">{crop.quantity} units</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Planting Date
                                    </div>
                                    <p className="text-lg">{formatDate(crop.plantingDate)}</p>
                                </div>

                                {crop.harvestDate && (
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {crop.status === 'HARVESTED' ? 'Harvest Date' : 'Expected Harvest Date'}
                                        </div>
                                        <p className="text-lg">{formatDate(crop.harvestDate)}</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Created
                                    </div>
                                    <p className="text-lg">{formatDate(crop.createdAt)}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Last Updated
                                    </div>
                                    <p className="text-lg">{formatDate(crop.updatedAt)}</p>
                                </div>
                            </div>

                            {/* Farmer Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Farmer Information</h3>

                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <User className="h-4 w-4 mr-2" />
                                        Farmer Name
                                    </div>
                                    <p className="text-lg font-medium">{crop.farmer?.profile?.fullName}</p>
                                </div>

                                {crop.farmer?.profile?.location && (
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            Location
                                        </div>
                                        <p className="text-lg">{crop.farmer.profile.location}</p>
                                    </div>
                                )}

                                {crop.farmer?.profile?.contactInfo?.phone && (
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Phone className="h-4 w-4 mr-2" />
                                            Phone
                                        </div>
                                        <p className="text-lg">{crop.farmer.profile.contactInfo.phone}</p>
                                    </div>
                                )}

                                {crop.farmer?.email && (
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Mail className="h-4 w-4 mr-2" />
                                            Email
                                        </div>
                                        <p className="text-lg">{crop.farmer.email}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {crop.description && (
                            <div className="pt-4 border-t">
                                <h3 className="text-lg font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground">{crop.description}</p>
                            </div>
                        )}
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
};

export default CropDetailModal;