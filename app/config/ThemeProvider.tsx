"use client";
import { ConfigProvider } from "antd";
import { ReactNode } from "react";
import { useThemeInitializer } from "../hooks/useThemeInitializer";
import { darkTheme, lightTheme } from "./antd-theme";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useThemeInitializer();

  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  return <ConfigProvider theme={currentTheme}>{children}</ConfigProvider>;
};

export default ThemeProvider;
