import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageProvider';
import { LegalTermsModal } from '@/components/common/LegalTermsModal';
import { ShieldCheck, Scale, AlertTriangle } from 'lucide-react';

const Footer: React.FC = () => {
    const { t } = useLanguage();
    const [legalModalOpen, setLegalModalOpen] = useState(false);
    const [legalTab, setLegalTab] = useState<'disclaimer' | 'pdpa' | 'attribution'>('disclaimer');

    const openLegal = (tab: 'disclaimer' | 'pdpa' | 'attribution') => {
        setLegalTab(tab);
        setLegalModalOpen(true);
    };

    return (
        <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12 border-t border-slate-800 relative overflow-hidden transition-colors duration-300">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <div className="mb-6 flex justify-center items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <span className="text-white font-bold text-lg">D</span>
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                        D-MIND
                    </span>
                </div>
                <p className="text-slate-300 dark:text-slate-400 mb-2 font-medium">
                    {t('common.copyright')}
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xl mx-auto">
                    {t('hero.subtitle')}
                </p>

                {/* Emergency & Official Notice */}
                <div className="mt-4 max-w-xl mx-auto p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400 flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>ข้อมูลมีวัตถุประสงค์เพื่อการเตือนภัยเบื้องต้น ในภาวะวิกฤตโปรดปฏิบัติตามคำสั่งของ ปภ. (1784) และ กทม. (1555)</span>
                </div>

                <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-slate-400 dark:text-slate-500">
                    <a href="https://d-mind.my.canva.site/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                        {t('menu.about')}
                    </a>
                    <button
                        type="button"
                        onClick={() => openLegal('pdpa')}
                        className="hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t('common.privacyPolicy')}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => openLegal('disclaimer')}
                        className="hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                        <Scale className="w-3.5 h-3.5" />
                        <span>{t('common.termsOfService')}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => openLegal('attribution')}
                        className="hover:text-blue-400 transition-colors cursor-pointer"
                    >
                        แหล่งข้อมูลเปิด (Open Data)
                    </button>
                    <a href="/contactme" className="hover:text-blue-400 transition-colors">
                        {t('common.contactSupport')}
                    </a>
                </div>
            </div>

            {/* Legal Terms & PDPA Modal */}
            <LegalTermsModal
                isOpen={legalModalOpen}
                onClose={() => setLegalModalOpen(false)}
                initialTab={legalTab}
            />
        </footer>
    );
};

export default Footer;
