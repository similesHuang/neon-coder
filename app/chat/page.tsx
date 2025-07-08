"use client";
import { MessageOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";

export default function ChatPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <MessageOutlined className="text-6xl text-gray-400 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          聊天功能
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          请从左侧选择一个历史对话，或者返回主页开始新的聊天。
        </p>
        <Link href="/">
          <Button type="primary" size="large">
            返回主页
          </Button>
        </Link>
      </div>
    </div>
  );
}
