import React from 'react';
import { Download, Smartphone, CheckCircle, Bell, CloudRain, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageProvider';

const AppDownloadSection = () => {
    const { t } = useLanguage();

    return (
        <section id="download-section" className="py-20 relative overflow-hidden bg-background transition-colors duration-300">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/5 skew-x-12 translate-x-1/4 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Content */}
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <div>
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4 border border-primary/20">
                                {t('appDownload.badge')}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
                                {t('appDownload.titleLine1')}<br />
                                <span className="text-primary">{t('appDownload.titleLine2')}</span>
                            </h2>
                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                                {t('appDownload.description')}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-foreground">{t('appDownload.realtimeTitle')}</p>
                                    <p className="text-xs text-muted-foreground">{t('appDownload.realtimeDesc')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-primary">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-foreground">{t('appDownload.mobileTitle')}</p>
                                    <p className="text-xs text-muted-foreground">{t('appDownload.mobileDesc')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                            <Button className="h-14 px-8 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl shadow-xl flex items-center gap-3 group transition-all hover:-translate-y-1">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-8 group-hover:opacity-90 transition-opacity" />
                            </Button>

                            <Button variant="outline" className="h-14 px-8 border border-border text-foreground hover:bg-muted rounded-xl flex items-center gap-3 bg-card transition-all hover:-translate-y-1 shadow-sm">
                                <Download className="w-5 h-5 text-primary" />
                                <div className="text-left leading-tight">
                                    <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t('appDownload.downloadApk')}</span>
                                    <span className="block text-sm font-bold">{t('appDownload.directLink')}</span>
                                </div>
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            {t('appDownload.reqNote')}
                        </p>
                    </div>

                    {/* Right Visual / Mockup */}
                    <div className="flex-1 relative w-full max-w-md lg:max-w-full flex justify-center lg:justify-end">
                        <div className="relative">
                            {/* Phone Frame Mockup */}
                            <div className="relative z-10 w-[280px] h-[580px] bg-slate-900 rounded-[3rem] p-4 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-900/50">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20"></div>
                                <div className="w-full h-full bg-card rounded-[2.2rem] overflow-hidden relative group">
                                    {/* Fake App UI */}
                                    <div className="absolute top-0 w-full h-full bg-background flex flex-col">
                                        <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-b-[3rem] shadow-lg flex items-center justify-center">
                                            <span className="text-2xl font-bold text-white">D-MIND</span>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div className="h-24 bg-card rounded-2xl shadow-sm border border-border p-4 animate-pulse">
                                                <div className="h-3 w-1/2 bg-muted rounded mb-2"></div>
                                                <div className="h-2 w-3/4 bg-muted/60 rounded"></div>
                                            </div>
                                            <div className="h-24 bg-red-500/10 rounded-2xl shadow-sm border border-red-500/20 p-4">
                                                <div className="flex items-center gap-2 text-red-500 font-bold mb-1 text-sm">
                                                    <Bell className="w-4 h-4" /> Alert
                                                </div>
                                                <div className="h-2 w-full bg-red-500/20 rounded"></div>
                                            </div>
                                        </div>
                                        {/* Touch interaction overlay */}
                                        <div className="absolute bottom-0 w-full p-4 bg-card/80 backdrop-blur-sm border-t border-border">
                                            <div className="flex justify-around text-muted-foreground">
                                                <div className="w-6 h-6 rounded-full bg-muted"></div>
                                                <div className="w-6 h-6 rounded-full bg-primary"></div>
                                                <div className="w-6 h-6 rounded-full bg-muted"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <Card className="absolute top-1/2 -right-12 lg:-right-24 -translate-y-1/2 w-48 bg-card/90 backdrop-blur transform rotate-6 animate-in slide-in-from-right-8 duration-1000 shadow-xl border border-border z-20 hidden sm:block">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <CloudRain className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-card-foreground">{t('appDownload.weather')}</p>
                                        <p className="text-xs text-muted-foreground">{t('appDownload.preciseData')}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="absolute bottom-20 -left-12 lg:-left-20 w-48 bg-card/90 backdrop-blur transform -rotate-3 animate-in slide-in-from-left-8 duration-1000 delay-300 shadow-xl border border-border z-20 hidden sm:block">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-card-foreground">{t('appDownload.safety')}</p>
                                        <p className="text-xs text-muted-foreground">{t('appDownload.statusSafe')}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AppDownloadSection;

