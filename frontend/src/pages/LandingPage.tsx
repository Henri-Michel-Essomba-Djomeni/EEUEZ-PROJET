import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Award, Users, ArrowRight, CheckCircle, Star } from 'lucide-react';

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
            {/* Header / Nav */}
            <header className="fixed w-full top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-brand-600 dark:text-brand-400">
                        <BookOpen className="w-8 h-8" />
                        <span>EEUEZ Academy</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        >
                            Log in
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-4 py-2 text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors shadow-lg shadow-brand-500/20"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 overflow-hidden">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex-1 max-w-2xl"
                        >
                            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
                                Master New Skills with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Expert-Led Courses</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                Join thousands of learners worldwide. Access high-quality courses, mentorship, and certifications to advance your career.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/register')}
                                    className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-brand-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
                                >
                                    Start Learning Free <ArrowRight className="w-5 h-5" />
                                </button>
                                <button
                                    className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold text-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                >
                                    View Catalog
                                </button>
                            </div>
                            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-950 flex items-center justify-center text-xs font-bold">
                                            U{i}
                                        </div>
                                    ))}
                                </div>
                                <p>Trusted by 10,000+ students</p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex-1 relative"
                        >
                            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 aspect-video flex items-center justify-center">
                                {/* Placeholder for Hero Image */}
                                <div className="text-center p-8">
                                    <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="w-10 h-10 text-brand-600 dark:text-brand-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Internal Platform Preview</h3>
                                    <p className="text-slate-500">Interactive Learning Experience</p>
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            We provide a comprehensive learning experience designed to help you succeed in your professional journey.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Award className="w-10 h-10 text-brand-500" />,
                                title: "Recognized Certifications",
                                description: "Earn certificates upon completion to showcase your skills to employers."
                            },
                            {
                                icon: <Users className="w-10 h-10 text-brand-500" />,
                                title: "Expert Mentorship",
                                description: "Get guidance from industry professionals and experienced instructors."
                            },
                            {
                                icon: <CheckCircle className="w-10 h-10 text-brand-500" />,
                                title: "Practical Projects",
                                description: "Build real-world projects to reinforce your learning and build a portfolio."
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                            >
                                <div className="mb-6 p-4 bg-brand-50 dark:bg-slate-700/50 rounded-xl inline-block">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Student Success Stories</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <div className="flex gap-1 text-yellow-500 mb-4">
                                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                                    "The courses here are top-notch. I was able to transition into a new career within just 6 months of learning."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                    <div>
                                        <h4 className="font-bold">Student Name</h4>
                                        <p className="text-sm text-slate-500">Frontend Developer</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 font-bold text-xl text-white mb-4">
                                <BookOpen className="w-6 h-6" />
                                <span>EEUEZ Academy</span>
                            </div>
                            <p className="text-sm">
                                empowering the next generation of tech leaders through accessible education.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Platform</h4>
                            <ul className="space-y-2 text-sm">
                                <li>Browse Courses</li>
                                <li>Mentorship</li>
                                <li>Pricing</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li>About Us</li>
                                <li>Careers</li>
                                <li>Contact</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li>Privacy Policy</li>
                                <li>Terms of Service</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-800 text-center text-sm">
                        © {new Date().getFullYear()} EEUEZ Academy. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};
