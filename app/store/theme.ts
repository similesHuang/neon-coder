import { isClient } from "@/utils";
import { atom } from "nanostores";

export type Theme = "dark" | "light";

export const kTheme = "neon_theme";

export function themeIsDark() {
  return themeStore.get() === "dark";
}

export const DEFAULT_THEME = "light";

export const themeStore = atom<Theme>(DEFAULT_THEME);

function setThemeToDOM(theme: Theme) {
  if (!isClient()) return;

  document.querySelector("html")?.setAttribute("data-theme", theme);
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
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
    setThemeToDOM(theme);
  }
}
