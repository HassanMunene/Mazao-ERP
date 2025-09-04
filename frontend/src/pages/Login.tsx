import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/custom/FormField';
import { Eye, EyeOff, Loader2, Leaf, Smartphone, UserCog } from 'lucide-react';
import type { LoginFormData } from '@/types/auth';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user } = useAuth();

    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<Partial<LoginFormData>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (user) {
            const redirectTo = location.state?.from?.pathname || (user.role === 'ADMIN' ? '/admin' : '/dashboard');
            navigate(redirectTo, { replace: true });
        }
    }, [user, navigate, location]);

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginFormData> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await login(formData.email, formData.password);

            toast('Login Successful!');

            // Redirect is handled by the useEffect above
        } catch (error: any) {
            console.error('Login error:', error);

            let errorMessage = 'Login failed. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            console.log(errorMessage);
            toast('Login Failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof LoginFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleDemoLogin = async (role: 'admin' | 'farmer') => {
        const demoCredentials = {
            admin: { email: 'shamba@admin.com', password: '12345678' },
            farmer: { email: 'hassan@shamba.com', password: '12345678' }
        };

        setFormData(demoCredentials[role]);

        // Auto-submit after a brief delay to show the credentials
        setTimeout(() => {
            setFormData(demoCredentials[role]);
            // You could auto-submit here if desired:
            // handleSubmit(new Event('submit') as any);
        }, 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
                {/* Left Side - Branding (Desktop only) */}
                <div className="hidden lg:flex flex-col justify-center items-center lg:w-2/5">
                    <div className="text-start">
                        <div className="flex items-center justify-start space-x-2 mb-6">
                            <Leaf className="w-12 h-12 text-green-600 dark:text-green-500" />
                            <span className="text-3xl font-bold text-green-800 dark:text-green-100">Mazao ERP</span>
                        </div>
                        <h1 className="text-2xl font-semibold text-green-900 dark:text-green-100 mb-4">
                            Welcome Back
                        </h1>
                        <p className="text-green-700 dark:text-green-300 mb-6">
                            Sign in to manage your agricultural operations and connect with farmers across Kenya.
                        </p>
                        <div className="space-y-3 text-left">
                            <div className="flex items-center text-green-800 dark:text-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                Track crops in real-time
                            </div>
                            <div className="flex items-center text-green-800 dark:text-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                Access farmer analytics
                            </div>
                            <div className="flex items-center text-green-800 dark:text-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                Manage your cooperative
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-3/5">
                    <Card className="shadow-xl border-green-200 dark:border-gray-700">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">
                                Sign In
                            </CardTitle>
                            <CardDescription className="text-center dark:text-gray-400">
                                Access your Mazao ERP dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
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

                                <div className="space-y-2 relative">
                                    <FormField
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        error={errors.password}
                                        placeholder="Enter your password"
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

                                <div className="flex items-center justify-between text-sm">
                                    <Link
                                        to="/forgot-password"
                                        className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-base font-medium dark:bg-green-700 dark:hover:bg-green-800"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </form>

                            {/* Demo Login Buttons */}
                            <div className="space-y-3">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-gray-300 dark:border-gray-700" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                                            Quick Demo Access
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center justify-center gap-2 py-5 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        onClick={() => handleDemoLogin('admin')}
                                        disabled={isLoading}
                                    >
                                        <UserCog className="w-4 h-4" />
                                        Admin Demo
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center justify-center gap-2 py-5 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        onClick={() => handleDemoLogin('farmer')}
                                        disabled={isLoading}
                                    >
                                        <Smartphone className="w-4 h-4" />
                                        Farmer Demo
                                    </Button>
                                </div>

                                <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                                    Demo credentials will be auto-filled. Click Sign In to proceed.
                                </div>
                            </div>

                            <div className="text-center text-sm pt-4 border-t border-gray-200 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">New to Mazao ERP? </span>
                                <Link
                                    to="/register"
                                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                                >
                                    Create an account
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;