import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowLeft, Sprout, ChevronDown, User } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface CropFormData {
    name: string;
    type: string;
    quantity: number;
    plantingDate: string;
    harvestDate: string;
    description: string;
    status: string;
    farmerId?: string;
}

interface CropFormProps {
    mode: 'create' | 'edit';
    cropId?: string;
}

// Custom Select component
const CustomSelect = ({
    label,
    name,
    value,
    onChange,
    options,
    error,
    placeholder,
    disabled = false
}: {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string, label: string }>;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <div className="relative">
                <button
                    type="button"
                    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${disabled ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                >
                    {value ? options.find(opt => opt.value === value)?.label : placeholder}
                    {!disabled && <ChevronDown className="h-4 w-4 opacity-50" />}
                </button>

                {isOpen && !disabled && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {options.map(option => (
                            <div
                                key={option.value}
                                className="px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    );
};

// Crop types and statuses
const CROP_TYPES = [
    { value: 'CEREAL', label: 'Cereal' },
    { value: 'LEGUME', label: 'Legume' },
    { value: 'VEGETABLE', label: 'Vegetable' },
    { value: 'FRUIT', label: 'Fruit' },
    { value: 'ROOT_TUBER', label: 'Root & Tuber' },
    { value: 'OTHER', label: 'Other' }
];

const CROP_STATUSES = [
    { value: 'PLANTED', label: 'Planted' },
    { value: 'HARVESTED', label: 'Harvested' },
    { value: 'SOLD', label: 'Sold' }
];

export const CropForm: React.FC<CropFormProps> = ({ mode, cropId }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(mode === 'edit');
    const [errors, setErrors] = useState<Partial<Record<keyof CropFormData, string>>>({});
    const [farmers, setFarmers] = useState<any[]>([]);

    const [formData, setFormData] = useState<CropFormData>({
        name: '',
        type: 'CEREAL',
        quantity: 0,
        plantingDate: new Date().toISOString().split('T')[0],
        harvestDate: '',
        description: '',
        status: 'PLANTED'
    });

    const isAdmin = user?.role === 'ADMIN';
    const isFarmer = user?.role === 'FARMER';

    // Fetch crop data for edit mode and farmers for admin
    useEffect(() => {
        if (mode === 'edit' && cropId) {
            fetchCropData();
        }

        if (isAdmin) {
            fetchFarmers();
        } else if (isFarmer) {
            // For farmers, automatically set their own ID
            setFormData(prev => ({
                ...prev,
                farmerId: user.id
            }));
        }
    }, [mode, cropId, isAdmin, isFarmer, user?.id]);

    const fetchCropData = async () => {
        try {
            setFetching(true);
            const response = await api.get(`/crops/${cropId}`);

            if (response.data.success) {
                const crop = response.data.data;
                setFormData({
                    name: crop.name,
                    type: crop.type,
                    quantity: crop.quantity,
                    plantingDate: crop.plantingDate.split('T')[0],
                    harvestDate: crop.harvestDate ? crop.harvestDate.split('T')[0] : '',
                    description: crop.description || '',
                    status: crop.status,
                    farmerId: crop.farmerId
                });
            }
        } catch (error: any) {
            console.error('Failed to fetch crop data:', error);
            toast('Failed to load crop data');
            navigate(isAdmin ? '/admin/crops' : '/dashboard/crops');
        } finally {
            setFetching(false);
        }
    };

    const fetchFarmers = async () => {
        try {
            const response = await api.get('/users/farmers');
            if (response.data.success) {
                setFarmers(response.data.data.farmers || []);
            }
        } catch (error) {
            console.error('Failed to fetch farmers:', error);
            toast('Failed to load farmers list');
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof CropFormData, string>> = {};

        if (!formData.name) {
            newErrors.name = 'Crop name is required';
        }

        if (!formData.type) {
            newErrors.type = 'Crop type is required';
        }

        if (!formData.quantity || formData.quantity <= 0) {
            newErrors.quantity = 'Quantity must be greater than 0';
        }

        if (!formData.plantingDate) {
            newErrors.plantingDate = 'Planting date is required';
        }

        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                type: formData.type,
                quantity: Number(formData.quantity),
                plantingDate: formData.plantingDate,
                harvestDate: formData.harvestDate || undefined,
                description: formData.description,
                status: formData.status,
                ...(isAdmin && formData.farmerId && { farmerId: formData.farmerId })
            };

            if (mode === 'create') {
                await api.post('/crops', payload);
                toast('Crop created successfully');
            } else {
                await api.put(`/crops/${cropId}`, payload);
                toast('Crop updated successfully');
            }

            navigate(isAdmin ? '/admin/crops' : '/farmer/crops');
        } catch (error: any) {
            console.error('Failed to save crop:', error);
            const errorMessage = error.response?.data?.message || `Failed to ${mode === 'create' ? 'create' : 'update'} crop`;
            toast(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' ? Number(value) : value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof CropFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
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
                        onClick={() => navigate(isAdmin ? '/admin/crops' : '/farmer/crops')}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Crops
                    </Button>
                    <h1 className="text-3xl font-bold">
                        {mode === 'create' ? 'Add New Crop' : 'Edit Crop'}
                    </h1>
                    <p className="text-muted-foreground">
                        {mode === 'create'
                            ? 'Add a new crop to the system'
                            : 'Update crop information'
                        }
                    </p>
                </div>
            </div>

            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Crop Information</CardTitle>
                    <CardDescription>
                        {mode === 'create'
                            ? 'Enter the details for the new crop'
                            : 'Update the crop details below'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Basic Information</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Crop Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter crop name"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <CustomSelect
                                    label="Crop Type *"
                                    name="type"
                                    value={formData.type}
                                    onChange={(value) => handleSelectChange('type', value)}
                                    options={CROP_TYPES}
                                    error={errors.type}
                                    placeholder="Select crop type"
                                />

                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity (kg) *</Label>
                                    <Input
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        placeholder="Enter quantity"
                                        min="0"
                                        step="0.5"
                                        required
                                    />
                                    {errors.quantity && (
                                        <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                                    )}
                                </div>

                                <CustomSelect
                                    label="Status *"
                                    name="status"
                                    value={formData.status}
                                    onChange={(value) => handleSelectChange('status', value)}
                                    options={CROP_STATUSES}
                                    error={errors.status}
                                    placeholder="Select status"
                                />
                            </div>

                            {/* Dates & Additional Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Dates & Details</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="plantingDate">Planting Date *</Label>
                                    <Input
                                        id="plantingDate"
                                        name="plantingDate"
                                        type="date"
                                        value={formData.plantingDate}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.plantingDate && (
                                        <p className="text-red-500 text-xs mt-1">{errors.plantingDate}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="harvestDate">Harvest Date (Optional)</Label>
                                    <Input
                                        id="harvestDate"
                                        name="harvestDate"
                                        type="date"
                                        value={formData.harvestDate}
                                        onChange={handleChange}
                                        min={formData.plantingDate}
                                    />
                                </div>

                                {/* Farmer selection - only for admin */}
                                {isAdmin && (
                                    <CustomSelect
                                        label="Farmer *"
                                        name="farmerId"
                                        value={formData.farmerId || ''}
                                        onChange={(value) => handleSelectChange('farmerId', value)}
                                        options={farmers.map(farmer => ({
                                            value: farmer.id,
                                            label: farmer.profile?.fullName || farmer.email
                                        }))}
                                        error={errors.farmerId}
                                        placeholder="Select farmer"
                                    />
                                )}

                                {/* Display farmer info for non-admin users */}
                                {!isAdmin && user && (
                                    <div className="space-y-2">
                                        <Label>Farmer</Label>
                                        <div className="flex items-center p-3 border rounded-md bg-muted/50">
                                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span className="text-sm">
                                                {user.profile?.fullName || user.email}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Crops are automatically assigned to your account
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter crop description"
                                rows={3}
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(isAdmin ? '/admin/crops' : '/dashboard/crops')}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="min-w-32"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {mode === 'create' ? 'Creating...' : 'Updating...'}
                                    </>
                                ) : (
                                    <>
                                        <Sprout className="h-4 w-4 mr-2" />
                                        {mode === 'create' ? 'Create Crop' : 'Update Crop'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};