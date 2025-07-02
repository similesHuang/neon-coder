import { CheckCircleTwoTone } from "@ant-design/icons";
import { useStore } from "@nanostores/react";
import Image from "next/image";
import React from "react";
import { setTheme, Theme, themeStore } from "../../store/theme";

type ModeProps = {
  key: string;
  imgUrl: string;
};

interface ThemeModeProps {
  modes: ModeProps[];
}

const ThemeMode: React.FC<ThemeModeProps> = ({ modes }) => {
  const theme = useStore(themeStore);

  const handleThemeChange = (selectedTheme: string) => {
    if (selectedTheme === theme) return;
    setTheme(selectedTheme as Theme);
  };

  const renderModeList = () => {
    if (modes.length) {
      return modes.map((mode) => {
        return (
          <div
            key={mode.key}
            className="flex flex-col items-center p-1 cursor-pointer"
            onClick={() => handleThemeChange(mode.key)}
          >
            <div
              className={`relative p-1 rounded border-2 ${
                theme === mode.key ? "border-blue-600" : "border-white"
              }`}
            >
              <Image src={mode.imgUrl} alt={`${mode.key} theme`} />
              {theme === mode.key && (
                <span className="absolute bottom-1 right-5">
                  <CheckCircleTwoTone />
                </span>
              )}
            </div>
            <span className="text-sm mt-1">
              {mode.key === "light" ? "浅色模式" : "深色模式"}
            </span>
          </div>
        );
      });
    }
    return <span className="text-gray-500">暂无主题</span>;
  };

  return (
    <div className="flex flex-col">
      <b> 主题切换</b>
      <div className="flex justify-around">{renderModeList()}</div>
    </div>
  );
};

export default ThemeMode;
