import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Moon, Sun, Globe, Menu, X, Search,
    Home, Phone, AlertTriangle, FileText,
    Smile, BookOpen, Bot, Info, Mail, CloudSun, Waves, MapPin, Coffee, Star
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import AnimatedLogo from '@/components/ui/AnimatedLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeProvider';
import { useLanguage } from '@/contexts/LanguageProvider';

// Menu Items Configuration with Icons
const MENU_ITEMS_CONFIG = [
    { key: 'home', route: '/', icon: Home, color: 'text-blue-400' },
    { key: 'disasterMap', route: '/disaster-map', icon: MapPin, color: 'text-emerald-400' },
    { key: 'cafeFlood', route: '/cafe-flood-map', icon: Coffee, color: 'text-amber-400' },
    { key: 'bkkFlood', route: '/bangkok-flood', icon: Waves, color: 'text-cyan-400' },
    { key: 'disasterNews', route: '/disaster-news', icon: CloudSun, color: 'text-sky-400' },
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
    const { resolvedTheme, toggleTheme } = useTheme();
    const { language, toggleLanguage, t } = useLanguage();
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
                className="fixed top-0 left-0 right-0 z-[9990] bg-white/95 dark:bg-slate-950/90 backdrop-blur-md shadow-xs dark:shadow-md border-b border-slate-200/90 dark:border-white/10 transition-colors duration-300"
            >
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo Area */}
                    <div className="cursor-pointer z-50" onClick={() => navigate('/')}>
                        <AnimatedLogo size="sm" />
                    </div>

                    {/* Desktop/Tablet Actions */}
                    <div className="flex items-center gap-2 z-50">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden xl:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-400/40 hover:border-emerald-500 text-xs font-bold rounded-full px-3 py-1 shadow-xs transition-all"
                            onClick={() => navigate('/disaster-map')}
                        >
                            <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>แผนที่ภัยพิบัติ</span>
                            <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">GIS</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden lg:flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-600/20 dark:hover:bg-amber-600/30 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-400/40 hover:border-amber-500 text-xs font-bold rounded-full px-3 py-1 shadow-xs transition-all"
                            onClick={() => navigate('/cafe-flood-map')}
                        >
                            <Coffee className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                            <span>เรดาร์คาเฟ่ & บาร์</span>
                            <span className="bg-amber-500 text-slate-900 text-[9px] px-1.5 py-0.5 rounded-full font-bold">AI</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden md:flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 dark:bg-blue-600/20 dark:hover:bg-blue-600/30 text-sky-800 dark:text-sky-200 border-sky-300 dark:border-sky-400/40 hover:border-sky-500 text-xs font-bold rounded-full px-3 py-1 shadow-xs transition-all"
                            onClick={() => navigate('/bangkok-flood')}
                        >
                            <Waves className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 animate-pulse" />
                            <span>น้ำท่วมถนน กทม.</span>
                            <span className="bg-sky-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">LIVE</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden 2xl:flex items-center gap-1.5 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-500/20 dark:hover:bg-yellow-500/30 text-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-400/40 hover:border-yellow-500 text-xs font-bold rounded-full px-3 py-1 shadow-xs transition-all"
                            onClick={() => navigate('/satisfaction-survey')}
                        >
                            <Star className="h-3.5 w-3.5 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                            <span>ประเมินความพึงพอใจ</span>
                            <span className="bg-yellow-500 text-slate-950 text-[9px] px-1.5 py-0.5 rounded-full font-bold">5.0</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"
                            onClick={toggleTheme}
                            title={t('theme.toggleTheme')}
                        >
                            <motion.div
                                initial={false}
                                animate={{ rotate: resolvedTheme === 'dark' ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {resolvedTheme === 'dark' ? (
                                    <Sun className="h-5 w-5 text-yellow-400" />
                                ) : (
                                    <Moon className="h-5 w-5 text-slate-700 hover:text-blue-600" />
                                )}
                            </motion.div>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-full flex items-center gap-1.5 px-3"
                            onClick={toggleLanguage}
                            title={t('menu.changeLanguage')}
                        >
                            <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{language.toUpperCase()}</span>
                        </Button>

                        <div className="w-px h-6 bg-slate-200 dark:bg-white/20 mx-1" />

                        {/* Burger Toggle */}
                        <motion.button
                            className="p-2 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-full relative z-50 focus:outline-none"
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
                        className="fixed inset-0 z-40 bg-white/98 dark:bg-slate-950/95 backdrop-blur-xl flex flex-col pt-24 pb-8 px-4 overflow-y-auto text-slate-900 dark:text-slate-100 transition-colors"
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
                                className="text-sm font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-6"
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
                                                ${isActive
                                                    ? 'bg-blue-50 dark:bg-white/10 border border-blue-200 dark:border-white/20 shadow-xs'
                                                    : 'bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/80 dark:border-transparent'}
                                            `}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className={`
                                                p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs
                                                ${item.color} group-hover:scale-110 transition-all duration-300
                                            `}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className={`text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white transition-colors`}>
                                                    {label}
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            <motion.div
                                variants={itemVariants}
                                className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10 flex justify-between items-center"
                            >
                                <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                                    © 2025 D-MIND Application
                                </div>
                                <div className="flex gap-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium"
                                        onClick={toggleLanguage}
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
