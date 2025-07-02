import { isClient } from "@/utils";
import { atom } from "nanostores";

export type Theme = "dark" | "light";

export const kTheme = "neon_theme";

export function themeIsDark() {
  return themeStore.get() === "dark";
}

export const DEFAULT_THEME = "light";

export const themeStore = atom<Theme>(initStore());

function initStore() {
  if (isClient()) {
    const persistedTheme = localStorage.getItem(kTheme) as Theme | undefined;
    const themeAttribute = document
      .querySelector("html")
      ?.getAttribute("data-theme");

    return persistedTheme ?? (themeAttribute as Theme) ?? DEFAULT_THEME;
  }

  return DEFAULT_THEME;
}

export function toggleTheme() {
  const currentTheme = themeStore.get();
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
}

export function setTheme(theme: Theme) {
  themeStore.set(theme);

  if (isClient()) {
    localStorage.setItem(kTheme, theme);
    document.querySelector("html")?.setAttribute("data-theme", theme);
    // 同时设置 CSS 类名，方便 Tailwind 的 dark: 类使用
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
}
