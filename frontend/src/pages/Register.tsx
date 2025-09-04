import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/custom/FormField';
import { SelectField } from '@/components/ui/custom/SelectField';
import { Eye, EyeOff, Loader2, Leaf } from 'lucide-react';
import { kenyanCounties } from '@/data/kenyanCounties';
import type { RegisterFormData } from '@/types/auth';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register, user } = useAuth();

    const [formData, setFormData] = useState<RegisterFormData>({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        location: '',
        contactInfo: ''
    });
    const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (user) {
            navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const validateForm = (): boolean => {
        const newErrors: Partial<RegisterFormData> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.fullName) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        if (formData.contactInfo && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.contactInfo)) {
            newErrors.contactInfo = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePasswordChange = (value: string) => {
        setFormData(prev => ({ ...prev, password: value }));
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await register(formData);
            toast('Registration Successful!');

            // Redirect after a short delay
            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 2000);
        } catch (error: any) {
            console.error('Registration error:', error);

            let errorMessage = 'Registration failed. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            console.log(errorMessage)
            toast('Registration Failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'password') {
            handlePasswordChange(value);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear error when user starts typing
        if (errors[name as keyof RegisterFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name as keyof RegisterFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
                {/* Left Side - Branding (Desktop only) */}
                <div className="hidden lg:flex flex-col justify-center items-center lg:w-2/5">
                    <div className="text-left">
                        <div className="flex items-center justify-start space-x-2 mb-6">
                            <Leaf className="w-12 h-12 text-green-600 dark:text-green-500" />
                            <span className="text-3xl font-bold text-green-800 dark:text-green-100">Mazao ERP</span>
                        </div>
                        <h1 className="text-2xl font-semibold text-green-900 dark:text-green-100 mb-4">
                            Join Our Agricultural Community
                        </h1>
                        <p className="text-green-700 dark:text-green-300 mb-6">
                            Connect with farmers across Kenya and manage your agricultural operations with ease.
                        </p>
                        <div className="space-y-3 text-left">
                            <div className="flex items-center text-green-800 dark:text-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                Real-time crop tracking
                            </div>
                            <div className="flex items-center text-green-800 dark:text-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                Connect with local farmers
                            </div>
                            <div className="flex items-center text-green-800 dark:text-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                Market insights and analytics
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-3/5">
                    <Card className="shadow-xl border-green-200 dark:border-gray-700">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">
                                Create Account
                            </CardTitle>
                            <CardDescription className="text-center dark:text-gray-400">
                                Join thousands of farmers using Mazao ERP
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        label="Full Name"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        error={errors.fullName}
                                        placeholder="Enter your full name"
                                        required
                                    />

                                    <FormField
                                        label="Email Address"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <SelectField
                                        label="County"
                                        name="location"
                                        value={formData.location ?? ''}
                                        onChange={(value) => handleSelectChange('location', value)}
                                        options={kenyanCounties}
                                        error={errors.location}
                                        placeholder="Select your county"
                                    />

                                    <FormField
                                        label="Phone Number"
                                        name="contactInfo"
                                        value={formData.contactInfo ?? ''}
                                        onChange={handleChange}
                                        error={errors.contactInfo}
                                        placeholder="+254 700 123 456"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2 relative">
                                        <FormField
                                            label="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            error={errors.password}
                                            placeholder="Create a password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    <div className="space-y-2 relative">
                                        <FormField
                                            label="Confirm Password"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            error={errors.confirmPassword}
                                            placeholder="Confirm your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-base font-medium dark:bg-green-700 dark:hover:bg-green-800"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            </form>

                            <div className="text-center text-sm pt-4 border-t border-gray-200 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
                                <Link
                                    to="/login"
                                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                                >
                                    Sign in here
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Terms Notice */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center dark:bg-blue-900/20 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            By creating an account, you agree to our{' '}
                            <a href="#" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium">
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;