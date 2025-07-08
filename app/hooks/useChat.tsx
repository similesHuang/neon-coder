import { streamRequest } from "@/api/llm/streamRequest";
import { Message } from "@/types/common";
import { useCallback, useRef, useState } from "react";

interface ChatProps {
  api: string;
  initialMessages?: Message[];
  onError?: (error: Error) => void;
  onFinish?: (message: Message) => void;
  onResponse?: (response: Response) => void;
  headers?: Record<string, string>;
}
interface UseChatReturn {
  messages: Message[];
  input: string;
  isLoading: boolean;
  error: Error | null;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setInput: (input: string) => void;
  append: (message: Omit<Message, "id" | "createdAt">) => void;
  reload: () => void;
  stop: () => void;
  setMessages: (messages: Message[]) => void;
}
const useChat: (options: ChatProps) => UseChatReturn = (options) => {
  const {
    api,
    initialMessages = [],
    onError,
    onFinish,
    onResponse,
    headers = {},
  } = options;
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 中断网络请求
  const abortControllerRef = useRef<AbortController | null>(null);
  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).slice(2, 9);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );
  // 发送消息
  const sendMessage = useCallback(
    async (messagesToSend: Message[]) => {
      setIsLoading(true);
      setError(null);
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      try {
        await streamRequest({
          url: api,
          body: {
            messages: messagesToSend.map(({ id, timestamp, ...rest }) => rest),
          },
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          signal,
          onChunk: (chunk: string, fullcontent: string) => {
            if (signal.aborted) return;
            console.log("Received chunk:", chunk);
            // 更新助手消息内容
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: msg.content + chunk }
                  : msg
              )
            );
          },
          onComplete: (fullContent: string) => {
            if (signal.aborted) return;
            // 获取最终的助手消息
            setMessages((prev) => {
              const updatedMessages = prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: fullContent || msg.content }
                  : msg
              );

              // 获取最终消息用于 onFinish 回调
              const finalMessage = updatedMessages.find(
                (msg) => msg.id === assistantMessage.id
              );
              if (finalMessage) {
                onFinish?.(finalMessage);
              }

              return updatedMessages;
            });
          },
          onError: (error: Error) => {
            // 如果是用户主动取消，不显示错误
            if (error.name === "AbortError" || signal.aborted) {
              return;
            }

            setError(error);
            onError?.(error);

            // 移除未完成的助手消息
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== assistantMessage.id)
            );
          },
        });
      } catch (err) {
        const error = err as Error;

        // 如果是用户主动取消，不显示错误
        if (error.name === "AbortError" || signal.aborted) {
          return;
        }

        setError(error);
        onError?.(error);

        // 移除未完成的助手消息
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== assistantMessage.id)
        );
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
        abortControllerRef.current = null;
      }
    },
    [api, headers, onError, onFinish]
  );
  // 提交表单
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!input.trim() || isLoading) {
        return;
      }

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: input.trim(),
        timestamp: new Date().toISOString(),
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");

      await sendMessage(newMessages);
    },
    [input, isLoading, messages, sendMessage]
  );
  // 追加消息
  const append = useCallback(
    async (message: Omit<Message, "id" | "timestamp">) => {
      const newMessage: Message = {
        ...message,
        id: generateId(),
        timestamp: new Date().toISOString(),
      };

      const newMessages = [...messages, newMessage];
      setMessages(newMessages);

      if (message.role === "user") {
        await sendMessage(newMessages);
      }
    },
    [messages, sendMessage]
  );
  // 重新加载最后一条消息
  const reload = useCallback(async () => {
    if (messages.length === 0 || isLoading) return;

    // 找到最后一条用户消息
    const lastUserMessageIndex = messages.findLastIndex(
      (msg) => msg.role === "user"
    );

    if (lastUserMessageIndex === -1) return;

    // 移除最后一条助手消息（如果存在）
    const messagesToReload = messages.slice(0, lastUserMessageIndex + 1);
    setMessages(messagesToReload);

    await sendMessage(messagesToReload);
  }, [messages, sendMessage, isLoading]);

  // 停止当前请求 - 真正中断网络请求
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    messages,
    input,
    isLoading,
    error,
    handleInputChange,
    handleSubmit,
    setInput,
    append,
    reload,
    stop,
    setMessages,
  };
};
export default useChat;
