"use client";
import { useStore } from "@nanostores/react";
import { ConfigProvider } from "antd";
import { ReactNode } from "react";
import { darkTheme, lightTheme } from "../config/antd-theme";
import { themeStore } from "../store/theme";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useStore(themeStore);

  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  return <ConfigProvider theme={currentTheme}>{children}</ConfigProvider>;
};

export default ThemeProvider;
