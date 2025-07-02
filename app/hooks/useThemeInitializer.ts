"use client";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import {
  DEFAULT_THEME,
  kTheme,
  setTheme,
  Theme,
  themeStore,
} from "../store/theme";

export function useThemeInitializer() {
  const theme = useStore(themeStore);

  useEffect(() => {
    const persistedTheme = localStorage.getItem(kTheme) as Theme | undefined;
    const themeAttribute = document
      .querySelector("html")
      ?.getAttribute("data-theme") as Theme | undefined;

    const savedTheme = persistedTheme ?? themeAttribute ?? DEFAULT_THEME;

    if (savedTheme !== theme) {
      setTheme(savedTheme);
    } else {
      document.querySelector("html")?.setAttribute("data-theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  return theme;
}
