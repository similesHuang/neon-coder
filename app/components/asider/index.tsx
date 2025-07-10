"use client";
import dark from "@/../public/assets/dark.svg";
import light from "@/../public/assets/light.svg";
import logo from "@/favicon.ico";
import { ChatHistoryItem } from "@/types/common";
import { MenuUnfoldOutlined, PlusOutlined } from "@ant-design/icons";
import { useStore } from "@nanostores/react";
import { Drawer, Popover } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { themeStore } from "../../store/theme";
import ThemeMode from "../themeMode";

export const Asider: React.FC<{
  open?: boolean;
  onClose?: () => void;
  onChatSelect?: (chat: ChatHistoryItem) => void;
  selectedChatId?: string | null;
}> = ({ onClose, open, onChatSelect, selectedChatId }) => {
  const [historyList, setHistoryList] = useState<ChatHistoryItem[]>([]); // 历史消息
  const theme = useStore(themeStore);
  const router = useRouter();

  const themeColors = useMemo(() => {
    return theme === "dark"
      ? {
          backgroundColor: "#1f1f1f", // 暗色模式背景
          footerBg: "#1f1f1f",
        }
      : {
          backgroundColor: "#F3F4F6", // 浅色模式背景
          footerBg: "#F3F4F6",
        };
  }, [theme]);

  const handleNewChat = () => {
    router.push("/chat/new");
    onClose?.();
  };

  return (
    <Drawer
      open={open}
      width={300}
      placement="left"
      rootStyle={{ outlineColor: "#fff" }}
      styles={{
        body: {
          padding: 16,
          backgroundColor: themeColors.backgroundColor,
        },
        footer: {
          backgroundColor: themeColors.footerBg,
        },
      }}
      closeIcon={null}
      onClose={onClose}
      footer={
        <ThemeMode
          modes={[
            { key: "light", imgUrl: light },
            { key: "dark", imgUrl: dark },
          ]}
        />
      }
    >
      <div className="flex flex-col gap-4 mb-4 neon-asider">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Image
                  src={logo}
                  alt="编程助手"
                  height={20}
                  width={20}
                  style={{ borderRadius: 4 }}
                ></Image>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold ">Neon Coder</span>
              <span className="text-xs text-gray-500">AI 编程助手</span>
            </div>
          </div>

          <Popover content="关闭侧边栏">
            <div className="p-2 cursor-pointer" onClick={onClose}>
              <MenuUnfoldOutlined
                style={{ fontSize: "20px" }}
                className="text-gray-600 dark:text-gray-300"
              />
            </div>
          </Popover>
        </div>
        <div className="new-chat" onClick={handleNewChat}>
          <PlusOutlined className="mr-4" />
          <span>新对话</span>
        </div>
      </div>
    </Drawer>
  );
};

export default Asider;
