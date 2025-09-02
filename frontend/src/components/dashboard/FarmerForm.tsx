import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, UserPlus, UserCog } from 'lucide-react';
import { api } from '@/lib/api';
import { SelectField } from '@/components/ui/custom/SelectField';
import { kenyanCounties } from '@/data/kenyanCounties';

interface FarmerFormData {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    location: string;
    contactInfo: string;
}

interface FarmerFormProps {
    mode: 'create' | 'edit';
    farmerId?: string;
}

export const FarmerForm: React.FC<FarmerFormProps> = ({ mode, farmerId }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(mode === 'edit');
    const [errors, setErrors] = useState<Partial<FarmerFormData>>({});

    const [formData, setFormData] = useState<FarmerFormData>({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        location: '',
        contactInfo: ''
    });

    // Fetch farmer data for edit mode
    useEffect(() => {
        if (mode === 'edit' && farmerId) {
            fetchFarmerData();
        }
    }, [mode, farmerId]);

    const fetchFarmerData = async () => {
        try {
            setFetching(true);
            const response = await api.get(`/users/${farmerId}`);

            if (response.data.success) {
                const farmer = response.data.data;
                setFormData({
                    email: farmer.email,
                    password: '',
                    confirmPassword: '',
                    fullName: farmer.profile?.fullName || '',
                    location: farmer.profile?.location || '',
                    contactInfo: farmer.profile?.contactInfo || ''
                });
            }
        } catch (error: any) {
            console.error('Failed to fetch farmer data:', error);
            toast('Failed to load farmer data');
            navigate('/admin/farmers');
        } finally {
            setFetching(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<FarmerFormData> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (mode === 'create') {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            }
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        if (!formData.fullName) {
            newErrors.fullName = 'Full name is required';
        }

        if (formData.contactInfo && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.contactInfo)) {
            newErrors.contactInfo = 'Please enter a valid phone number';
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
                email: formData.email,
                ...(mode === 'create' && { password: formData.password }),
                fullName: formData.fullName,
                location: formData.location,
                contactInfo: formData.contactInfo
            };

            if (mode === 'create') {
                await api.post('/users/farmers/new', payload);
                toast('Farmer created successfully');
            } else {
                await api.put(`/users/${farmerId}`, payload);
                toast('Farmer updated successfully');
            }
            navigate('/admin/farmers');
        } catch (error: any) {
            console.error('Failed to save farmer:', error);
            toast(`Failed to ${mode === 'create' ? 'create' : 'update'} farmer`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof FarmerFormData]) {
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
                        onClick={() => navigate('/admin/farmers')}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Farmers
                    </Button>
                    <h1 className="text-3xl font-bold">
                        {mode === 'create' ? 'Add New Farmer' : 'Edit Farmer'}
                    </h1>
                    <p className="text-muted-foreground">
                        {mode === 'create'
                            ? 'Register a new farmer to the system'
                            : 'Update farmer information'
                        }
                    </p>
                </div>
            </div>

            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Farmer Information</CardTitle>
                    <CardDescription>
                        {mode === 'create'
                            ? 'Enter the details for the new farmer'
                            : 'Update the farmer details below'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Personal Information</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name *</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                        required
                                        disabled={mode === 'edit'} // Email cannot be changed in edit mode
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactInfo">Phone Number</Label>
                                    <Input
                                        id="contactInfo"
                                        name="contactInfo"
                                        value={formData.contactInfo}
                                        onChange={handleChange}
                                        placeholder="+254 700 123 456"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">County</Label>
                                    <SelectField
                                        label=""
                                        name="location"
                                        value={formData.location}
                                        onChange={(value) => handleSelectChange('location', value)}
                                        options={kenyanCounties}
                                        placeholder="Select county"
                                    />
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    {mode === 'create' ? 'Account Information' : 'Change Password (Optional)'}
                                </h3>

                                {mode === 'create' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password *</Label>
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Create a password"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm your password"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {mode === 'edit' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">New Password</Label>
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Leave blank to keep current password"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/admin/farmers')}
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
                                        {mode === 'create' ? (
                                            <>
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Create Farmer
                                            </>
                                        ) : (
                                            <>
                                                <UserCog className="h-4 w-4 mr-2" />
                                                Update Farmer
                                            </>
                                        )}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Information</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Fields marked with * are required</li>
                    <li>• Farmers will receive an email with login instructions</li>
                    {mode === 'edit' && (
                        <li>• Leave password fields blank to keep the current password</li>
                    )}
                    <li>• Phone number should include country code (e.g., +254...)</li>
                </ul>
            </div>
        </div>
    );
};