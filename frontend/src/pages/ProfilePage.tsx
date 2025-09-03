import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone, MapPin, Save, Edit, X, Sun, Moon, Settings, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useTheme } from '@/lib/theme-provider';

interface ProfileData {
    id: string;
    email: string;
    role: string;
    createdAt: string;
    profile: {
        id: string;
        fullName: string;
        location: string;
        contactInfo: string;
    } | null;
}

interface EditProfileData {
    fullName: string;
    location: string;
    contactInfo: string;
}

export default function ProfilePage() {
    const { theme, setTheme } = useTheme();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    const [editData, setEditData] = useState<EditProfileData>({
        fullName: '',
        location: '',
        contactInfo: '',
    });

    const [errors, setErrors] = useState<Partial<EditProfileData>>({});

    useEffect(() => {
        fetchProfileData();
    }, []);

    useEffect(() => {
        if (profileData?.profile) {
            setEditData({
                fullName: profileData.profile.fullName || '',
                location: profileData.profile.location || '',
                contactInfo: profileData.profile.contactInfo || '',
            });
        }
    }, [profileData]);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/auth/me');
            setProfileData(response.data);
        } catch (error: any) {
            console.error('Failed to fetch profile data:', error);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: Partial<EditProfileData> = {};

        if (!editData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (editData.contactInfo && !/^[\+]?[1-9][\d]{0,15}$/.test(editData.contactInfo)) {
            newErrors.contactInfo = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveProfile = async () => {
        if (!validateForm()) {
            toast.error('Please fix the form errors');
            return;
        }

        try {
            setSaving(true);
            const response = await api.put(`/users/${profileData?.id}`, editData);

            if (response.data.success) {
                setProfileData(prev => prev ? {
                    ...prev,
                    profile: {
                        id: prev.profile?.id ?? '',
                        fullName: editData.fullName,
                        location: editData.location,
                        contactInfo: editData.contactInfo
                    }
                } : null);

                setEditing(false);
                setErrors({});
                toast.success('Profile updated successfully');
            }
        } catch (error: any) {
            console.error('Failed to update profile:', error);

            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to update profile');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setErrors({});

        // Reset form data to original values
        if (profileData?.profile) {
            setEditData({
                fullName: profileData.profile.fullName || '',
                location: profileData.profile.location || '',
                contactInfo: profileData.profile.contactInfo || '',
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-green-900">Profile Settings</h1>
                    <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
                        Manage your account settings and profile information
                    </p>
                </div>

                {!editing ? (
                    <Button onClick={() => setEditing(true)} className="mt-4 sm:mt-0 w-full sm:w-auto">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                    </Button>
                ) : (
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="w-full sm:w-auto"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="w-full sm:w-auto"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-6 sm:mb-8 h-auto">
                    <TabsTrigger value="profile" className="py-3 text-sm sm:text-base">Profile Information</TabsTrigger>
                    <TabsTrigger value="preferences" className="py-3 text-sm sm:text-base">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Edit Form */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl sm:text-2xl">Personal Information</CardTitle>
                                <CardDescription className="text-sm sm:text-base">
                                    Update your personal information and how others see you on the platform
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-sm sm:text-base">Full Name *</Label>
                                        {editing ? (
                                            <div>
                                                <Input
                                                    id="fullName"
                                                    value={editData.fullName}
                                                    onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                                    placeholder="Enter your full name"
                                                    className="text-sm sm:text-base"
                                                    aria-invalid={!!errors.fullName}
                                                />
                                                {errors.fullName && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-2 sm:p-3 border rounded-md bg-muted/50 text-sm sm:text-base">
                                                {profileData?.profile?.fullName || 'Not set'}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm sm:text-base">Email Address</Label>
                                        <div className="p-2 sm:p-3 border rounded-md bg-muted/50 flex items-center text-sm sm:text-base">
                                            <Mail className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                                            {profileData?.email}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Contact support to change your email address
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-sm sm:text-base">Location</Label>
                                        {editing ? (
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="location"
                                                    value={editData.location}
                                                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                                    placeholder="Your location"
                                                    className="pl-10 text-sm sm:text-base"
                                                />
                                            </div>
                                        ) : (
                                            <div className="p-2 sm:p-3 border rounded-md bg-muted/50 flex items-center text-sm sm:text-base">
                                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                                                {profileData?.profile?.location || 'Not set'}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contactInfo" className="text-sm sm:text-base">Contact Info</Label>
                                        {editing ? (
                                            <div>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="contactInfo"
                                                        value={editData.contactInfo}
                                                        onChange={(e) => setEditData({ ...editData, contactInfo: e.target.value })}
                                                        placeholder="Phone number"
                                                        className="pl-10 text-sm sm:text-base"
                                                        aria-invalid={!!errors.contactInfo}
                                                    />
                                                </div>
                                                {errors.contactInfo && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.contactInfo}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-2 sm:p-3 border rounded-md bg-muted/50 flex items-center text-sm sm:text-base">
                                                <Phone className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                                                {profileData?.profile?.contactInfo || 'Not set'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="preferences">
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">Preferences</CardTitle>
                            <CardDescription className="text-sm sm:text-base">
                                Customize your experience on the platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 sm:space-y-6">
                                {/* Theme Preference */}
                                <div className="p-4 sm:p-6 border rounded-lg sm:rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex items-center space-x-3 sm:space-x-4">
                                            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0">
                                                <div className="relative">
                                                    <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 absolute opacity-100 dark:opacity-0 transition-opacity" />
                                                    <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 opacity-0 dark:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-base sm:text-lg font-semibold text-foreground">Theme Preference</h4>
                                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                                    Choose between light and dark mode for your interface
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    Current theme: <span className="font-medium capitalize">{theme}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                variant={theme === 'light' ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setTheme('light')}
                                                className="flex-1 sm:flex-initial text-xs sm:text-sm"
                                            >
                                                <Sun className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                                Light
                                            </Button>

                                            <Button
                                                variant={theme === 'dark' ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setTheme('dark')}
                                                className="flex-1 sm:flex-initial text-xs sm:text-sm"
                                            >
                                                <Moon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                                Dark
                                            </Button>

                                            <Button
                                                variant={theme === 'system' ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setTheme('system')}
                                                className="flex-1 sm:flex-initial text-xs sm:text-sm"
                                            >
                                                <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                                System
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}