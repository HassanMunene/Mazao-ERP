import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Edit, Calendar, Scale, User, Sprout } from 'lucide-react';
import { api } from '@/lib/api';

interface CropDetail {
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
            contactInfo?: string;
        } | null;
    };
}

const CropDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [crop, setCrop] = useState<CropDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchCropDetail();
        }
    }, [id]);

    const fetchCropDetail = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/crops/${id}`);

            if (response.data.success) {
                setCrop(response.data.data);
            }
        } catch (error: any) {
            console.error('Failed to fetch crop detail:', error);
            toast('Failed to load crop details');
            navigate('/admin/crops');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        const statusColors = {
            PLANTED: 'bg-blue-100 text-blue-800',
            HARVESTED: 'bg-green-100 text-green-800',
            SOLD: 'bg-purple-100 text-purple-800',
        };

        const colorClass = statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';

        return (
            <Badge variant="outline" className={colorClass}>
                {status.toLowerCase()}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (!crop) {
        return (
            <div className="text-center py-12">
                <Sprout className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Crop not found</h2>
                <p className="text-gray-600">The crop you're looking for doesn't exist.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/admin/crops')}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Crops
                    </Button>
                    <h1 className="text-3xl font-bold">{crop.name}</h1>
                    <p className="text-muted-foreground">Crop details and information</p>
                </div>
                <Button onClick={() => navigate(`/admin/crops/${crop.id}/edit`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Crop
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Crop Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Crop Information</CardTitle>
                        <CardDescription>Details about this crop</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Status</span>
                            {getStatusBadge(crop.status)}
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Type</span>
                            <Badge variant="outline">{crop.type}</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Quantity</span>
                            <div className="flex items-center gap-2">
                                <Scale className="h-4 w-4 text-gray-500" />
                                <span className="font-semibold">{crop.quantity} kg</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Planted on</span>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span>{formatDate(crop.plantingDate)}</span>
                            </div>
                        </div>

                        {crop.harvestDate && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Harvested on</span>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span>{formatDate(crop.harvestDate)}</span>
                                </div>
                            </div>
                        )}

                        {crop.description && (
                            <div>
                                <span className="text-sm font-medium block mb-2">Description</span>
                                <p className="text-sm text-muted-foreground">{crop.description}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Farmer Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Farmer Information</CardTitle>
                        <CardDescription>Owner of this crop</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <User className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold">{crop.farmer.profile?.fullName || 'Unknown Farmer'}</h3>
                                <p className="text-sm text-muted-foreground">{crop.farmer.email}</p>
                            </div>
                        </div>

                        {crop.farmer.profile?.location && (
                            <div>
                                <span className="text-sm font-medium block mb-1">Location</span>
                                <p className="text-sm">{crop.farmer.profile.location}</p>
                            </div>
                        )}

                        {crop.farmer.profile?.contactInfo && (
                            <div>
                                <span className="text-sm font-medium block mb-1">Contact</span>
                                <a
                                    href={`tel:${crop.farmer.profile.contactInfo}`}
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    {crop.farmer.profile.contactInfo}
                                </a>
                            </div>
                        )}

                        <Button
                            variant="outline"
                            onClick={() => navigate(`/admin/farmers/${crop.farmer.id}`)}
                            className="w-full"
                        >
                            View Farmer Profile
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CropDetailPage;