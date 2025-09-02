import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowRight,
    Shield,
    Users,
    BarChart3,
    Leaf,
    Target,
    ChevronLeft,
    ChevronRight,
    Play,
    Star,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Menu,
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

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
        },
        {
            icon: <Target className="w-10 h-10 text-green-600" />,
            title: "Precision Farming",
            description: "Optimize resources with data-driven insights for better yield and reduced waste."
        },
        {
            icon: <Calendar className="w-10 h-10 text-green-600" />,
            title: "Season Planning",
            description: "Plan planting and harvesting schedules with predictive weather and market analysis."
        }
    ];

    const testimonials = [
        {
            name: "James Kariuki",
            role: "Farm Manager, GreenValley Co-op",
            content: "Mazao ERP has transformed how we manage our cooperative. Crop tracking and yield predictions have improved our planning by 40%.",
            avatar: "JK"
        },
        {
            name: "Sarah Johnson",
            role: "Agricultural Director, AgriSolutions Ltd",
            content: "The analytics dashboard provides insights we never had before. We've reduced waste by 22% in the first season of using Mazao.",
            avatar: "SJ"
        },
        {
            name: "Michael Otieno",
            role: "CEO, FarmConnect Africa",
            content: "Implementation was seamless and our farmers adopted the mobile app quickly. The support team is exceptional.",
            avatar: "MO"
        }
    ];

    const partners = [
        { name: "AgriTech Solutions", logo: "ATS" },
        { name: "GreenGrowth", logo: "GG" },
        { name: "FarmFuture", logo: "FF" },
        { name: "CropCare", logo: "CC" },
        { name: "HarvestHub", logo: "HH" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
            {/* Navigation */}
            <nav className="flex justify-between items-center p-4 lg:p-6 max-w-7xl mx-auto">
                <div className="flex items-center space-x-2">
                    <Leaf className="w-8 h-8 text-green-600" />
                    <span className="text-2xl font-bold text-green-800">Mazao ERP</span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-6 items-center">
                    <a href="#features" className="text-green-700 hover:text-green-600 font-medium">Features</a>
                    <a href="#testimonials" className="text-green-700 hover:text-green-600 font-medium">Testimonials</a>
                    <a href="#pricing" className="text-green-700 hover:text-green-600 font-medium">Pricing</a>
                    <a href="#contact" className="text-green-700 hover:text-green-600 font-medium">Contact</a>
                </div>

                <div className="hidden md:flex space-x-4">
                    <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
                    <Button onClick={() => navigate('/register')} className="bg-green-600 hover:bg-green-700">
                        Get Started
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-green-800"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 bg-green-900 z-50 flex flex-col p-6">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center space-x-2">
                                <Leaf className="w-8 h-8 text-white" />
                                <span className="text-2xl font-bold text-white">Mazao ERP</span>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)}>
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>
                        <div className="flex flex-col space-y-6 text-center">
                            <a href="#features" className="text-white text-xl py-3" onClick={() => setMobileMenuOpen(false)}>Features</a>
                            <a href="#testimonials" className="text-white text-xl py-3" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
                            <a href="#pricing" className="text-white text-xl py-3" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                            <a href="#contact" className="text-white text-xl py-3" onClick={() => setMobileMenuOpen(false)}>Contact</a>
                            <div className="pt-6 border-t border-green-700 flex flex-col space-y-4">
                                <Button variant="outline" className="text-white border-white" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Login</Button>
                                <Button className="bg-white text-green-800" onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}>
                                    Get Started
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="py-12 lg:py-20 px-4 lg:px-6">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-6 leading-tight">
                            Revolutionize Your
                            <span className="text-green-600 block">Agricultural</span>
                            Management
                        </h1>
                        <p className="text-lg text-green-700 mb-8 max-w-2xl mx-auto lg:mx-0">
                            Mazao ERP brings modern technology to traditional farming. Manage your cooperative, track crops, and empower farmers with our comprehensive agricultural platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
                                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-6 text-lg flex items-center"
                            >
                                <Play className="w-5 h-5 mr-2 fill-current" />
                                Watch Demo
                            </Button>
                        </div>
                        <div className="mt-8 flex items-center justify-center lg:justify-start space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-green-800 ml-2">4.9/5 from 500+ reviews</span>
                        </div>
                    </div>
                    <div className="lg:w-1/2 mt-10 lg:mt-0">
                        <div className="bg-white rounded-2xl shadow-2xl p-2 border border-green-200">
                            <div className="bg-green-600 text-white p-4 rounded-t-xl flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-green-300"></div>
                                <div className="w-3 h-3 rounded-full bg-green-300"></div>
                                <div className="w-3 h-3 rounded-full bg-green-300"></div>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-b-xl h-80 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="animate-pulse mb-4">
                                        <Leaf className="w-16 h-16 text-green-600 mx-auto" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-green-800">Mazao ERP Dashboard</h3>
                                    <p className="text-green-600 mt-2">Real-time farm management interface</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <p className="text-center text-green-700 mb-8">Trusted by agricultural leaders worldwide</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {partners.map((partner, index) => (
                            <div key={index} className="flex items-center justify-center h-16 w-40 bg-green-50 rounded-lg p-4">
                                <span className="font-semibold text-green-800">{partner.logo}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 lg:py-24 px-4 lg:px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 lg:mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
                            Everything You Need for Modern Farming
                        </h2>
                        <p className="text-lg text-green-700 max-w-3xl mx-auto">
                            Our platform is designed specifically for agricultural cooperatives and individual farmers to maximize productivity and profitability.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="text-center border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 h-full">
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
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 lg:py-20 px-4 lg:px-6 bg-green-600 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-green-100">Farmers Empowered</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-2">10,000+</div>
                            <div className="text-green-100">Crops Managed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-2">98%</div>
                            <div className="text-green-100">Customer Satisfaction</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-2">30%</div>
                            <div className="text-green-100">Average Yield Increase</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-16 lg:py-24 px-4 lg:px-6 bg-gradient-to-b from-white to-green-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
                            What Our Clients Say
                        </h2>
                        <p className="text-lg text-green-700 max-w-2xl mx-auto">
                            Hear from agricultural professionals who have transformed their operations with Mazao ERP.
                        </p>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-green-100">
                            <div className="flex items-start mb-6">
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mr-6">
                                    <span className="text-green-800 font-bold text-xl">{testimonials[currentTestimonial].avatar}</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-green-900">{testimonials[currentTestimonial].name}</h4>
                                    <p className="text-green-600">{testimonials[currentTestimonial].role}</p>
                                </div>
                            </div>
                            <p className="text-green-800 text-lg">"{testimonials[currentTestimonial].content}"</p>

                            <div className="flex justify-center mt-8 space-x-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`w-3 h-3 rounded-full ${index === currentTestimonial ? 'bg-green-600' : 'bg-green-300'}`}
                                        onClick={() => setCurrentTestimonial(index)}
                                        aria-label={`View testimonial ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-5 bg-white rounded-full p-2 shadow-md border border-green-200 hidden md:block"
                            onClick={() => setCurrentTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length)}
                        >
                            <ChevronLeft className="w-5 h-5 text-green-700" />
                        </button>
                        <button
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-5 bg-white rounded-full p-2 shadow-md border border-green-200 hidden md:block"
                            onClick={() => setCurrentTestimonial((currentTestimonial + 1) % testimonials.length)}
                        >
                            <ChevronRight className="w-5 h-5 text-green-700" />
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-24 px-4 lg:px-6 bg-green-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Transform Your Farming Operations?
                    </h2>
                    <p className="text-lg text-green-100 mb-8">
                        Join hundreds of agricultural professionals who trust Mazao ERP for their farm management needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-green-900 hover:bg-green-100 px-8 py-6 text-lg"
                            onClick={() => navigate('/register')}
                        >
                            Start Free Trial
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-green-800 px-8 py-6 text-lg"
                            onClick={() => navigate('/contact')}
                        >
                            Contact Sales
                        </Button>
                    </div>
                    <p className="mt-6 text-green-200 text-sm">No credit card required. 30-day free trial.</p>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-green-950 text-green-100 py-12 px-4 lg:px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <Leaf className="w-6 h-6" />
                            <span className="text-xl font-semibold">Mazao ERP</span>
                        </div>
                        <p className="text-green-300 mb-4">
                            Bringing modern technology to agriculture for sustainable farming and improved yields.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-green-300 hover:text-white">
                                <span className="sr-only">Twitter</span>
                                <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center">T</div>
                            </a>
                            <a href="#" className="text-green-300 hover:text-white">
                                <span className="sr-only">Facebook</span>
                                <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center">F</div>
                            </a>
                            <a href="#" className="text-green-300 hover:text-white">
                                <span className="sr-only">LinkedIn</span>
                                <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center">L</div>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li><a href="#features" className="text-green-300 hover:text-white">Features</a></li>
                            <li><a href="#pricing" className="text-green-300 hover:text-white">Pricing</a></li>
                            <li><a href="#" className="text-green-300 hover:text-white">Case Studies</a></li>
                            <li><a href="#" className="text-green-300 hover:text-white">Reviews</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-green-300 hover:text-white">About Us</a></li>
                            <li><a href="#" className="text-green-300 hover:text-white">Careers</a></li>
                            <li><a href="#" className="text-green-300 hover:text-white">Blog</a></li>
                            <li><a href="#" className="text-green-300 hover:text-white">Press</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Contact</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-green-400" />
                                <a href="mailto:info@mazaoerp.com" className="text-green-300 hover:text-white">info@mazaoerp.com</a>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-4 h-4 mr-2 text-green-400" />
                                <a href="tel:+1234567890" className="text-green-300 hover:text-white">+1 (234) 567-890</a>
                            </li>
                            <li className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-green-400" />
                                <span className="text-green-300">Nairobi, Kenya</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-green-800 text-center text-green-400 text-sm">
                    <p>© 2024 Mazao ERP. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;