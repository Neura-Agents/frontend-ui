import React, { createContext, useContext, useEffect, useState } from "react";
import { themes } from "@/theme/themes";
import type { ThemeConfig } from "@/theme/themes";

type ThemeId = string;

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeId;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  availableThemes: ThemeConfig[];
  currentThemeConfig: ThemeConfig | undefined;
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  availableThemes: themes,
  currentThemeConfig: themes.find(t => t.id === "light"),
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeId>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const themeFromUrl = urlParams.get('theme');
    if (themeFromUrl) {
      const found = themes.find(t => t.id === themeFromUrl) || themes.find(t => t.className === themeFromUrl);
      if (found) {
        const storageKeyToUse = storageKey || "neura-theme";
        localStorage.setItem(storageKeyToUse, found.id);
        return found.id;
      }
    }
    return (localStorage.getItem(storageKey) as ThemeId) || defaultTheme;
  });

  // Clean up URL parameters after processing
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('theme')) {
      urlParams.delete('theme');
      const newSearch = urlParams.toString();
      const newPath = window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
      window.history.replaceState({ ...window.history.state }, '', newPath);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all possible theme classes
    themes.forEach(t => {
      if (t.className !== 'system') {
        root.classList.remove(t.className);
      }
    });
    root.classList.remove("light", "dark"); // Just in case

    const themeConfig = themes.find(t => t.id === theme);
    if (themeConfig) {
      root.classList.add(themeConfig.className);
    } else {
      root.classList.add(theme); // Fallback to id if config not found
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: ThemeId) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
      if ((window as any).umami) {
        (window as any).umami.track('theme-change', { theme });
      }
    },
    availableThemes: themes,
    currentThemeConfig: themes.find(t => t.id === theme),
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
}

