import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { translations, Language } from '@/i18n/translations';

type LanguageProviderProps = {
    children: React.ReactNode;
    defaultLanguage?: Language;
    storageKey?: string;
};

type LanguageProviderState = {
    language: Language;
    setLanguage: (language: Language) => void;
    toggleLanguage: () => void;
    t: (key: string, paramsOrFallback?: Record<string, string | number> | string) => string;
};

const initialState: LanguageProviderState = {
    language: 'th',
    setLanguage: () => null,
    toggleLanguage: () => null,
    t: (key: string) => key,
};

const LanguageContext = createContext<LanguageProviderState>(initialState);

export function LanguageProvider({
    children,
    defaultLanguage = 'th',
    storageKey = 'app-language',
}: LanguageProviderProps) {
    const [language, setLanguageState] = useState<Language>(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved === 'th' || saved === 'en') {
                return saved as Language;
            }
            return defaultLanguage;
        } catch {
            return defaultLanguage;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, language);
        } catch (e) {
            console.error('Failed to save language to localStorage', e);
        }
        document.documentElement.lang = language;
    }, [language, storageKey]);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguageState((prev) => (prev === 'th' ? 'en' : 'th'));
    }, []);

    // Helper function to get nested translation with parameter interpolation and fallback
    const t = useCallback(
        (path: string, paramsOrFallback?: Record<string, string | number> | string): string => {
            const keys = path.split('.');
            
            // Helper to traverse object
            const traverse = (dict: any): any => {
                let current = dict;
                for (const key of keys) {
                    if (current === undefined || current === null || typeof current !== 'object') {
                        return undefined;
                    }
                    current = current[key];
                }
                return current;
            };

            // 1. Try current language
            let result = traverse(translations[language]);

            // 2. Fall back to Thai if missing in English
            if (result === undefined && language !== 'th') {
                result = traverse(translations.th);
            }

            // 3. Fall back to English if missing in Thai
            if (result === undefined && language !== 'en') {
                result = traverse(translations.en);
            }

            // 4. If string, interpolate parameters
            if (typeof result === 'string') {
                if (paramsOrFallback && typeof paramsOrFallback === 'object') {
                    return Object.entries(paramsOrFallback).reduce((str, [paramKey, paramVal]) => {
                        return str.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramVal));
                    }, result);
                }
                return result;
            }

            // 5. Fallback provided as string
            if (typeof paramsOrFallback === 'string') {
                return paramsOrFallback;
            }

            // 6. Return path as last resort
            return path;
        },
        [language]
    );

    const value = {
        language,
        setLanguage,
        toggleLanguage,
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
