import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Theme = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
    theme: "system",
    resolvedTheme: "light",
    setTheme: () => null,
    toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(() => {
        try {
            return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
        } catch {
            return defaultTheme;
        }
    });

    const getSystemTheme = (): ResolvedTheme => {
        if (typeof window === "undefined") return "light";
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
        if (theme === "system") {
            return getSystemTheme();
        }
        return theme;
    });

    // Apply theme changes to the DOM
    useEffect(() => {
        const root = window.document.documentElement;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = (currentTheme: Theme) => {
            const actualTheme: ResolvedTheme = currentTheme === "system"
                ? (mediaQuery.matches ? "dark" : "light")
                : currentTheme;

            root.classList.remove("light", "dark");
            root.classList.add(actualTheme);
            root.style.colorScheme = actualTheme;
            setResolvedTheme(actualTheme);
        };

        applyTheme(theme);

        const handleSystemThemeChange = () => {
            if (theme === "system") {
                applyTheme("system");
            }
        };

        mediaQuery.addEventListener("change", handleSystemThemeChange);
        return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }, [theme]);

    const setTheme = useCallback((newTheme: Theme) => {
        try {
            localStorage.setItem(storageKey, newTheme);
        } catch (e) {
            console.error("Failed to save theme to localStorage", e);
        }
        setThemeState(newTheme);
    }, [storageKey]);

    const toggleTheme = useCallback(() => {
        const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
    }, [resolvedTheme, setTheme]);

    const value = {
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};
