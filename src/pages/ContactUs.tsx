import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Code, School } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider';

const ContactUs: React.FC = () => {
    const { t, language } = useLanguage();

    const teamMembers = [
        {
            nameTh: 'กิตติ ชัยตา',
            nameEn: 'Kitti Chayta',
            icon: <Code className="w-10 h-10 text-blue-500" />
        },
        {
            nameTh: 'ศตวรรษ อินทรักษ์',
            nameEn: 'Satawat Intarak',
            icon: <Code className="w-10 h-10 text-purple-500" />
        },
        {
            nameTh: 'ธนกฤษ วรรณรังษี',
            nameEn: 'Thanakrit Wannarungsee',
            icon: <Code className="w-10 h-10 text-indigo-500" />
        }
    ];

    return (
        <MainLayout>
            <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-accent py-12">
                <div className="container mx-auto px-4">
                    {/* Header Section */}
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                            {t('contactUs.title')}
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {t('contactUs.subtitle')}
                        </p>
                    </div>

                    {/* Team Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                        {teamMembers.map((member, index) => (
                            <Card key={index} className="group relative overflow-hidden border-0 shadow-lg bg-card backdrop-blur-sm card-hover card-glow">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <CardHeader className="text-center pt-10 pb-2">
                                    <div className="mx-auto bg-background p-4 rounded-full shadow-md mb-4 group-hover:scale-110 transition-transform duration-300">
                                        {member.icon}
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-card-foreground">
                                        {language === 'th' ? member.nameTh : member.nameEn}
                                    </CardTitle>
                                    <CardDescription className="text-primary font-medium text-base">
                                        {language === 'th' ? member.nameEn : member.nameTh}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-center pb-10">
                                    <p className="text-muted-foreground">{t('contactUs.developer')}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Organization / Footer Info */}
                    <div className="max-w-4xl mx-auto">
                        <Card className="bg-slate-900 dark:bg-slate-950 text-white border-0 shadow-2xl overflow-hidden relative">
                            {/* Background Pattern */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-20 -translate-x-1/2 translate-y-1/2"></div>

                            <CardContent className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 relative z-10 gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                                        <School className="w-10 h-10 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1">
                                            {language === 'th' ? 'วิศวกรรมคอมพิวเตอร์ รุ่นที่ 14' : 'Computer Engineering Class 14'}
                                        </h3>
                                        <p className="text-slate-300">
                                            {language === 'th' ? 'Computer Engineering Class 14' : 'วิศวกรรมคอมพิวเตอร์ รุ่นที่ 14'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center md:text-right">
                                    <h4 className="text-xl font-semibold text-blue-300 mb-1">
                                        {language === 'th' ? 'มหาวิทยาลัยราชภัฏสวนสุนันทา' : 'Suan Sunandha Rajabhat University'}
                                    </h4>
                                    <p className="text-slate-400 text-sm">
                                        {language === 'th' ? 'Suan Sunandha Rajabhat University' : 'มหาวิทยาลัยราชภัฏสวนสุนันทา'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ContactUs;
