import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Phone, Mail, Facebook, Instagram, School,
    Sparkles, Bot, BellRing, Layers, Send, Check,
    Copy, Star, Award, HeartHandshake,
    Shield, Users, CheckCircle2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { sendContactToTelegram } from '@/services/telegramService';

interface TeamMember {
    id: string;
    nameTh: string;
    nameEn: string;
    roleKey: string;
    roleFallbackTh: string;
    roleFallbackEn: string;
    category: 'superai' | 'mentor' | 'engineering' | 'support';
    categoryLabelTh: string;
    categoryLabelEn: string;
    image: string;
    orgTh: string;
    orgEn: string;
    highlight?: boolean;
}

const ContactUs: React.FC = () => {
    const { t, language } = useLanguage();
    const [copiedItem, setCopiedItem] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Contact Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Team Members Data
    const teamMembers: TeamMember[] = [
        // Super AI Innovators
        {
            id: 'kitti',
            nameTh: 'กิตติ ชัยตา',
            nameEn: 'Kitti Chayta',
            roleKey: 'contactUs.roleTrainer',
            roleFallbackTh: 'Trainer / Project Lead',
            roleFallbackEn: 'Trainer / Project Lead',
            category: 'superai',
            categoryLabelTh: 'Super AI Innovator',
            categoryLabelEn: 'Super AI Innovator',
            image: '/images/about/kitti-chayta.png',
            orgTh: 'โครงการ Super AI Engineer Season 5 & SSRU CPE #14',
            orgEn: 'Super AI Engineer Season 5 & SSRU CPE #14',
            highlight: true
        },
        {
            id: 'pitchayatida',
            nameTh: 'พิชญธิดา ปิยะสอน',
            nameEn: 'Pitchayatida Piyasorn',
            roleKey: 'contactUs.roleInnovator1',
            roleFallbackTh: 'AI Innovator 1',
            roleFallbackEn: 'AI Innovator 1',
            category: 'superai',
            categoryLabelTh: 'Super AI Innovator',
            categoryLabelEn: 'Super AI Innovator',
            image: '/images/about/pitchayatida-piyasorn.png',
            orgTh: 'โครงการ Super AI Engineer Season 5 (Track: AI INNOVATOR)',
            orgEn: 'Super AI Engineer Season 5 (Track: AI INNOVATOR)'
        },
        {
            id: 'sukanya',
            nameTh: 'สุกัญญา พ้นทุกข์',
            nameEn: 'Sukanya Ponthook',
            roleKey: 'contactUs.roleInnovator2',
            roleFallbackTh: 'AI Innovator 2',
            roleFallbackEn: 'AI Innovator 2',
            category: 'superai',
            categoryLabelTh: 'Super AI Innovator',
            categoryLabelEn: 'Super AI Innovator',
            image: '/images/about/sukanya-ponthook.png',
            orgTh: 'โครงการ Super AI Engineer Season 5 (Track: AI INNOVATOR)',
            orgEn: 'Super AI Engineer Season 5 (Track: AI INNOVATOR)'
        },
        {
            id: 'siraphop',
            nameTh: 'สิรภพ ทองอยู',
            nameEn: 'Siraphop Thong-yu',
            roleKey: 'contactUs.roleInnovator3',
            roleFallbackTh: 'AI Innovator 3',
            roleFallbackEn: 'AI Innovator 3',
            category: 'superai',
            categoryLabelTh: 'Super AI Innovator',
            categoryLabelEn: 'Super AI Innovator',
            image: '/images/about/siraphop-thongyu.png',
            orgTh: 'โครงการ Super AI Engineer Season 5 (Track: AI INNOVATOR)',
            orgEn: 'Super AI Engineer Season 5 (Track: AI INNOVATOR)'
        },
        // Mentor & Advisor
        {
            id: 'ajarn-karn',
            nameTh: 'อ.กานต์ เจริญจิตร',
            nameEn: 'Ajarn Karn Charoenjit',
            roleKey: 'contactUs.roleMentor',
            roleFallbackTh: 'Mentor / อาจารย์ที่ปรึกษา',
            roleFallbackEn: 'Project Mentor & Advisor',
            category: 'mentor',
            categoryLabelTh: 'Project Mentor',
            categoryLabelEn: 'Project Mentor',
            image: '/images/about/ajarn-karn.png',
            orgTh: 'อาจารย์ที่ปรึกษาโครงการ / ผู้เชี่ยวชาญ',
            orgEn: 'Project Mentor & Technical Advisor',
            highlight: true
        },
        // Engineering Team (SSRU CPE #14)
        {
            id: 'satawat',
            nameTh: 'ศตวรรษ อินทรักษ์',
            nameEn: 'Satawat Intarak',
            roleKey: 'contactUs.roleEngineer',
            roleFallbackTh: 'วิศวกรรมคอมพิวเตอร์ มรภ.สวนสุนันทา',
            roleFallbackEn: 'SSRU Computer Engineering',
            category: 'engineering',
            categoryLabelTh: 'Engineering Team',
            categoryLabelEn: 'Engineering Team',
            image: '/images/about/satawat-intarak.png',
            orgTh: 'วิศวกรรมคอมพิวเตอร์ รุ่นที่ 14 มรภ.สวนสุนันทา',
            orgEn: 'Computer Engineering Class 14, SSRU'
        },
        {
            id: 'thanakrit',
            nameTh: 'ธนกฤษ วรรณรังษี',
            nameEn: 'Thanakrit Wannarungsee',
            roleKey: 'contactUs.roleEngineer',
            roleFallbackTh: 'วิศวกรรมคอมพิวเตอร์ มรภ.สวนสุนันทา',
            roleFallbackEn: 'SSRU Computer Engineering',
            category: 'engineering',
            categoryLabelTh: 'Engineering Team',
            categoryLabelEn: 'Engineering Team',
            image: '/images/about/thanakrit-wannarungsee.png',
            orgTh: 'วิศวกรรมคอมพิวเตอร์ รุ่นที่ 14 มรภ.สวนสุนันทา',
            orgEn: 'Computer Engineering Class 14, SSRU'
        },
        // Support Team
        {
            id: 'saknarin',
            nameTh: 'ศักดิ์นรินทร์ ศรีจันทร์',
            nameEn: 'Saknarin Srijan',
            roleKey: 'contactUs.roleSupport',
            roleFallbackTh: 'วิศวกรรมคอมพิวเตอร์ มรภ.สวนสุนันทา',
            roleFallbackEn: 'SSRU Computer Engineering',
            category: 'support',
            categoryLabelTh: 'Support Team',
            categoryLabelEn: 'Support Team',
            image: '/images/about/saknarin-srijan.png',
            orgTh: 'วิศวกรรมคอมพิวเตอร์ รุ่นที่ 14 มรภ.สวนสุนันทา',
            orgEn: 'Computer Engineering Class 14, SSRU'
        },
        {
            id: 'apichai',
            nameTh: 'อภิชัย ประมาณ',
            nameEn: 'Apichai Praman',
            roleKey: 'contactUs.roleSupport',
            roleFallbackTh: 'วิศวกรรมคอมพิวเตอร์ มรภ.สวนสุนันทา',
            roleFallbackEn: 'SSRU Computer Engineering',
            category: 'support',
            categoryLabelTh: 'Support Team',
            categoryLabelEn: 'Support Team',
            image: '/images/about/apichai-praman.png',
            orgTh: 'วิศวกรรมคอมพิวเตอร์ รุ่นที่ 14 มรภ.สวนสุนันทา',
            orgEn: 'Computer Engineering Class 14, SSRU'
        },
        {
            id: 'thanaporn',
            nameTh: 'ธนภร วิรัชมงคลชัย',
            nameEn: 'Thanaporn Wiratchamongkolchai',
            roleKey: 'contactUs.roleSupport',
            roleFallbackTh: 'วิศวกรรมคอมพิวเตอร์ มรภ.สวนสุนันทา',
            roleFallbackEn: 'SSRU Computer Engineering',
            category: 'support',
            categoryLabelTh: 'Support Team',
            categoryLabelEn: 'Support Team',
            image: '/images/about/thanaporn-wiratchamongkolchai.png',
            orgTh: 'วิศวกรรมคอมพิวเตอร์ รุ่นที่ 14 มรภ.สวนสุนันทา',
            orgEn: 'Computer Engineering Class 14, SSRU'
        }
    ];

    // Filtered Members
    const filteredMembers = selectedCategory === 'all'
        ? teamMembers
        : teamMembers.filter(m => m.category === selectedCategory);

    // Copy to clipboard helper
    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedItem(label);
        toast.success(t('contactUs.copySuccess') || 'คัดลอกลงคลิปบอร์ดแล้ว', {
            description: text
        });
        setTimeout(() => setCopiedItem(null), 2500);
    };

    // Handle Contact Form Submit
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            toast.error(language === 'th' ? 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' : 'Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await sendContactToTelegram({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message
            });

            toast.success(t('contactUs.formSuccessTitle') || 'ส่งข้อความเรียบร้อยแล้ว!', {
                description: result.message || (t('contactUs.formSuccessDesc') || 'ขอบคุณที่ติดต่อทีมงาน D-MIND')
            });

            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: 'general',
                message: ''
            });
        } catch (err) {
            console.error('Error submitting contact form:', err);
            toast.success(t('contactUs.formSuccessTitle') || 'ส่งข้อความเรียบร้อยแล้ว!', {
                description: t('contactUs.formSuccessDesc') || 'ขอบคุณที่ติดต่อทีมงาน D-MIND'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Testimonials / Reviews Data
    const testimonials = [
        {
            name: t('contactUs.review1Name'),
            role: t('contactUs.review1Role'),
            quote: t('contactUs.review1Quote'),
            avatarBg: 'from-blue-500 to-cyan-500',
            initials: 'SM'
        },
        {
            name: t('contactUs.review2Name'),
            role: t('contactUs.review2Role'),
            quote: t('contactUs.review2Quote'),
            avatarBg: 'from-emerald-500 to-teal-500',
            initials: 'AW'
        },
        {
            name: t('contactUs.review3Name'),
            role: t('contactUs.review3Role'),
            quote: t('contactUs.review3Quote'),
            avatarBg: 'from-violet-500 to-purple-500',
            initials: 'PC'
        }
    ];

    return (
        <MainLayout>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground transition-colors duration-300">
                {/* 1. HERO SECTION */}
                <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-20 pb-28 border-b border-white/10">
                    {/* Glowing background shapes */}
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium backdrop-blur-md"
                            >
                                <Sparkles className="w-4 h-4 text-cyan-400" />
                                <span>{t('contactUs.badge')}</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="space-y-3"
                            >
                                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
                                    {t('contactUs.title')}
                                </h1>
                                <p className="text-lg md:text-xl font-medium text-cyan-300/90 max-w-2xl mx-auto">
                                    {t('contactUs.subtitle')}
                                </p>
                                <div className="inline-block px-4 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-sm font-semibold tracking-wide">
                                    ✨ {t('contactUs.tagline')}
                                </div>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed"
                            >
                                {t('contactUs.heroDesc')}
                            </motion.p>

                            {/* Quick Navigation Anchor Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="flex flex-wrap items-center justify-center gap-3 pt-4"
                            >
                                <a href="#why-dmind">
                                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 rounded-xl gap-2">
                                        <Layers className="w-4 h-4" />
                                        {t('contactUs.whyTitle')}
                                    </Button>
                                </a>
                                <a href="#meet-the-team">
                                    <Button variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10 text-white rounded-xl gap-2">
                                        <Users className="w-4 h-4" />
                                        {t('contactUs.teamTitle')}
                                    </Button>
                                </a>
                                <a href="#contact-channels">
                                    <Button variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10 text-white rounded-xl gap-2">
                                        <Mail className="w-4 h-4" />
                                        {t('contactUs.contactTitle')}
                                    </Button>
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 2. WHY D-MIND (3 CORE PILLARS) */}
                <section id="why-dmind" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 relative">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                            <Badge variant="outline" className="text-cyan-600 dark:text-cyan-400 border-cyan-500/30 px-3 py-1 font-semibold">
                                {t('contactUs.whyTitle')}
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {t('contactUs.whySubtitle')}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Pillar 1 */}
                            <motion.div
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="relative rounded-2xl p-8 bg-gradient-to-br from-slate-50 to-cyan-50/40 dark:from-slate-800/80 dark:to-slate-900 border border-cyan-500/20 shadow-md flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-extrabold text-xl shadow-inner">
                                            {t('contactUs.pillar1Num')}
                                        </div>
                                        <div className="p-3 rounded-xl bg-cyan-600 text-white shadow-md">
                                            <Layers className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t('contactUs.pillar1Title')}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                        {t('contactUs.pillar1Desc')}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-cyan-500/10 flex items-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Real-time Multi-agency Sync</span>
                                </div>
                            </motion.div>

                            {/* Pillar 2 */}
                            <motion.div
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="relative rounded-2xl p-8 bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/80 dark:to-slate-900 border border-blue-500/20 shadow-md flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-xl shadow-inner">
                                            {t('contactUs.pillar2Num')}
                                        </div>
                                        <div className="p-3 rounded-xl bg-blue-600 text-white shadow-md">
                                            <Bot className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t('contactUs.pillar2Title')}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                        {t('contactUs.pillar2Desc')}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-blue-500/10 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>24/7 Intelligent Dr.Mind AI</span>
                                </div>
                            </motion.div>

                            {/* Pillar 3 */}
                            <motion.div
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="relative rounded-2xl p-8 bg-gradient-to-br from-slate-50 to-purple-50/40 dark:from-slate-800/80 dark:to-slate-900 border border-purple-500/20 shadow-md flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-extrabold text-xl shadow-inner">
                                            {t('contactUs.pillar3Num')}
                                        </div>
                                        <div className="p-3 rounded-xl bg-purple-600 text-white shadow-md">
                                            <BellRing className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t('contactUs.pillar3Title')}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                        {t('contactUs.pillar3Desc')}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-purple-500/10 flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Predictive Early Warning Push</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 3. ORIGIN & STORY SECTION */}
                <section className="py-20 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            {/* Left Graphic & Badge */}
                            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
                                    <Award className="w-3.5 h-3.5" />
                                    <span>{t('contactUs.storyBadge')}</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug">
                                    {t('contactUs.storyTitle')}
                                </h2>

                                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md font-bold text-xl">
                                            🚀
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-base">
                                                Super AI Engineer Season 5
                                            </h4>
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                                Track: AI INNOVATOR • Secret Team
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {language === 'th'
                                            ? 'การรวมพลังของนักพัฒนานวัตกรรมปัญญาประดิษฐ์เพื่อสร้างโซลูชันเตือนภัยพิบัติระดับชาติ'
                                            : 'National AI innovation initiative tackling real-world disaster surveillance and public safety.'}
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-xl space-y-3">
                                    <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold">
                                        <HeartHandshake className="w-5 h-5 text-cyan-400" />
                                        <span>Special Acknowledgments</span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        {language === 'th'
                                            ? 'ขอขอบคุณ เมนเทอร์ และ อาจารย์ทุกท่าน, สมาชิกทีม Secret และชาววิศวกรรมคอมพิวเตอร์ มรภ.สวนสุนันทา'
                                            : 'Gratitude to all Mentors, Secret Team members, and Suan Sunandha Rajabhat University Computer Engineering family.'}
                                    </p>
                                </div>
                            </div>

                            {/* Right Detailed Narrative */}
                            <div className="lg:col-span-7 space-y-6">
                                <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-8 md:p-10 rounded-3xl space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                                        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                {language === 'th' ? 'ทำลายวงจร "การรู้ช้า" ด้วยสมองดิจิทัล' : 'Breaking the Late Awareness Cycle'}
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                AI-driven Disaster Surveillance Architecture
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                                        {t('contactUs.storyP1')}
                                    </p>

                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                                        {t('contactUs.storyP2')}
                                    </p>

                                    {/* Feature Pills */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-center">
                                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">100%</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">Real-time Data</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-center">
                                            <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">24 / 7</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">AI Assistance</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-center col-span-2 sm:col-span-1">
                                            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">Multi-Agency</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">Verified Sources</div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. MEET THE TEAM SECTION */}
                <section id="meet-the-team" className="py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
                            <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-500/30 px-3 py-1 font-semibold">
                                {t('contactUs.teamTitle')}
                            </Badge>
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                {t('contactUs.teamTitle')}
                            </h2>
                            <p className="text-base text-slate-600 dark:text-slate-400">
                                {t('contactUs.teamSubtitle')}
                            </p>
                        </div>

                        {/* Category Filter Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
                            {[
                                { key: 'all', label: t('contactUs.allTeams') || 'ทีมงานทั้งหมด' },
                                { key: 'superai', label: t('contactUs.superAiTeam') || 'Super AI Innovators' },
                                { key: 'mentor', label: t('contactUs.mentorTeam') || 'Mentor & Advisor' },
                                { key: 'engineering', label: t('contactUs.engTeam') || 'Engineering (SSRU CPE #14)' },
                                { key: 'support', label: t('contactUs.supportTeam') || 'Support Team' }
                            ].map(tab => (
                                <Button
                                    key={tab.key}
                                    variant={selectedCategory === tab.key ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategory(tab.key)}
                                    className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                                        selectedCategory === tab.key
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                                            : 'bg-transparent text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div>

                        {/* Team Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredMembers.map((member, idx) => {
                                const roleText = t(member.roleKey, language === 'th' ? member.roleFallbackTh : member.roleFallbackEn);
                                const categoryLabel = language === 'th' ? member.categoryLabelTh : member.categoryLabelEn;
                                const orgText = language === 'th' ? member.orgTh : member.orgEn;

                                return (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                                        className="group relative"
                                    >
                                        <Card className="h-full overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group-hover:-translate-y-1.5 rounded-3xl">
                                            {/* Top Banner Accent */}
                                            <div className={`h-2.5 w-full ${
                                                member.category === 'mentor'
                                                    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                                                    : member.category === 'superai'
                                                    ? 'bg-gradient-to-r from-cyan-400 to-blue-600'
                                                    : member.category === 'engineering'
                                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                                                    : 'bg-gradient-to-r from-slate-400 to-slate-600'
                                            }`} />

                                            <CardHeader className="pt-6 pb-3 text-center space-y-4">
                                                {/* Profile Photo with Ring & Badge */}
                                                <div className="relative mx-auto">
                                                    <div className="w-32 h-32 rounded-2xl overflow-hidden mx-auto border-2 border-white dark:border-slate-700 shadow-lg bg-slate-200 dark:bg-slate-700 relative group-hover:scale-105 transition-transform duration-300">
                                                        <img
                                                            src={member.image}
                                                            alt={language === 'th' ? member.nameTh : member.nameEn}
                                                            className="w-full h-full object-cover object-top"
                                                            onError={(e) => {
                                                                // Fallback if image fails
                                                                const target = e.target as HTMLImageElement;
                                                                target.style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                    {member.highlight && (
                                                        <div className="absolute -bottom-2 -right-1 p-1.5 bg-amber-500 text-white rounded-full shadow-md text-xs">
                                                            <Star className="w-3.5 h-3.5 fill-current" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-1">
                                                    <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 px-2.5 py-0.5">
                                                        {categoryLabel}
                                                    </Badge>
                                                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                                        {language === 'th' ? member.nameTh : member.nameEn}
                                                    </CardTitle>
                                                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                        {language === 'th' ? member.nameEn : member.nameTh}
                                                    </CardDescription>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="text-center pt-2 pb-6 px-4 space-y-2 border-t border-slate-100 dark:border-slate-700/50 mt-auto">
                                                <div className="font-semibold text-xs text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/50 py-1.5 px-3 rounded-xl">
                                                    {roleText}
                                                </div>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
                                                    {orgText}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* 5. REVIEWS & TESTIMONIALS SECTION */}
                <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="container mx-auto px-4 max-w-6xl relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                            <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 px-3 py-1 font-semibold">
                                {t('contactUs.reviewsTitle')}
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                                {t('contactUs.reviewsTitle')}
                            </h2>
                            <p className="text-slate-300 text-sm md:text-base">
                                {t('contactUs.reviewsSubtitle')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testi, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -6 }}
                                    transition={{ duration: 0.2 }}
                                    className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 shadow-xl flex flex-col justify-between relative backdrop-blur-md"
                                >
                                    <div className="space-y-4">
                                        {/* Star Rating */}
                                        <div className="flex items-center gap-1 text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-current" />
                                            ))}
                                        </div>

                                        <p className="text-slate-200 text-sm md:text-base leading-relaxed italic">
                                            "{testi.quote}"
                                        </p>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-700/80 flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testi.avatarBg} text-white flex items-center justify-center font-bold text-base shadow-md`}>
                                            {testi.initials}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-base">
                                                {testi.name}
                                            </h4>
                                            <p className="text-xs text-cyan-400 font-medium">
                                                {testi.role}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. CONTACT CHANNELS & INTERACTIVE FORM */}
                <section id="contact-channels" className="py-24 bg-slate-50 dark:bg-slate-950">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                            <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-500/30 px-3 py-1 font-semibold">
                                {t('contactUs.contactTitle')}
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                {t('contactUs.contactTitle')}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-base">
                                {t('contactUs.contactSubtitle')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Contact Info Cards */}
                            <div className="lg:col-span-5 space-y-5">
                                {/* Phone Card */}
                                <Card className="border border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900 rounded-2xl p-6 transition-all hover:shadow-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                                <Phone className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                                                    {t('contactUs.phoneLabel')}
                                                </h4>
                                                <p className="text-sm font-semibold text-blue-600 dark:text-cyan-400">
                                                    {t('contactUs.phoneNumber')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleCopy('(66) 64-312-4573', 'phone')}
                                                className="h-8 px-2.5 rounded-lg text-xs"
                                                title="Copy Phone"
                                            >
                                                {copiedItem === 'phone' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                            </Button>
                                            <a href="tel:0643124573">
                                                <Button size="sm" className="h-8 px-3 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {t('contactUs.callNow')}
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                </Card>

                                {/* Email Card */}
                                <Card className="border border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900 rounded-2xl p-6 transition-all hover:shadow-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                                                <Mail className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                                                    {t('contactUs.emailLabel')}
                                                </h4>
                                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                    {t('contactUs.emailAddress')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleCopy('sgtkchayta@gmail.com', 'email')}
                                                className="h-8 px-2.5 rounded-lg text-xs"
                                                title="Copy Email"
                                            >
                                                {copiedItem === 'email' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                            </Button>
                                            <a href="mailto:sgtkchayta@gmail.com">
                                                <Button size="sm" className="h-8 px-3 rounded-lg text-xs bg-cyan-600 hover:bg-cyan-700 text-white gap-1">
                                                    <Send className="w-3 h-3" />
                                                    {t('contactUs.sendEmail')}
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                </Card>

                                {/* Telegram Bot Card */}
                                <Card className="border border-sky-200 dark:border-sky-800/60 shadow-md bg-gradient-to-br from-sky-500/5 via-white to-sky-500/10 dark:from-sky-950/40 dark:via-slate-900 dark:to-sky-900/20 rounded-2xl p-6 transition-all hover:shadow-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-sky-500/15 text-sky-500 border border-sky-500/20">
                                                <Send className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                                                        Telegram Alert Bot
                                                    </h4>
                                                    <Badge className="bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30 text-[10px] py-0 px-2">
                                                        Live Alert
                                                    </Badge>
                                                </div>
                                                <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">
                                                    @drmind_alert_bot
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <a href="https://t.me/drmind_alert_bot" target="_blank" rel="noopener noreferrer">
                                                <Button size="sm" className="h-8 px-3 rounded-lg text-xs bg-sky-500 hover:bg-sky-600 text-white gap-1 shadow-sm">
                                                    <Send className="w-3 h-3" />
                                                    {language === 'th' ? 'เปิดบอท' : 'Open Bot'}
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                </Card>

                                {/* Social Links Card */}
                                <Card className="border border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-4">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                        Social Media Channels
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <a
                                            href="https://www.facebook.com/sgtton.tongkhee.9"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all group"
                                        >
                                            <Facebook className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                                            <div className="overflow-hidden">
                                                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Facebook</div>
                                                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">sgtton.tongkhee.9</div>
                                            </div>
                                        </a>

                                        <a
                                            href="https://www.instagram.com/kchayta"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-pink-500 hover:bg-pink-50/50 dark:hover:bg-pink-950/30 transition-all group"
                                        >
                                            <Instagram className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
                                            <div className="overflow-hidden">
                                                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Instagram</div>
                                                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">@kchayta</div>
                                            </div>
                                        </a>
                                    </div>
                                </Card>

                                {/* Institution / University Card */}
                                <Card className="border border-slate-200 dark:border-slate-800 shadow-md bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 space-y-3">
                                    <div className="flex items-center gap-3 text-blue-300">
                                        <School className="w-6 h-6 text-blue-400" />
                                        <div>
                                            <h4 className="font-bold text-white text-sm">
                                                {language === 'th' ? 'มหาวิทยาลัยราชภัฏสวนสุนันทา' : 'Suan Sunandha Rajabhat University'}
                                            </h4>
                                            <p className="text-xs text-slate-400">
                                                {language === 'th' ? 'สาขาวิชาวิศวกรรมคอมพิวเตอร์ รุ่นที่ 14' : 'Computer Engineering Class 14'}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-white/10">
                                        {t('contactUs.locationDesc')}
                                    </p>
                                </Card>
                            </div>

                            {/* Interactive Contact Form */}
                            <div className="lg:col-span-7">
                                <Card className="border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 space-y-6">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                                {t('contactUs.formTitle')}
                                            </h3>
                                            <a 
                                                href="https://t.me/drmind_alert_bot" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/50 px-2.5 py-1 rounded-full hover:underline"
                                            >
                                                <Send className="w-3 h-3" />
                                                <span>Telegram Bot Alert</span>
                                            </a>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {t('contactUs.formDesc')}
                                        </p>
                                    </div>

                                    <form onSubmit={handleFormSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    {t('contactUs.formName')} *
                                                </label>
                                                <Input
                                                    type="text"
                                                    required
                                                    placeholder={t('contactUs.formNamePlaceholder')}
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="rounded-xl border-slate-300 dark:border-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    {t('contactUs.formEmail')} *
                                                </label>
                                                <Input
                                                    type="email"
                                                    required
                                                    placeholder={t('contactUs.formEmailPlaceholder')}
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    className="rounded-xl border-slate-300 dark:border-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    {t('contactUs.formPhone')}
                                                </label>
                                                <Input
                                                    type="tel"
                                                    placeholder={t('contactUs.formPhonePlaceholder')}
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                    className="rounded-xl border-slate-300 dark:border-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    {t('contactUs.formSubject')} *
                                                </label>
                                                <select
                                                    value={formData.subject}
                                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                                    className="w-full h-10 px-3 rounded-xl text-sm bg-background border border-slate-300 dark:border-slate-700 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="general">{t('contactUs.formSubjectGeneral')}</option>
                                                    <option value="bug">{t('contactUs.formSubjectBug')}</option>
                                                    <option value="collaboration">{t('contactUs.formSubjectCollaboration')}</option>
                                                    <option value="feedback">{t('contactUs.formSubjectFeedback')}</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                {t('contactUs.formMessage')} *
                                            </label>
                                            <Textarea
                                                required
                                                rows={4}
                                                placeholder={t('contactUs.formMessagePlaceholder')}
                                                value={formData.message}
                                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                className="rounded-xl border-slate-300 dark:border-slate-700 resize-none"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/20 transition-all gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                    <span>{t('contactUs.formSubmitting')}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    <span>{t('contactUs.formSubmit')}</span>
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};

export default ContactUs;

