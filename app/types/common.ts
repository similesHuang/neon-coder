export interface Message {
  role: "user" | "system" | "assistant";
  content: string;
}

export interface ChatHistoryItem {
  id: string;
  urlId?: string;
  description?: string;
  messages: Message[];
  timestamp: string;
}
