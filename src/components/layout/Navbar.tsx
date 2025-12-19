import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Moon, Sun, Globe, Menu, X, Search,
    Home, Phone, AlertTriangle, FileText,
    Smile, BookOpen, Bot, Info, Mail
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import AnimatedLogo from '@/components/ui/AnimatedLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeProvider';
import { useLanguage } from '@/contexts/LanguageProvider';

// Menu Items Configuration with Icons
const MENU_ITEMS_CONFIG = [
    { key: 'home', route: '/', icon: Home, color: 'text-blue-400' },
    { key: 'emergency', route: '/contacts', icon: Phone, color: 'text-red-400' },
    { key: 'victim', route: '/victim-reports', icon: AlertTriangle, color: 'text-orange-400' },
    { key: 'incident', route: '/incident-reports', icon: FileText, color: 'text-yellow-400' },
    { key: 'survey', route: '/satisfaction-survey', icon: Smile, color: 'text-green-400' },
    { key: 'research', route: '/manual', icon: BookOpen, color: 'text-cyan-400' },
    { key: 'assistant', route: '/assistant', icon: Bot, color: 'text-violet-400' },
    { key: 'about', href: 'https://d-mind.my.canva.site/', icon: Info, color: 'text-pink-400' },
    { key: 'contact', route: '/contactme', icon: Mail, color: 'text-indigo-400' },
];

const Navbar: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Close menu when route changes
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    // Handle Menu Navigation
    const handleMenuClick = (item: typeof MENU_ITEMS_CONFIG[0]) => {
        if (item.href) {
            window.open(item.href, '_blank');
        } else if (item.route) {
            navigate(item.route);
        }
        setMenuOpen(false);
    };

    // Animation Variants
    const menuVariants = {
        closed: {
            opacity: 0,
            y: "-100%",
            transition: {
                duration: 0.5,
                ease: [0.76, 0, 0.24, 1] as const,
                when: "afterChildren"
            }
        },
        open: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.76, 0, 0.24, 1] as const,
                when: "beforeChildren",
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, y: 20 },
        open: { opacity: 1, y: 0 }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-white/5"
            >
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo Area */}
                    <div className="cursor-pointer z-50" onClick={() => navigate('/')}>
                        <AnimatedLogo size="sm" />
                    </div>

                    {/* Desktop/Tablet Actions */}
                    <div className="flex items-center gap-2 z-50">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                            <motion.div
                                initial={false}
                                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            </motion.div>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full hidden md:flex items-center gap-2"
                            onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
                        >
                            <Globe className="h-4 w-4" />
                            <span className="text-sm font-medium">{language === 'th' ? 'TH' : 'EN'}</span>
                        </Button>

                        <div className="w-px h-6 bg-white/20 mx-1 hidden md:block" />

                        {/* Burger Toggle */}
                        <motion.button
                            className="p-2 text-white hover:bg-white/10 rounded-full relative z-50 focus:outline-none"
                            onClick={() => setMenuOpen(!menuOpen)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <AnimatePresence mode="wait">
                                {menuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ opacity: 0, rotate: -90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="h-6 w-6" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ opacity: 0, rotate: 90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: -90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="h-6 w-6" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Full Screen Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl flex flex-col pt-24 pb-8 px-4 overflow-y-auto"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                    >
                        {/* Optional Background Decorative Elements */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

                        <div className="container mx-auto max-w-2xl relative z-10 font-[family-name:Inter,sans-serif]">
                            <motion.h2
                                variants={itemVariants}
                                className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-6"
                            >
                                {t('menu.menuTitle')}
                            </motion.h2>

                            {/* 2-Column Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {MENU_ITEMS_CONFIG.map((item, index) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.route;
                                    const label = t(`menu.${item.key}`);

                                    return (
                                        <motion.button
                                            key={index}
                                            variants={itemVariants}
                                            onClick={() => handleMenuClick(item)}
                                            className={`
                                                group flex flex-col items-center justify-center gap-3 p-4 rounded-xl text-center transition-all duration-300
                                                ${isActive ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'}
                                            `}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className={`
                                                p-3 rounded-full bg-slate-900 border border-white/10
                                                ${item.color} group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300
                                            `}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className={`text-sm font-semibold text-slate-200 group-hover:text-white transition-colors`}>
                                                    {label}
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            <motion.div
                                variants={itemVariants}
                                className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center"
                            >
                                <div className="text-slate-500 text-sm">
                                    © 2025 D-MIND Application
                                </div>
                                <div className="flex gap-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-slate-400 hover:text-white"
                                        onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
                                    >
                                        <Globe className="w-4 h-4 mr-2" />
                                        {t('menu.changeLanguage')}
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
