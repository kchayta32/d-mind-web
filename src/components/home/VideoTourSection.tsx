import React, { useState } from 'react';
import { Play, ExternalLink, Cpu, Layers, Sparkles, Video, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const VideoTourSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="w-full py-10 sm:py-14 bg-gradient-to-b from-background via-slate-50/50 to-background dark:via-slate-900/30 border-y border-border/70 relative overflow-hidden transition-colors duration-300">
      {/* Glow accents */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800 shadow-sm">
            <Video className="w-3.5 h-3.5" />
            <span>Interactive Architecture Tour</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            Watch a one-minute video tour of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">d-mind-web</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Explore how D-MIND brings together real-time satellite remote sensing, weather radar, citizen crowdsourcing, and AI assistance into a unified disaster intelligence platform.
          </p>
        </div>

        {/* Main Grid: Video Player + Architecture Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Video Container (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col">
            <Card className="overflow-hidden border border-border/80 shadow-xl bg-card rounded-2xl flex-1 flex flex-col">
              <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center group overflow-hidden">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain bg-black"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src="/videos/kchayta32-d-mind-web-explained.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 bg-muted/30 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-background/80 border-border">
                    MP4 • 1080p
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Generated from GitDiagram
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://gitdiagram.com/kchayta32/d-mind-web"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5 font-medium rounded-lg">
                      <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                      <span>GitDiagram Spec</span>
                    </Button>
                  </a>
                  <a
                    href="https://github.com/kchayta32/d-mind-web"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="sm" className="text-xs h-8 gap-1.5 font-medium rounded-lg">
                      <span>GitHub Repo</span>
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* Architecture Overview & Info Container (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <Card className="border border-border/80 shadow-md bg-card/90 backdrop-blur-sm rounded-2xl flex-1 flex flex-col">
              <CardContent className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Info</span>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[11px] font-semibold">
                      System Diagram
                    </Badge>
                  </div>

                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    D-MIND is a Thailand-focused disaster management dashboard: people consult live hazard information, alerts and guidance, ask disaster questions, assess damage, and submit incident or victim reports for response. A separate SeismoGuard earthquake-warning application is included because the README identifies it as a major companion capability. The graph also shows scraping and the AI model API. Wiring for unsampled features is based on documented capabilities; uncertain implementation-level connections are omitted.
                  </p>

                  <div className="pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
                      <span>Architecture overview</span>
                    </div>
                    <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 mb-2">
                      <span>Read &gt;</span>
                    </div>
                    <div className="p-3 bg-muted/40 dark:bg-slate-900/50 rounded-xl border border-border/60 text-xs text-muted-foreground leading-relaxed">
                      D-MIND is a Thailand-focused disaster management dashboard: people consult live hazard information, alerts and guidance, ask disaster questions, assess damage, and submit incident or victim reports for response. A separate SeismoGuard earthquake-warning application is included because the README identifies it as a major companion capability. The graph also shows scraping and the AI model API. Wiring for unsampled features is based on documented capabilities; uncertain implementation-level connections are omitted.
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Diagram Source: <strong className="text-foreground font-semibold">kchayta32/d-mind-web</strong>
                  </span>
                  <a
                    href="https://gitdiagram.com/kchayta32/d-mind-web"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>View Interactive Diagram</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VideoTourSection;
