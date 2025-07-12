"use client";
import useChat from "@/hooks/useChat";
import { chatStore } from "@/store/chat";
import { Message } from "@/types/common";
import { Affix } from "antd";
import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

const EXAMPLE_PROMPTS = ["基础架构前端应用"];

const NenoChat: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    isLoading,
    isStreaming,
    error,
    handleInputChange,
    handleSubmit,
    setInput,
    stop,
    append,
  } = useChat({
    api: "/api/llm",
  });

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
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSubmit(fakeEvent);
    }, 0);
  };

  const abort = () => {
    stop();
    chatStore.setKey("aborted", true);
    // workbenchStore.abortAllActions();
  };

  return (
    <>
      <div
        className="flex flex-col"
        style={{ overflowY: "scroll", height: "calc(100vh - 200px)" }}
      >
        <div className="flex-1 overflow-y-auto" ref={scrollRef}>
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
          {messages?.map((msg: Message) => {
            if (msg?.role !== "user") {
              return (
                <div
                  key={msg?.id}
                  className="p-[12px] text-justify markdown-body"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {msg?.content || ""}
                  </ReactMarkdown>
                </div>
              );
            }
            return (
              <div key={msg?.id} className="text-right p-[12px]">
                <span
                  className="px-[16px] py-[9px] text-justify"
                  style={{ background: "#f5f5f5", borderRadius: 4 }}
                >
                  {msg?.content}
                </span>
              </div>
            );
          })}
          {(isLoading || isStreaming) &&
            !messages.some(
              (msg) => msg.role === "assistant" && msg.content
            ) && (
              <div className="p-[12px] text-justify markdown-body flex items-center gap-2 text-gray-500">
                <span>{isLoading ? "正在思考中" : "正在生成回答"}</span>
                <span className="animate-bounce">...</span>
              </div>
            )}
        </div>
      </div>

      <Affix offsetBottom={0}>
        <div className="relative flex items-end">
          <textarea
            className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 pr-16 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="发送消息..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={2}
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3 flex gap-2">
            {isStreaming ? (
              <button
                onClick={abort}
                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                title="停止生成"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <rect x="6" y="6" width="8" height="8" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-full transition ${
                  input.trim() && !isLoading
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
                title="发送消息"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </Affix>
    </>
  );
};

export default NenoChat;
