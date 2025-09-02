import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Shield, Users, BarChart3, Leaf, Menu, X, Gauge, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/landing/Footer';

const Landing = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const smoothScroll = (id: string) => {
        sectionRefs.current[id]?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        setMobileMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
    };

    const features = [
        {
            icon: <BarChart3 className="w-10 h-10 text-green-600" />,
            title: "Real-time Analytics",
            description: "Monitor crop performance and farm metrics with live dashboards and detailed reports."
        },
        {
            icon: <Users className="w-10 h-10 text-green-600" />,
            title: "Farmer Management",
            description: "Efficiently manage farmer profiles, track activities, and maintain comprehensive records."
        },
        {
            icon: <Leaf className="w-10 h-10 text-green-600" />,
            title: "Crop Tracking",
            description: "From planting to harvest, track every stage of your crops with precision and ease."
        },
        {
            icon: <Shield className="w-10 h-10 text-green-600" />,
            title: "Secure & Reliable",
            description: "Enterprise-grade security ensuring your agricultural data is always protected."
        }
    ];

    return (
        <div className={`min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Navigation */}
            <nav className="flex justify-between items-center p-4 lg:p-6 max-w-7xl mx-auto">
                <div className="flex items-center space-x-2">
                    <Leaf className="w-8 h-8 text-green-600" />
                    <span className="text-2xl font-bold text-green-800">Mazao ERP</span>
                </div>

                {/* Desktop Navigation - Different for logged in users */}
                <div className="hidden md:flex space-x-6 items-center">
                    <button onClick={() => smoothScroll('features')} className="text-green-700 hover:text-green-600 font-medium transition-colors">Features</button>

                    {isAuthenticated ? (
                        <>
                            <div className="flex items-center space-x-4">
                                <span className="text-green-700 font-medium">
                                    Welcome, {user?.profile?.fullName ||  'User'}!
                                </span>
                                <Button
                                    onClick={() => navigate(user?.role === 'ADMIN' ? '/admin' : '/dashboard')}
                                    variant="outline"
                                    className="border-green-600 text-green-600 hover:bg-green-50"
                                >
                                    <Gauge className="w-4 h-4 mr-2" />
                                    Dashboard
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    variant="ghost"
                                    className="text-green-700 hover:bg-green-100"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate('/login')} className="text-green-700 hover:text-green-600 font-medium transition-colors">Login</button>
                            <Button onClick={() => navigate('/register')} className="bg-green-600 hover:bg-green-700 transition-transform hover:scale-105">
                                Get Started
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-green-800 transition-transform hover:scale-110"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Mobile Menu with Smooth Animation - Different for logged in users */}
                <div className={`fixed inset-0 bg-green-900 z-50 flex flex-col p-6 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center space-x-2">
                            <Leaf className="w-8 h-8 text-white" />
                            <span className="text-2xl font-bold text-white">Mazao ERP</span>
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-white hover:text-green-300 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex flex-col space-y-6 text-center">
                        <button onClick={() => smoothScroll('features')} className="text-white text-xl py-3 hover:text-green-300 transition-colors">Features</button>

                        {isAuthenticated ? (
                            <>
                                <div className="text-white text-lg py-3 border-b border-green-700 pb-6">
                                    Welcome, { user?.profile?.fullName || 'User'}!
                                </div>
                                <button
                                    onClick={() => { navigate(user?.role === 'ADMIN' ? '/admin' : '/dashboard'); setMobileMenuOpen(false); }}
                                    className="text-white text-xl py-3 hover:text-green-300 transition-colors flex items-center justify-center"
                                >
                                    <Gauge className="w-5 h-5 mr-2" />
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                                    className="text-white text-xl py-3 hover:text-green-300 transition-colors flex items-center justify-center"
                                >
                                    <User className="w-5 h-5 mr-2" />
                                    Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="text-white text-xl py-3 hover:text-green-300 transition-colors flex items-center justify-center"
                                >
                                    <LogOut className="w-5 h-5 mr-2" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="text-white text-xl py-3 hover:text-green-300 transition-colors">Login</button>
                                <div className="pt-6 border-t border-green-700 flex flex-col space-y-4">
                                    <Button
                                        className="bg-white text-green-800 hover:bg-green-100 transition-colors"
                                        onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                                    >
                                        Get Started
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section - Different for logged in users */}
            <section className="py-12 lg:py-20 px-4 lg:px-6">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
                    <div className="lg:w-1/2 text-center lg:text-left space-y-6">
                        {isAuthenticated ? (
                            <>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 leading-tight animate-fade-in-up">
                                    Welcome back,
                                    <span className="text-green-600 block">{ user?.profile?.fullName || 'Farmer'}!</span>
                                </h1>
                                <p className="text-lg text-green-700 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up delay-150">
                                    Ready to continue managing your agricultural operations? Access your dashboard to view latest updates, crop performance, and farmer activities.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-300">
                                    <Button
                                        size="lg"
                                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg transition-transform hover:scale-105"
                                        onClick={() => navigate(user?.role === 'ADMIN' ? '/admin' : '/dashboard')}
                                    >
                                        Go to Dashboard
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-6 text-lg transition-colors"
                                        onClick={() => navigate('/profile')}
                                    >
                                        View Profile
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 leading-tight animate-fade-in-up">
                                    Revolutionize Your
                                    <span className="text-green-600 block">Agricultural</span>
                                    Management
                                </h1>
                                <p className="text-lg text-green-700 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up delay-150">
                                    Mazao ERP brings modern technology to traditional farming. Manage your cooperative,
                                    track crops, and empower farmers with our comprehensive agricultural platform.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-300">
                                    <Button
                                        size="lg"
                                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg transition-transform hover:scale-105"
                                        onClick={() => navigate('/register')}
                                    >
                                        Start Now
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-6 text-lg transition-colors"
                                        onClick={() => navigate('/login')}
                                    >
                                        Existing User? Login
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="lg:w-1/2 mt-10 lg:mt-0 animate-fade-in-up delay-500">
                        <div className="bg-white rounded-2xl shadow-2xl p-2 border border-green-200 transform hover:scale-105 transition-transform duration-300 overflow-hidden">
                            {/* Modern browser header */}
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-t-xl flex items-center space-x-2">
                                <div className="flex space-x-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="flex-1 mx-3">
                                    <div className="bg-green-700/50 backdrop-blur-sm text-green-100 text-xs py-1 px-3 rounded-full text-center truncate">
                                        {isAuthenticated ? `welcome.${user?.profile?.fullName.toLowerCase() || 'user'}.mazao-erp.com` : 'dashboard.mazao-erp.com'}
                                    </div>
                                </div>
                                <div className="text-green-200 text-sm">{isAuthenticated ? '✓ Active' : '✓ Live'}</div>
                            </div>

                            {/* Interactive dashboard preview */}
                            <div className="p-4 bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-b-xl h-80 relative overflow-hidden">
                                {/* Animated background elements */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute top-10 left-10 w-20 h-20 bg-green-400 rounded-full animate-pulse"></div>
                                    <div className="absolute bottom-20 right-16 w-16 h-16 bg-emerald-400 rounded-full animate-pulse delay-1000"></div>
                                </div>

                                <div className="relative h-full flex">
                                    {/* Sidebar */}
                                    <div className="w-16 bg-white/80 backdrop-blur-sm rounded-lg mr-3 p-2 shadow-sm border border-green-100">
                                        <div className="space-y-3">
                                            <div className="p-1.5 bg-green-600 rounded-lg text-white">
                                                <Leaf className="w-5 h-5" />
                                            </div>
                                            <div className="p-1.5 text-green-600">
                                                <BarChart3 className="w-5 h-5" />
                                            </div>
                                            <div className="p-1.5 text-green-400">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div className="p-1.5 text-green-400">
                                                <Shield className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main content */}
                                    <div className="flex-1">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-4 p-2">
                                            <div>
                                                <div className="text-green-900 font-semibold text-sm">
                                                    {isAuthenticated ? `Welcome, ${user?.profile?.fullName || 'User'}!` : 'Farm Overview'}
                                                </div>
                                                <div className="text-green-600 text-xs">
                                                    {isAuthenticated ? 'Ready to work?' : 'Updated just now'}
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-bold">
                                                    {isAuthenticated ? ( user?.profile?.fullName?.[0] || 'U') : 'JK'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stats grid */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            {[
                                                { label: 'Total Crops', value: '142', trend: '+12%' },
                                                { label: 'Active Farmers', value: '28', trend: '+3' },
                                                { label: 'Yield (tons)', value: '45.2', trend: '+8.5%' },
                                                { label: 'This Season', value: 'Q1 2024', trend: 'On track' }
                                            ].map((stat, index) => (
                                                <div key={index} className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                                                    <div className="text-green-900 font-bold text-lg">{stat.value}</div>
                                                    <div className="text-green-600 text-xs">{stat.label}</div>
                                                    <div className="text-emerald-500 text-xs font-medium mt-1">{stat.trend}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Chart preview */}
                                        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-green-100 mb-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="text-green-900 font-semibold text-sm">Crop Performance</div>
                                                <div className="text-green-600 text-xs">Last 30 days</div>
                                            </div>
                                            <div className="h-16 bg-green-50 rounded relative">
                                                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around px-2">
                                                    {[20, 35, 50, 65, 45, 30, 55].map((height, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-2 bg-gradient-to-t from-green-400 to-emerald-500 rounded-t transition-all duration-500 hover:from-green-500 hover:to-emerald-600"
                                                            style={{ height: `${height}%` }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick actions */}
                                        <div className="flex space-x-2">
                                            <button className="flex-1 bg-green-600 text-white text-xs py-2 px-3 rounded-lg hover:bg-green-700 transition-colors">
                                                {isAuthenticated ? 'Add New' : 'Add Crop'}
                                            </button>
                                            <button className="flex-1 bg-white text-green-600 text-xs py-2 px-3 rounded-lg border border-green-300 hover:bg-green-50 transition-colors">
                                                {isAuthenticated ? 'My Stats' : 'View Reports'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Shine effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - Always visible but with personalized touch for logged-in users */}
            <section
                id="features"
                ref={(el: HTMLDivElement | null) => { sectionRefs.current.features = el; }}
                className="py-16 lg:py-24 px-4 lg:px-6 bg-white"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 lg:mb-20 animate-fade-in-up">
                        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
                            {isAuthenticated ? 'Continue Your Farming Journey' : 'Everything You Need for Modern Farming'}
                        </h2>
                        <p className="text-lg text-green-700 max-w-3xl mx-auto">
                            {isAuthenticated
                                ? `Explore all the tools and features available to manage your ${user?.role === 'ADMIN' ? 'agricultural cooperative' : 'farming operations'} efficiently.`
                                : 'Our platform is designed specifically for agricultural cooperatives and individual farmers to maximize productivity and profitability.'
                            }
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="text-center border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 h-full transform hover:-translate-y-2 animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CardHeader>
                                    <div className="flex justify-center mb-4">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-green-900 text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-green-700 text-base">
                                        {feature.description}
                                    </CardDescription>
                                    {isAuthenticated && (
                                        <Button
                                            variant="link"
                                            className="text-green-600 mt-4"
                                            onClick={() => navigate(user?.role === 'ADMIN' ? '/admin' : '/dashboard')}
                                        >
                                            Explore feature →
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Additional CTA for logged-in users */}
                    {isAuthenticated && (
                        <div className="text-center mt-16 animate-fade-in-up">
                            <Button
                                size="lg"
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg transition-transform hover:scale-105"
                                onClick={() => navigate(user?.role === 'ADMIN' ? '/admin' : '/dashboard')}
                            >
                                Continue to Full Dashboard
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            <Footer smoothScroll={smoothScroll} />
        </div>
    );
};

export default Landing;