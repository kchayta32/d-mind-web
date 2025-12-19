import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, Language } from '@/i18n/translations';

type LanguageProviderProps = {
    children: React.ReactNode;
    defaultLanguage?: Language;
    storageKey?: string;
};

type LanguageProviderState = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string) => string;
};

const initialState: LanguageProviderState = {
    language: 'th',
    setLanguage: () => null,
    t: (key: string) => key,
};

const LanguageContext = createContext<LanguageProviderState>(initialState);

export function LanguageProvider({
    children,
    defaultLanguage = 'th',
    storageKey = 'app-language',
}: LanguageProviderProps) {
    const [language, setLanguageState] = useState<Language>(
        () => (localStorage.getItem(storageKey) as Language) || defaultLanguage
    );

    useEffect(() => {
        localStorage.setItem(storageKey, language);
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    // Helper function to get nested translation
    const t = (path: string): string => {
        const keys = path.split('.');
        let current: any = translations[language];

        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Translation missing for key: ${path} in language: ${language}`);
                return path;
            }
            current = current[key];
        }

        return current as string;
    };

    const value = {
        language,
        setLanguage,
        t,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined)
        throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
