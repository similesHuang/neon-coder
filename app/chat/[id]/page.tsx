"use client";
import { SendOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatHistoryItem } from "../../types/common";

const { TextArea } = Input;

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;
  const [chatData, setChatData] = useState<ChatHistoryItem | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mockChatData: ChatHistoryItem = {
      id: chatId,
      urlId: chatId,
      description: `聊天记录 ${chatId}`,
      timestamp: new Date().toLocaleDateString("zh-CN"),
      messages: [
        { role: "user", content: `这是聊天 ${chatId} 中的用户消息` },
        {
          role: "assistant",
          content: `这是针对聊天 ${chatId} 的 AI 助手回复，为您提供编程帮助和建议。`,
        },
        { role: "user", content: "请继续我们的对话" },
        {
          role: "assistant",
          content:
            "当然！我很乐意继续我们的对话。有什么编程问题我可以帮助您解决吗？",
        },
      ],
    };

    setChatData(mockChatData);
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    setLoading(true);

    // 添加用户消息
    const newUserMessage = { role: "user" as const, content: inputValue };
    setChatData((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, newUserMessage],
          }
        : null
    );

    // 清空输入框
    setInputValue("");

    // 模拟 AI 回复
    setTimeout(() => {
      const aiResponse = {
        role: "assistant" as const,
        content: "这是模拟的 AI 回复。在实际应用中，这里会调用 LLM API。",
      };
      setChatData((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, aiResponse],
            }
          : null
      );
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!chatData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-xl mb-2">加载中...</div>
          <div className="text-sm">正在获取聊天记录 {chatId}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* 聊天头部 */}
      <div className="px-6 py-4 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {chatData.description}
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {chatData.timestamp} • {chatData.messages.length} 条消息 • ID:{" "}
          {chatId}
        </div>
      </div>

      {/* 聊天消息列表 */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {chatData.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              <div className="text-xs mb-2 opacity-70 capitalize">
                {message.role === "user" ? "用户" : "AI 助手"}
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
              <div className="text-xs mb-2 opacity-70">AI 助手</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="px-6 py-4 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex space-x-3 items-end">
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息... (Enter 发送，Shift+Enter 换行)"
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="flex-1"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            loading={loading}
            disabled={!inputValue.trim()}
            size="large"
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
}
