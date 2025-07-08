import { useState, useCallback, useRef } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Date;
}

interface UseChatOptions {
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
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setInput: (input: string) => void;
  append: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  reload: () => void;
  stop: () => void;
  setMessages: (messages: Message[]) => void;
}

export function useChat(options: UseChatOptions): UseChatReturn {
  const {
    api,
    initialMessages = [],
    onError,
    onFinish,
    onResponse,
    headers = {},
  } = options;

  // 状态管理
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 用于取消请求的 AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  // 生成消息 ID
  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // 处理输入变化
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  // 发送消息到 API
  const sendMessage = useCallback(async (messagesToSend: Message[]) => {
    setIsLoading(true);
    setError(null);

    // 创建新的 AbortController
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          messages: messagesToSend.map(({ id, createdAt, ...rest }) => rest),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 触发 onResponse 回调
      onResponse?.(response);

      if (!response.body) {
        throw new Error('Response body is empty');
      }

      // 创建 AI 助手消息
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      };

      // 添加助手消息到列表
      setMessages(prev => [...prev, assistantMessage]);

      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.choices?.[0]?.delta?.content) {
                const content = parsed.choices[0].delta.content;
                
                // 更新助手消息内容
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: msg.content + content }
                      : msg
                  )
                );
              }
            } catch (parseError) {
              console.warn('Failed to parse chunk:', data);
            }
          }
        }
      }

      // 获取最终的助手消息
      const finalMessage = { ...assistantMessage };
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.id === assistantMessage.id) {
          finalMessage.content = lastMessage.content;
        }
        return prev;
      });

      // 触发 onFinish 回调
      onFinish?.(finalMessage);

    } catch (err) {
      const error = err as Error;
      
      // 如果不是用户主动取消的请求，则处理错误
      if (error.name !== 'AbortError') {
        setError(error);
        onError?.(error);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [api, headers, onError, onFinish, onResponse]);

  // 提交表单
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      createdAt: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    await sendMessage(newMessages);
  }, [input, isLoading, messages, sendMessage]);

  // 追加消息
  const append = useCallback(async (message: Omit<Message, 'id' | 'createdAt'>) => {
    const newMessage: Message = {
      ...message,
      id: generateId(),
      createdAt: new Date(),
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    if (message.role === 'user') {
      await sendMessage(newMessages);
    }
  }, [messages, sendMessage]);

  // 重新加载最后一条消息
  const reload = useCallback(async () => {
    if (messages.length === 0) return;

    // 找到最后一条用户消息
    const lastUserMessageIndex = messages.findLastIndex(msg => msg.role === 'user');
    
    if (lastUserMessageIndex === -1) return;

    // 重新发送从最后一条用户消息开始的所有消息
    const messagesToReload = messages.slice(0, lastUserMessageIndex + 1);
    setMessages(messagesToReload);
    
    await sendMessage(messagesToReload);
  }, [messages, sendMessage]);

  // 停止当前请求
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
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
}
