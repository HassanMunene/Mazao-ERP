import { Leaf, MapPin, Phone, Mail } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "../ui/button";

interface FooterProps {
    smoothScroll: (id: string) => void;
}

export default function Footer({ smoothScroll }: FooterProps) {
    const navigate = useNavigate();

    return (
        <>
            <section className="py-16 lg:py-24 px-4 lg:px-6 bg-green-900 text-white">
                <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Ready to Transform Your Farming Operations?
                    </h2>
                    <p className="text-lg text-green-100">
                        Join agricultural professionals who trust Mazao ERP for their farm management needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-green-900 hover:bg-green-100 px-8 py-6 text-lg transition-transform hover:scale-105"
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
                            Login to Dashboard
                        </Button>
                    </div>
                </div>
            </section>
            <footer className="bg-green-950 text-green-100 py-12 px-4 lg:px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <Leaf className="w-6 h-6" />
                            <span className="text-xl font-semibold">Mazao ERP</span>
                        </div>
                        <p className="text-green-300 mb-4">
                            Bringing modern technology to agriculture for sustainable farming and improved yields.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <button onClick={() => smoothScroll('features')} className="text-green-300 hover:text-white transition-colors">Features</button>
                            </li>
                            <li><button onClick={() => navigate('/login')} className="text-green-300 hover:text-white transition-colors">Login</button></li>
                            <li><button onClick={() => navigate('/register')} className="text-green-300 hover:text-white transition-colors">Register</button></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Contact</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-green-400" />
                                <span className="text-green-300">awanzihassan6@gmail.com</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-4 h-4 mr-2 text-green-400" />
                                <span className="text-green-300">+254 758 492 438</span>
                            </li>
                            <li className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-green-400" />
                                <span className="text-green-300">Nairobi, Kenya</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-green-800 text-center text-green-400 text-sm">
                    <p>© {new Date().getFullYear()} Mazao ERP. All rights reserved.</p>
                </div>
            </footer>
        </>

    )
}