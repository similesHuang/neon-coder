"use client";
import useChat from "@/hooks/useChat";
import React, { useEffect, useRef } from "react";

const EXAMPLE_PROMPTS = [
  "用 React 和 Tailwind 写一个 todo 应用",
  "用 Astro 搭建一个简单博客",
  "用 Material UI 实现 cookie 同意弹窗",
  "写一个太空侵略者小游戏",
  "如何让 div 居中？",
];

const NenoChat: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    isLoading,
    error,
    handleInputChange,
    handleSubmit,
    setInput,
    stop,
  } = useChat({
    api: "/api/llm",
  });

  // 聊天是否已开始
  const chatStarted = messages.length > 0;

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // 示例 prompt 点击
  const handleExampleClick = (text: string) => {
    setInput(text);
    setTimeout(() => {
      // 触发发送
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSubmit(fakeEvent);
    }, 0);
  };

  return (
    <div className="relative flex flex-col w-full max-w-2xl h-[600px] bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* 聊天内容区 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {!chatStarted && (
          <div className="mt-24 text-center">
            <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-gray-100">
              Neon Coder
            </h1>
            <p className="mb-6 text-gray-500 dark:text-gray-400">
              让你的想法闪耀，AI 编程助手为你服务。
            </p>
            <div className="flex flex-col items-center space-y-2">
              {EXAMPLE_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 transition"
                  onClick={() => handleExampleClick(prompt)}
                  disabled={isLoading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={msg.id + idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[80%] whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {error && (
          <div className="text-center text-red-500 text-sm">
            {error.message || error}
          </div>
        )}
      </div>
      {/* 输入区 */}
      <form
        className="relative border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex items-end gap-2"
        onSubmit={handleSubmit}
      >
        <textarea
          className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          style={{ minHeight: 76, maxHeight: 300 }}
          placeholder="你想聊点什么？"
          value={input}
          disabled={isLoading}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="ml-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition disabled:opacity-50"
        >
          发送
        </button>
        {isLoading && (
          <button
            type="button"
            onClick={stop}
            className="ml-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            停止
          </button>
        )}
      </form>
    </div>
  );
};

export default NenoChat;
