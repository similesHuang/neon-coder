"use client";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Asider from "../components/asider";
import { ChatHistoryItem } from "../types/common";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentChatId = (): string | null => {
    const match = pathname.match(/^\/chat\/(.+)$/);
    return match ? match[1] : null;
  };

  const handleChatSelect = (chat: ChatHistoryItem) => {
    router.push(`/chat/${chat.id}`);
    setCollapsed(false);
  };

  return (
    <div className="flex h-screen">
      <Asider
        open={collapsed}
        onClose={() => setCollapsed(false)}
        onChatSelect={handleChatSelect}
        selectedChatId={getCurrentChatId()}
      />

      <div className="flex-1 flex flex-col">
        <div className="py-3 px-[16px]">
          <Popover content="打开侧边栏">
            <span
              onClick={() => setCollapsed(!collapsed)}
              className="cursor-pointer rounded"
            >
              {collapsed ? (
                <MenuUnfoldOutlined style={{ fontSize: "22px" }} />
              ) : (
                <MenuFoldOutlined style={{ fontSize: "22px" }} />
              )}
            </span>
          </Popover>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col">{children}</div>
      </div>
    </div>
  );
}
