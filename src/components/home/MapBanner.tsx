import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Map, ArrowRight, Activity, Navigation } from 'lucide-react';

const MapBanner: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="w-full bg-white py-12 border-y border-slate-100 relative overflow-hidden group">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="bg-white/50 backdrop-blur-sm border border-slate-100 rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-8 transition-transform duration-500 hover:scale-[1.01]">

                    {/* Text / Content Side */}
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100 mb-2">
                            <Activity className="w-3 h-3 animate-pulse" />
                            Live Monitoring
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Disaster Map</span>
                        </h2>
                        <p className="text-slate-600 text-lg max-w-lg mx-auto md:mx-0">
                            Real-time tracking of floods, air quality, and emergency incidents across Thailand. Visualized for better preparedness.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                            <Button
                                size="lg"
                                onClick={() => navigate('/disaster-map')}
                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 group/btn"
                            >
                                <Map className="mr-2 h-5 w-5" />
                                Open Map
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => navigate('/incident-reports')}
                                className="border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                                Report Incident
                            </Button>
                        </div>
                    </div>

                    {/* Visual / Icon Side */}
                    <div className="flex-1 w-full max-w-md relative flex justify-center items-center">
                        <div className="relative w-full aspect-video md:aspect-[2/1] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner group/map">
                            {/* Abstract Map UI representation */}
                            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] opacity-10 bg-center bg-cover grayscale hue-rotate-180 mix-blend-multiply"></div>

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
                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-white/50 shadow-sm flex items-center gap-3 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-500">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Navigation className="w-5 h-5 text-blue-600 rotate-45" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Status</p>
                                    <p className="text-sm font-bold text-slate-800">Tracking Active</p>
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
