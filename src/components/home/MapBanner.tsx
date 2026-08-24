import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Map, ArrowRight, Activity, Navigation } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider';

const MapBanner: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <section className="w-full bg-card/60 py-12 border-y border-border relative overflow-hidden group transition-colors duration-300">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 transition-transform duration-500 hover:scale-[1.005]">

                    {/* Text / Content Side */}
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-primary text-xs font-semibold border border-primary/20 mb-2">
                            <Activity className="w-3.5 h-3.5 animate-pulse" />
                            {t('mapBanner.liveMonitoring')}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                            {t('mapBanner.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">{t('mapBanner.highlight')}</span>
                        </h2>
                        <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto md:mx-0 leading-relaxed">
                            {t('mapBanner.description')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-2 w-full sm:w-auto">
                            <Button
                                size="lg"
                                onClick={() => navigate('/disaster-map')}
                                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 group/btn font-semibold rounded-xl"
                            >
                                <Map className="mr-2 h-5 w-5" />
                                {t('mapBanner.openMap')}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => navigate('/incident-reports')}
                                className="w-full sm:w-auto border-border text-foreground hover:bg-muted font-medium rounded-xl"
                            >
                                {t('mapBanner.reportIncident')}
                            </Button>
                        </div>
                    </div>

                    {/* Visual / Icon Side */}
                    <div className="flex-1 w-full max-w-md relative flex justify-center items-center">
                        <div className="relative w-full aspect-video md:aspect-[2/1] bg-muted/40 rounded-2xl overflow-hidden border border-border shadow-inner group/map">
                            {/* Abstract Map UI representation */}
                            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] opacity-15 dark:opacity-10 bg-center bg-cover grayscale dark:invert"></div>

                            {/* Animated Pins */}
                            <div className="absolute top-1/2 left-1/3">
                                <div className="relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <div className="relative w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                                </div>
                            </div>
                            <div className="absolute top-1/3 left-2/3">
                                <div className="relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75 delay-150"></span>
                                    <div className="relative w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-sm"></div>
                                </div>
                            </div>
                            <div className="absolute bottom-1/4 left-1/2">
                                <div className="relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 delay-300"></span>
                                    <div className="relative w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                                </div>
                            </div>

                            {/* Overlay Glass Card */}
                            <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-md p-3 rounded-xl border border-border shadow-sm flex items-center gap-3 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-500">
                                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Navigation className="w-4 h-4 text-primary rotate-45" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{t('mapBanner.status')}</p>
                                    <p className="text-xs font-bold text-card-foreground">{t('mapBanner.trackingActive')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MapBanner;

