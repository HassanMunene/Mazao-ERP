import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Shield, Users, BarChart3, Leaf, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <BarChart3 className="w-12 h-12 text-green-600" />,
            title: "Real-time Analytics",
            description: "Monitor crop performance and farm metrics with live dashboards and detailed reports."
        },
        {
            icon: <Users className="w-12 h-12 text-green-600" />,
            title: "Farmer Management",
            description: "Efficiently manage farmer profiles, track activities, and maintain comprehensive records."
        },
        {
            icon: <Leaf className="w-12 h-12 text-green-600" />,
            title: "Crop Tracking",
            description: "From planting to harvest, track every stage of your crops with precision and ease."
        },
        {
            icon: <Shield className="w-12 h-12 text-green-600" />,
            title: "Secure & Reliable",
            description: "Enterprise-grade security ensuring your agricultural data is always protected."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
            {/* Navigation */}
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
                <div className="flex items-center space-x-2">
                    <Leaf className="w-8 h-8 text-green-600" />
                    <span className="text-2xl font-bold text-green-800">Mazao ERP</span>
                </div>
                <div className="flex space-x-4">
                    <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
                    <Button onClick={() => navigate('/register')} className="bg-green-600 hover:bg-green-700">
                        Get Started
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-green-900 mb-6">
                        Revolutionize Your
                        <span className="text-green-600"> Agricultural </span>
                        Management
                    </h1>
                    <p className="text-xl text-green-700 mb-10 max-w-3xl mx-auto">
                        Mazao ERP brings modern technology to traditional farming. Manage your cooperative,
                        track crops, and empower farmers with our comprehensive agricultural platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
                            onClick={() => navigate('/register')}
                        >
                            Start Free Trial
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-green-600 text-green-600 px-8 py-6 text-lg"
                            onClick={() => navigate('/login')}
                        >
                            View Demo
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
                            Everything You Need for Modern Farming
                        </h2>
                        <p className="text-lg text-green-700 max-w-2xl mx-auto">
                            Our platform is designed specifically for agricultural cooperatives and individual farmers.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="text-center border-green-200 hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-center mb-4">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-green-900">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-green-700">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-6 bg-green-600 text-white">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-green-100">Farmers Empowered</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">10,000+</div>
                            <div className="text-green-100">Crops Managed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">98%</div>
                            <div className="text-green-100">Customer Satisfaction</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-6">
                        Ready to Transform Your Farming Operations?
                    </h2>
                    <p className="text-lg text-green-700 mb-8">
                        Join hundreds of agricultural professionals who trust Mazao ERP for their farm management needs.
                    </p>
                    <Button
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 text-lg"
                        onClick={() => navigate('/register')}
                    >
                        Get Started Today
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-green-900 text-green-100 py-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-2 mb-6">
                        <Leaf className="w-6 h-6" />
                        <span className="text-xl font-semibold">Mazao ERP</span>
                    </div>
                    <p className="text-green-300">
                        © 2024 Mazao ERP. Bringing technology to agriculture.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;